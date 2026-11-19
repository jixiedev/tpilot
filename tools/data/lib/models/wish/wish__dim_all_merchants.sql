{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.dim_all_merchants.

  Physical grain: one row per merchant_id (Mongo ObjectId hex string). The
  table is a Hive external Parquet table in S3, rebuilt by the Airflow DAG
  `DailyIncrementalMerchants` (schedule `0 3 * * *`, America/Los_Angeles):
  the DAG writes a temp table and atomically swaps it into
  `wish.dim_all_merchants`, so the table always holds the latest full
  snapshot. No Airflow / Spark ETL logic is reimplemented here and the grain
  is not changed.

  The table is NOT partitioned (`SHOW CREATE TABLE` declares no partition
  column), so there is no partition time dimension. The closest analogue to
  a partition is the `time` column -- the ingestion-time epoch written by the
  producer DAG at run time -- which is exposed as `snapshot_ts` /
  `snapshot_date`. It is a constant for the whole snapshot, i.e. it answers
  "which daily snapshot did this row come from", not "when did something
  happen to this merchant".

  Every documented physical column is re-exposed as-is (no SELECT *); the
  wrapper only adds derived columns:
    * `<enum>_name`         human-readable label for the documented code
                            columns (raw code is kept as a categorical
                            dimension as well).
    * `*_epoch`             unix seconds as bigint (join-friendly).
    * `*_ts`                unix seconds as timestamp.
    * `*_calendar_date`     unix seconds as date -- the day-grain time
                            dimensions (the project time spine is day).
    * `reporting_country`   convenience COALESCE of `suspected_country` and
                            `merchant_country` (NOT a documented business
                            rule -- both source columns are exposed too).

  Timestamp encoding: the varchar columns that the table documentation
  describes as timestamps (`approved_date`, `disable_date`,
  `payment_withhold_until`, `erp_promo_start_time`, `erp_promo_end_time`,
  `onboarding_completed_time`) carry unix seconds as digit strings, and
  `time`, `reg_time` and `bba_approved_date` carry unix seconds as bigint.
  The documentation requires `CAST(NULLIF(field, '') AS bigint)` before
  `from_unixtime(...)` because the upstream dump writes an empty string for
  missing datetimes; `try_cast` is used so a non-numeric sentinel yields
  NULL instead of failing the whole query. Epoch 0 is treated as "not set"
  for `reg_time` and `bba_approved_date`.

  Duration-like (non-event-time) fields: `avg_fulfillment_time` and
  `avg_shipping_time` are seconds, `us_30_day_avg_fulfillment_time` and
  `us_30_day_avg_delivery_time` are days (per the documentation's cited
  source `clroot/sweeper/model/commerce.py`). The table documentation itself
  only states that they are latencies, so the units come from that source.

  PII columns (personal names, e-mail, phone numbers, street addresses) are
  exposed by the underlying table but are deliberately NOT declared as
  MetricFlow dimensions in the semantic model.

  Source: wish.dim_all_merchants
  (Airflow DAG DailyIncrementalMerchants;
  documentation/llm_generated/hive/wish/dim_all_merchants.md).
#}

select
    -- ---- identity and keys ---------------------------------------------------
    m.merchant_id,
    m.group_id,
    m.super_group_id,
    m.erp_code,
    m.partner_name,
    m.carrier_code,
    m.fbw_partner_id,
    m.fbw_warehouse_id,

    -- ---- snapshot watermark --------------------------------------------------
    -- `time` is the ingestion-time epoch of the producer DAG run, NOT a
    -- merchant event time. It is constant for the whole snapshot.
    m.time,
    cast(from_unixtime(m.time) as timestamp) as snapshot_ts,
    cast(from_unixtime(m.time) as date) as snapshot_date,

    -- ---- registration time ---------------------------------------------------
    -- `reg_time` is derived from the ObjectId prefix
    -- (CONV(SUBSTRING(merchant_id, 1, 8), 16, 10)); epoch 0 means the
    -- ObjectId prefix could not be parsed and is treated as "not set".
    m.reg_time,
    cast(from_unixtime(nullif(m.reg_time, 0)) as timestamp) as reg_ts,
    cast(from_unixtime(nullif(m.reg_time, 0)) as date) as reg_date,

    -- ---- lifecycle state -----------------------------------------------------
    m.state,
    case m.state
        when 1 then 'PENDING'
        when 2 then 'APPROVED'
        when 3 then 'DISABLED'
        when 4 then 'REQUEST_INFO'
        when 5 then 'PENDING_PHONE'
        when 6 then 'VACATION'
        when 7 then 'PENDING_EMAIL'
        when 8 then 'WISH_EXPRESS_ONLY'
        else cast(m.state as varchar)
    end as state_name,

    m.state_before_disable,
    case m.state_before_disable
        when '1' then 'PENDING'
        when '2' then 'APPROVED'
        when '3' then 'DISABLED'
        when '4' then 'REQUEST_INFO'
        when '5' then 'PENDING_PHONE'
        when '6' then 'VACATION'
        when '7' then 'PENDING_EMAIL'
        when '8' then 'WISH_EXPRESS_ONLY'
        else m.state_before_disable
    end as state_before_disable_name,

    m.merchant_state,
    case m.merchant_state
        when 1 then 'PENDING'
        when 2 then 'APPROVED'
        when 3 then 'DISABLED'
        when 4 then 'REQUEST_INFO'
        when 5 then 'PENDING_PHONE'
        when 6 then 'VACATION'
        when 7 then 'PENDING_EMAIL'
        when 8 then 'WISH_EXPRESS_ONLY'
        else cast(m.merchant_state as varchar)
    end as merchant_state_name,

    m.wish_express_state,
    case m.wish_express_state
        when 1 then 'NONE'
        when 2 then 'PENDING'
        when 3 then 'APPROVED'
        when 4 then 'SUSPENDED'
        when 5 then 'REJECTED'
        when 6 then 'TRIAL_PHASE'
        else cast(m.wish_express_state as varchar)
    end as wish_express_state_name,

    m.review_state,
    case m.review_state
        when 0 then 'ALLOW_COUNTERFEIT_REVIEW'
        when 1 then 'NO_COUNTERFEIT_REVIEW'
        when 2 then 'EXISTING_MERCHANT_EDUCATION'
        else cast(m.review_state as varchar)
    end as review_state_name,

    m.auto_payment_status,
    case m.auto_payment_status
        when 1 then 'MANUAL'
        when 2 then 'NET_N'
        else cast(m.auto_payment_status as varchar)
    end as auto_payment_status_name,

    m.ticket_handling_state,
    case m.ticket_handling_state
        when 1 then 'BASIC'
        when 2 then 'ALL_NON_ANGRY'
        when 3 then 'ALL'
        when 4 then 'NONE'
        when 5 then 'BASIC_TRIAL'
        when 6 then 'WHITE_GLOVE'
        when 7 then 'SHORT_WHITE_GLOVE'
        else cast(m.ticket_handling_state as varchar)
    end as ticket_handling_state_name,

    m.epc_state,
    case m.epc_state
        when 1 then 'NONE'
        when 2 then 'PENDING'
        when 3 then 'REJECTED'
        when 4 then 'APPROVED'
        when 5 then 'SUSPENDED'
        when 6 then 'EXITED'
        when 7 then 'PRE_APPROVED'
        else cast(m.epc_state as varchar)
    end as epc_state_name,

    m.disable_reason_category,
    case m.disable_reason_category
        when '1' then 'MERCHANT_REQUEST'
        when '2' then 'INVALID_SIGNUP_DATA'
        when '3' then 'MERCHANT_VIOLATE_TOS'
        when '4' then 'HIGH_REFUND_RATIO'
        when '5' then 'DUP_REG_SAME_GROUP'
        when '6' then 'DUP_REG_DIFF_GROUPS'
        when '7' then 'AGE_UNDER_18'
        when '8' then 'DOCUMENT_FORGERY'
        when '9' then 'NOT_SUBMITTED_FILES'
        when '10' then 'INDIVIDUAL_BUSINESS'
        when '11' then 'BUSINESS_ANOMALY'
        when '12' then 'DISCREPANT_BUSINESS'
        when '13' then 'IP_INFRINGEMENT'
        when '14' then 'INVALID_STORE_NAME'
        when '15' then 'NOT_RESPONDED_REQUEST_INFO'
        when '16' then 'CLOSE_ACCOUNT'
        when '17' then 'MERCHANT_VIOLATE_TOS_IN_OFAC'
        when '18' then 'DUP_NAME_DETECTED'
        when '19' then 'IDENTITY_REVERIFICATION_FAILED'
        else m.disable_reason_category
    end as disable_reason_category_name,

    m.merchant_payment_policy,
    case m.merchant_payment_policy
        when 1 then 'NORMAL'
        when 100 then 'EXPEDITED_MKL22133'
        when 101 then 'EXPEDITED_TRO_RESOLVED'
        when 199 then 'EXPEDITED_OTHER'
        when 1000 then 'NOT_EXPEDITED'
        else cast(m.merchant_payment_policy as varchar)
    end as merchant_payment_policy_name,

    m.entity_type,
    case m.entity_type
        when '1' then 'INDIVIDUAL'
        when '2' then 'COMPANY'
        else m.entity_type
    end as entity_type_name,

    m.store_id_source,
    case m.store_id_source
        when 1 then 'MANUAL'
        when 2 then 'ERP'
        when 3 then 'PSP'
        when 4 then 'PAYPAL'
        else cast(m.store_id_source as varchar)
    end as store_id_source_name,

    m.payment_provider,
    case m.payment_provider
        when '0' then 'PAYPAL'
        when '1' then 'BILL'
        when '2' then 'CARDINFOLINK'
        when '3' then 'PAYONEER'
        when '4' then 'PINGPONG'
        when '5' then 'UMPAY'
        when '6' then 'PAYPAL_MERCH'
        when '7' then 'UMPAY_ENTERPRISE'
        when '8' then 'ALLPAY'
        when '9' then 'WISHPAY'
        when '10' then 'PAYECO2'
        when '11' then 'UMPAY2'
        when '12' then 'LIANLIAN'
        when '13' then 'PAYPAL_EEA'
        else m.payment_provider
    end as payment_provider_name,

    m.strategic_flag,
    case m.strategic_flag
        when 0 then 'NOT_STRATEGIC'
        when 1 then 'STRATEGIC'
        else cast(m.strategic_flag as varchar)
    end as strategic_flag_name,

    -- ---- segmentation and priority (rule-based, computed by the producer DAG) --
    m.segment,
    m.wish_priority,
    m.from_trusted_channel,
    m.is_deliverr_merchant,
    m.signup_source,
    m.group_name,
    m.group_name_en,
    m.seller_priority,
    m.ced_priority,
    m.channel_advisor_priority,
    m.channel_partners,
    m.paypal_priority,
    m.erp_partner_state,
    m.brand_partner_state,
    m.bd_rep,

    -- ---- approval / disable / onboarding timestamps --------------------------
    m.approved_date,
    try_cast(nullif(m.approved_date, '') as bigint) as approved_epoch,
    cast(from_unixtime(try_cast(nullif(m.approved_date, '') as bigint)) as timestamp) as approved_ts,
    cast(from_unixtime(try_cast(nullif(m.approved_date, '') as bigint)) as date) as approved_calendar_date,

    m.disable_date,
    try_cast(nullif(m.disable_date, '') as bigint) as disable_epoch,
    cast(from_unixtime(try_cast(nullif(m.disable_date, '') as bigint)) as timestamp) as disable_ts,
    cast(from_unixtime(try_cast(nullif(m.disable_date, '') as bigint)) as date) as disable_calendar_date,

    m.onboarding_completed_time,
    try_cast(nullif(m.onboarding_completed_time, '') as bigint) as onboarding_completed_epoch,
    cast(from_unixtime(try_cast(nullif(m.onboarding_completed_time, '') as bigint)) as timestamp) as onboarding_completed_ts,
    cast(from_unixtime(try_cast(nullif(m.onboarding_completed_time, '') as bigint)) as date) as onboarding_completed_calendar_date,

    -- Blanket-auth approval timestamp; NULL when the merchant is not in
    -- `analytics.dim_blanket_auth_merchants`.
    m.bba_approved_date,
    nullif(m.bba_approved_date, 0) as bba_approved_epoch,
    cast(from_unixtime(nullif(m.bba_approved_date, 0)) as timestamp) as bba_approved_ts,
    cast(from_unixtime(nullif(m.bba_approved_date, 0)) as date) as bba_approved_calendar_date,

    -- Payment hold end date. The application may store the far-future
    -- sentinel 3000-01-01 for a permanent hold, so the value is only
    -- accepted inside the 2000-01-01 .. 2100-01-01 window.
    m.payment_withhold_until,
    try_cast(nullif(m.payment_withhold_until, '') as bigint) as payment_withhold_until_epoch,
    case
        when try_cast(nullif(m.payment_withhold_until, '') as bigint)
            between 946684800 and 4102444800
        then cast(from_unixtime(try_cast(nullif(m.payment_withhold_until, '') as bigint)) as timestamp)
        else cast(null as timestamp)
    end as payment_withhold_until_ts,
    case
        when try_cast(nullif(m.payment_withhold_until, '') as bigint)
            between 946684800 and 4102444800
        then cast(from_unixtime(try_cast(nullif(m.payment_withhold_until, '') as bigint)) as date)
        else cast(null as date)
    end as payment_withhold_until_calendar_date,

    m.erp_promo_start_time,
    try_cast(nullif(m.erp_promo_start_time, '') as bigint) as erp_promo_start_epoch,
    cast(from_unixtime(try_cast(nullif(m.erp_promo_start_time, '') as bigint)) as timestamp) as erp_promo_start_ts,

    m.erp_promo_end_time,
    try_cast(nullif(m.erp_promo_end_time, '') as bigint) as erp_promo_end_epoch,
    cast(from_unixtime(try_cast(nullif(m.erp_promo_end_time, '') as bigint)) as timestamp) as erp_promo_end_ts,

    m.erp_promo_client_id,
    m.erp_promo_referral_id,
    m.erp_promo_rev_share,

    -- ---- flags ----------------------------------------------------------------
    m.is_active,
    m.is_banned,
    m.is_cn_merchant,
    m.is_store_merchant,
    m.is_merchant_plus,
    m.is_trusted_for_verified_products,
    m.has_products_promoted,
    m.exempt_from_ads,
    m.withhold_funds_permanently,
    m.enabled,
    m.dummy_account,
    m.impression_paused_for_seller_profile_verification,

    -- ---- geography ------------------------------------------------------------
    m.merchant_country,
    m.suspected_country,
    coalesce(nullif(m.suspected_country, ''), m.merchant_country) as reporting_country,
    m.country,
    m.countries,
    m.origin_country,
    m.bd_merchant_country,
    m.merchant_country_when_onboarding_completed,
    m.ip_country_when_created,
    m.locale,

    -- ---- merchant profile (non-PII) ------------------------------------------
    m.merchant_name,
    m.company_name,
    m.brand_name,
    m.merchant_source_currency,
    m.onboarding_completed,
    m.onboarding_emails_received,
    m.onboarding_steps_completed,
    m.disable_reason_text,

    -- ---- measures (as-is; no dimension) --------------------------------------
    m.num_active_products,
    m.rating_count,
    m.rating_count_14_days,
    m.average_rating,
    m.average_rating_14_days,
    m.average_rating_display,
    m.rev_share,
    m.avg_fulfillment_time,
    try_cast(nullif(m.avg_fulfillment_time, '') as double) as avg_fulfillment_time_seconds,
    m.avg_shipping_time,
    try_cast(nullif(m.avg_shipping_time, '') as double) as avg_shipping_time_seconds,
    m.us_30_day_avg_fulfillment_time,
    try_cast(nullif(m.us_30_day_avg_fulfillment_time, '') as double) as us_30_day_avg_fulfillment_time_days,
    m.us_30_day_avg_delivery_time,
    try_cast(nullif(m.us_30_day_avg_delivery_time, '') as double) as us_30_day_avg_delivery_time_days,

    -- ---- PII: exposed by the source table, not exposed as MetricFlow dimensions
    m.name,
    m.display_name,
    m.display_name_en,
    m.individual_name,
    m.first_name,
    m.last_name,
    m.email,
    m.phone_number,
    m.ba_phone_number,
    m.ba_street_address1,
    m.ba_street_address2,
    m.ba_en_street_address1,
    m.ba_en_street_address2,
    m.ba_zh_street_address1,
    m.ba_zh_street_address2,
    m.ba_street_name,
    m.ba_street_number,
    m.ba_name,
    m.ba_city,
    m.ba_country,
    m.ba_country_code,
    m.ba_state,
    m.ba_en_state,
    m.ba_en_city,
    m.ba_zh_city,
    m.ba_zh_country,
    m.ba_zh_state
from {{ source('wish', 'dim_all_merchants') }} as m
