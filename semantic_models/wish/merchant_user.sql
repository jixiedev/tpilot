{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.merchant_user.

  Physical grain: one row per merchant user account -- the MongoDB
  `ObjectId` hex string in `id`. The physical object is a Hive
  table refreshed every day at 00:00 UTC by the Airflow DAG
  `MerchantUserDump` (owner jixie@wish.com), which extracts the
  `sweeper-merchant.MerchantUser` Mongo collection, stages it in
  `tmp.merchant_user_temp` and INSERT OVERWRITEs `wish.merchant_user`
  after a `ROW_NUMBER() OVER (PARTITION BY id ORDER BY id)`
  de-duplication (a DQ check in the DAG asserts `id` is unique).

  The table is NOT partitioned and carries no snapshot-date column,
  so this model has no partition time dimension. The default
  `agg_time_dimension` is `onboarding_completed_calendar_date` -- the
  merchant onboarding-completion day. That is a COHORT anchor, not
  a snapshot day: grouping by it answers "merchant users that
  finished onboarding that day". Merchant users that never
  finished onboarding have a NULL date and are therefore dropped
  from a time-bucketed query; use `last_active_calendar_date` when
  the intent is recency instead.

  Every physical column is re-exposed as-is; the wrapper only adds
  derived columns:
    * `<enum>_name`       human-readable label for the documented code columns.
    * `*_flag`           boolean version of the 'True'/'False' string flags.
    * `*_epoch`          unix seconds as bigint (join-friendly).
    * `*_ts`             unix seconds as timestamp.
    * `*_calendar_date`  unix seconds as date -- the day-grain time
                          dimensions (the project time spine is day).
    * `*_value`          numeric cast of the varchar money / count columns.

  Timestamp encoding: the producer converts every MongoDB datetime to
  unix seconds (`to_timestamp`) and writes it as a digit string, so
  all of the timestamp columns here are epoch seconds. `date_last_active`
  is stored as an integer epoch instead of a digit string. The
  sibling model `models/hive/supply/dim_all_merchants.sql`, which
  reads the same physical columns, decodes them the same way.

  Credential columns (password, api_key, the OAuth / two-factor
  tokens and the one-time validation codes) are deliberately NOT
  selected: materialising live secrets into the `semantic_dw` schema
  would widen their blast radius. PII columns (name, e-mail, phone,
  address, identity documents) ARE selected so the view stays a
  faithful mirror of the source, but they are not exposed as
  MetricFlow dimensions in the semantic model.

  Source: documentation/llm_generated/hive/wish/merchant_user.md
          (Airflow DAG MerchantUserDump;
           documentation/repos/data-pipelines/src/dags/org_data-science/
           wavicle/merchant_user_dump/merchant_user_dump.py)
#}

select
    -- ------------------------------------------------------------------
    -- physical columns, pass-through from wish.merchant_user
    -- ------------------------------------------------------------------
    src._detected_domicile_country,
    src._fbw_activated,
    src._legacy_v1_user,
    src._organization_certificate,
    src._total_skus,
    src.admin_permissions,
    src.administer_new_tests,
    src.annual_gmv,
    src.api_token_block_expiry_time,
    src.assign_to_cn_bd,
    src.assumed_hours_worked_weekday,
    src.assumed_hours_worked_weekend,
    src.auth_doc_list,
    src.authorized,
    src.authorized_apps,
    src.auto_payment_status,
    src.ba_city,
    src.ba_country,
    src.ba_country_code,
    src.ba_detected_language,
    src.ba_en_city,
    src.ba_en_country,
    src.ba_en_state,
    src.ba_en_street_address1,
    src.ba_en_street_address2,
    src.ba_identity_number,
    src.ba_name,
    src.ba_neighborhood,
    src.ba_phone_number,
    src.ba_state,
    src.ba_street_address1,
    src.ba_street_address2,
    src.ba_street_name,
    src.ba_street_number,
    src.ba_zh_city,
    src.ba_zh_country,
    src.ba_zh_state,
    src.ba_zh_street_address1,
    src.ba_zh_street_address2,
    src.ba_zipcode,
    src.back_to_onboarding_reason,
    src.bd_invitation_code,
    src.bd_merchant_country,
    src.bd_permissions,
    src.bd_rep,
    src.blue_ambassador_currency,
    src.blue_ambassador_referral_code,
    src.blue_ambassador_time_limit,
    src.bp_last_updated,
    src.brand_name,
    src.brand_partner_state,
    src.business_license,
    src.business_license_id,
    src.carrier_code,
    src.checked_branded_goods_terms,
    src.claimed_by_id,
    src.claimed_by_time,
    src.company_name,
    src.company_website,
    src.country,
    src.cur_test_num,
    src.date_last_active,
    src.dhl_account_number,
    src.display_name,
    src.dispute_activated,
    src.dummy_account,
    src.email,
    src.emails_sent,
    src.enabled,
    src.entity_type,
    src.erp_partner_state,
    src.erp_promo_client_id,
    src.erp_promo_end_time,
    src.erp_promo_referral_id,
    src.erp_promo_rev_share,
    src.erp_promo_start_time,
    src.fbw_partner_id,
    src.fbw_provider_id,
    src.fbw_warehouse_id,
    src.first_name,
    src.force_reset,
    src.got_1st_ticket_noti,
    src.got_1st_trans_noti,
    src.got_1st_upload_noti,
    src.has_request_info_response,
    src.hotkeys_enabled,
    src.id,
    src.in_merchant_lead_exp,
    src.increase_sales,
    src.individual_name,
    src.ip_country_when_created,
    src.ip_proof_doc,
    src.is_active,
    src.is_banned,
    src.is_cn_merchant,
    src.is_commerce_hub,
    src.last_assigned_pending,
    src.last_name,
    src.last_time_add_budget_from_modal,
    src.last_time_show_add_budget_noti,
    src.last_time_show_cb_free_credit_noti,
    src.last_time_show_pb_free_credit_noti,
    src.last_time_show_we_new_policy_banner,
    src.latest_tos_signed,
    src.loan_provider,
    src.locale,
    src.logistic_preferences,
    src.manager,
    src.manager_name,
    src.merchant_country,
    src.merchant_country_when_onboarding_completed,
    src.merchant_flags,
    src.merchant_id,
    src.merchant_name,
    src.merchant_state,
    src.missing_extra_info,
    src.missing_info_state,
    src.net_payment_period,
    src.new_merchant_source,
    src.new_onboarding_steps_completed,
    src.no_tel_instruction,
    src.nonce_set_time,
    src.notifications_unsubscribed,
    src.num_noti_attention,
    src.odesk_id,
    src.old_photo_id_code,
    src.onboarding_completed,
    src.onboarding_completed_time,
    src.onboarding_emails_received,
    src.onboarding_steps_completed,
    src.parent_account,
    src.partner_permissions,
    src.payment_error,
    src.payment_error_amount,
    src.payment_error_date,
    src.payment_provider,
    src.pending_phone_number,
    src.permission_gates_opened,
    src.permission_groups,
    src.permissions,
    src.permissions_allowed,
    src.permissions_denied,
    src.phone_calls_made,
    src.phone_number,
    src.photo_id,
    src.photo_id_code,
    src.photo_id_code_create_time,
    src.photo_id_number,
    src.plan_to_sell_brand_names,
    src.plan_to_sell_branded_goods,
    src.preorder_gmv,
    src.prev_bd_rep,
    src.product_categories,
    src.product_restriction_bypass,
    src.proof_of_id,
    src.qq_group_number,
    src.recent_su,
    src.referred_by_code,
    src.refunded_for_fraud,
    src.report_to,
    src.requires_we_onboarding_step,
    src.rev_share,
    src.review_priority,
    src.roles,
    src.sales_rep_id,
    src.salesforce_lead_id,
    src.seen_fbs_intro,
    src.seen_fbw_tos,
    src.seen_noti_migration_banner,
    src.service_types,
    src.should_reinstate_products,
    src.show_epc_apply_promo,
    src.show_epc_enroll_promo,
    src.show_wish_express_promo,
    src.skip_registration_fee_reason,
    src.sms_blocked_expiry_date,
    src.sms_codes_sent,
    src.sms_validation_attempts,
    src.special_rev_share_reason,
    src.status_to_set,
    src.store_id_source,
    src.store_qualifications,
    src.store_url,
    src.tagging_permissions,
    src.take_weekly_test,
    src.tax_certificate,
    src.tfa_admin_token_expiry,
    src.tfa_admin_verification_token_generation_time,
    src.tfa_attempts,
    src.tfa_prefer_qr,
    src.tfa_token_expiry,
    src.tfa_token_sent_time,
    src.tfa_type,
    src.use_user_locale,
    src.username,
    src.uservoice_id,
    src.utm_source,
    src.vacation_end_date,
    src.vacation_start_date,
    src.viewed_listing_fee,
    src.warehouse_locations,
    src.zendesk_id,

    -- ------------------------------------------------------------------
    -- enum code labels
    -- ------------------------------------------------------------------
    case src.merchant_state
        when 1 then 'PENDING'
        when 2 then 'APPROVED'
        when 3 then 'DISABLED'
        when 4 then 'REQUEST_INFO'
        when 5 then 'PENDING_PHONE'
        when 6 then 'VACATION'
        when 7 then 'PENDING_EMAIL'
        when 8 then 'WISH_EXPRESS_ONLY'
        else cast(src.merchant_state as varchar)
    end as merchant_state_name,
    case src.auto_payment_status
        when 1 then 'MANUAL'
        when 2 then 'NET_N'
        else cast(src.auto_payment_status as varchar)
    end as auto_payment_status_name,
    case src.store_id_source
        when 1 then 'MANUAL'
        when 2 then 'ERP'
        when 3 then 'PSP'
        when 4 then 'PAYPAL'
        else cast(src.store_id_source as varchar)
    end as store_id_source_name,
    case src.payment_provider
        when 0 then 'PAYPAL'
        when 1 then 'BILL'
        when 2 then 'CARDINFOLINK'
        when 3 then 'PAYONEER'
        when 4 then 'PINGPONG'
        when 5 then 'UMPAY'
        when 6 then 'PAYPAL_MERCH'
        when 7 then 'UMPAY_ENTERPRISE'
        when 8 then 'ALLPAY'
        when 9 then 'WISHPAY'
        when 10 then 'PAYECO2'
        when 11 then 'UMPAY2'
        when 12 then 'LIANLIAN'
        when 13 then 'PAYPAL_EEA'
        else cast(src.payment_provider as varchar)
    end as payment_provider_name,
    case src.entity_type
        when '1' then 'INDIVIDUAL'
        when '1.0' then 'INDIVIDUAL'
        when '2' then 'COMPANY'
        when '2.0' then 'COMPANY'
        else src.entity_type
    end as entity_type_name,
    case src.force_reset
        when 0 then 'NONE'
        when 1 then 'PASSWORD'
        when 2 then 'NEW_ACCOUNT'
        when 3 then 'SECURITY'
        else cast(src.force_reset as varchar)
    end as force_reset_name,
    case src.take_weekly_test
        when 0 then 'OFF'
        else cast(src.take_weekly_test as varchar)
    end as take_weekly_test_name,
    case src.tfa_type
        when 1 then 'DEFAULT'
        else cast(src.tfa_type as varchar)
    end as tfa_type_name,

    -- ------------------------------------------------------------------
    -- boolean flags -- the source stores 'True' / 'False' strings, the
    -- `*_flag` column is the boolean version used by the metric filters
    -- ------------------------------------------------------------------
    case
        when lower(trim(coalesce(src.is_active, ''))) = 'true' then true
        else false
    end as is_active_flag,
    case
        when lower(trim(coalesce(src.is_banned, ''))) = 'true' then true
        else false
    end as is_banned_flag,
    case
        when lower(trim(coalesce(src.is_cn_merchant, ''))) = 'true' then true
        else false
    end as is_cn_merchant_flag,
    case
        when lower(trim(coalesce(src.enabled, ''))) = 'true' then true
        else false
    end as enabled_flag,
    case
        when lower(trim(coalesce(src.authorized, ''))) = 'true' then true
        else false
    end as authorized_flag,
    case
        when lower(trim(coalesce(src.onboarding_completed, ''))) = 'true' then true
        else false
    end as onboarding_completed_flag,
    case
        when lower(trim(coalesce(src.dummy_account, ''))) = 'true' then true
        else false
    end as dummy_account_flag,
    case
        when lower(trim(coalesce(src.refunded_for_fraud, ''))) = 'true' then true
        else false
    end as refunded_for_fraud_flag,
    case
        when lower(trim(coalesce(src.dispute_activated, ''))) = 'true' then true
        else false
    end as dispute_activated_flag,
    case
        when lower(trim(coalesce(src._fbw_activated, ''))) = 'true' then true
        else false
    end as fbw_activated_flag,

    -- ------------------------------------------------------------------
    -- timestamp conversions -- unix seconds to epoch / timestamp / date
    -- ------------------------------------------------------------------
    try_cast(src.date_last_active as bigint) as last_active_epoch,
    cast(from_unixtime(try_cast(src.date_last_active as bigint)) as timestamp) as last_active_ts,
    cast(from_unixtime(try_cast(src.date_last_active as bigint)) as date) as last_active_calendar_date,
    try_cast(nullif(src.onboarding_completed_time, '') as bigint) as onboarding_completed_epoch,
    cast(from_unixtime(try_cast(nullif(src.onboarding_completed_time, '') as bigint)) as timestamp) as onboarding_completed_ts,
    cast(from_unixtime(try_cast(nullif(src.onboarding_completed_time, '') as bigint)) as date) as onboarding_completed_calendar_date,
    try_cast(nullif(src.claimed_by_time, '') as bigint) as claimed_by_epoch,
    cast(from_unixtime(try_cast(nullif(src.claimed_by_time, '') as bigint)) as timestamp) as claimed_by_ts,
    cast(from_unixtime(try_cast(nullif(src.claimed_by_time, '') as bigint)) as date) as claimed_by_calendar_date,
    try_cast(nullif(src.vacation_start_date, '') as bigint) as vacation_start_epoch,
    cast(from_unixtime(try_cast(nullif(src.vacation_start_date, '') as bigint)) as timestamp) as vacation_start_ts,
    cast(from_unixtime(try_cast(nullif(src.vacation_start_date, '') as bigint)) as date) as vacation_start_calendar_date,
    try_cast(nullif(src.vacation_end_date, '') as bigint) as vacation_end_epoch,
    cast(from_unixtime(try_cast(nullif(src.vacation_end_date, '') as bigint)) as timestamp) as vacation_end_ts,
    cast(from_unixtime(try_cast(nullif(src.vacation_end_date, '') as bigint)) as date) as vacation_end_calendar_date,
    try_cast(nullif(src.payment_error_date, '') as bigint) as payment_error_epoch,
    cast(from_unixtime(try_cast(nullif(src.payment_error_date, '') as bigint)) as timestamp) as payment_error_ts,
    cast(from_unixtime(try_cast(nullif(src.payment_error_date, '') as bigint)) as date) as payment_error_calendar_date,
    try_cast(nullif(src.sms_blocked_expiry_date, '') as bigint) as sms_blocked_expiry_epoch,
    cast(from_unixtime(try_cast(nullif(src.sms_blocked_expiry_date, '') as bigint)) as timestamp) as sms_blocked_expiry_ts,
    cast(from_unixtime(try_cast(nullif(src.sms_blocked_expiry_date, '') as bigint)) as date) as sms_blocked_expiry_calendar_date,

    -- ------------------------------------------------------------------
    -- numeric casts of the varchar money / count columns
    -- ------------------------------------------------------------------
    try_cast(nullif(src.annual_gmv, '') as double) as annual_gmv_value,
    try_cast(nullif(src.preorder_gmv, '') as double) as preorder_gmv_value,
    try_cast(nullif(src.rev_share, '') as double) as rev_share_value,
    try_cast(nullif(src.erp_promo_rev_share, '') as double) as erp_promo_rev_share_value,
    try_cast(nullif(src.payment_error_amount, '') as double) as payment_error_amount_value,
    try_cast(nullif(src._total_skus, '') as bigint) as total_skus_value

from {{ source('wish', 'merchant_user') }} as src
