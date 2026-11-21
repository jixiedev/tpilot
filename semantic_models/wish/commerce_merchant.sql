{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.commerce_merchant.

  Physical grain: one row per CommerceMerchant (Mongo `ObjectId` hex string in
  `id`). The physical table is a Hive VIEW over the MongoDB `sweeper`
  collection `CommerceMerchant`; it is NOT partitioned and carries no
  snapshot-date column, so there is no partition time dimension here. The
  view applies `ROW_NUMBER()` de-duplication, so `id` is unique in this
  table (unlike the staging table `tmp.commerce_merchant_temp`, which is
  loaded in parallel by the same DAG and can hold duplicate ids).

  The underlying Airflow DAG is `CommerceMerchantDump` (schedule `0 0 * * *`,
  midnight UTC). No Airflow / Spark ETL logic is reimplemented here and the
  grain is not changed.

  Every physical column is re-exposed as-is; the wrapper only adds derived
  columns:
    * `<enum>_name`       human-readable label for the documented code columns.
    * `*_epoch`           unix seconds as bigint (join-friendly).
    * `*_ts`              unix seconds as timestamp.
    * `*_calendar_date`   unix seconds as date -- the day-grain time
                          dimensions (the project time spine is day).

  Timestamp encoding: the varchar columns that the table documentation
  describes as "timestamp" (`approved_date`, `disable_date`,
  `first_transaction_time`, the `close_account_*` times,
  `payment_withhold_until`, the `wish_express_*` dates, the
  `block_impressions_*` dates and `outsourced_support_start_date`) carry unix
  seconds as digit strings, and `last_payment_time` /
  `merchant_warehouse_feature_migration_date` carry unix seconds as
  integers. This is the encoding of the shared `CommerceMerchant` Mongo
  extract; the sibling model for the staging table
  (`models/hive/tmp/commerce_merchant_temp.sql`) and
  `models/hive/supply/dim_all_merchants.sql` decode the same fields the same
  way. `insurance_start_period` / `insurance_end_period` are NOT epoch
  encoded and are therefore left untouched.

  PII columns (`display_name`, `display_name_en`, `name`, `phone_number`,
  `sales_rep_name`, `close_account_email_code`) are exposed by the underlying
  view but are deliberately NOT declared as MetricFlow dimensions in the
  semantic model.

  Source: wish.commerce_merchant
  (Airflow DAG CommerceMerchantDump; documentation/llm_generated/hive/wish/commerce_merchant.md).
#}

select
    -- ---- identity and key columns --------------------------------------------
    src.id,
    src.group_id,
    src.super_group_id,
    src.new_group_id,
    src.review_group_id,
    src.default_merchant_warehouse_id,
    src.onesource_company_id,
    src.bd_rep,
    src.sales_rep_name,

    -- ---- merchant profile ----------------------------------------------------
    src.display_name,
    src.display_name_en,
    src.name,
    src.display_picture_source,
    src.connected_merchants,
    src.phone_number,
    src.pickup_info,
    src.top_tags,
    src.verticals,
    src.countries,
    src.country_of_domicile,
    src.country_of_domicile_verified,
    src.suspected_country,
    src.origin_country,
    src.ship_from_country,
    src.score,
    src.ranking,
    src.prev_ranking,

    -- ---- lifecycle state -----------------------------------------------------
    src.state,
    case src.state
        when 1 then 'PENDING'
        when 2 then 'APPROVED'
        when 3 then 'DISABLED'
        when 4 then 'REQUEST_INFO'
        when 5 then 'PENDING_PHONE'
        when 6 then 'VACATION'
        when 7 then 'PENDING_EMAIL'
        when 8 then 'WISH_EXPRESS_ONLY'
        else cast(src.state as varchar)
    end as state_name,
    src.state_before_disable,
    case src.state_before_disable
        when '1' then 'PENDING'
        when '2' then 'APPROVED'
        when '3' then 'DISABLED'
        when '4' then 'REQUEST_INFO'
        when '5' then 'PENDING_PHONE'
        when '6' then 'VACATION'
        when '7' then 'PENDING_EMAIL'
        when '8' then 'WISH_EXPRESS_ONLY'
        else src.state_before_disable
    end as state_before_disable_name,
    src.approved_by,
    src.approved_date,
    try_cast(nullif(nullif(src.approved_date, ''), '0') as bigint) as approved_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.approved_date, ''), '0') as bigint)) as timestamp) as approved_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.approved_date, ''), '0') as bigint)) as date) as approved_calendar_date,
    src.disabled_by,
    src.disable_date,
    try_cast(nullif(nullif(src.disable_date, ''), '0') as bigint) as disable_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.disable_date, ''), '0') as bigint)) as timestamp) as disable_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.disable_date, ''), '0') as bigint)) as date) as disable_calendar_date,
    src.disable_reason_category,
    src.disable_reason_text,
    src.disable_warning_id,
    src.fine_warning_id,
    src.eat_cost_warning_id,
    src.first_transaction_time,
    try_cast(nullif(nullif(src.first_transaction_time, ''), '0') as bigint) as first_transaction_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.first_transaction_time, ''), '0') as bigint)) as timestamp) as first_transaction_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.first_transaction_time, ''), '0') as bigint)) as date) as first_transaction_calendar_date,

    -- ---- account closure workflow --------------------------------------------
    src.close_account_state,
    src.close_account_request_time,
    try_cast(nullif(nullif(src.close_account_request_time, ''), '0') as bigint) as close_account_request_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.close_account_request_time, ''), '0') as bigint)) as timestamp) as close_account_request_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.close_account_request_time, ''), '0') as bigint)) as date) as close_account_request_calendar_date,
    src.close_account_update_time,
    try_cast(nullif(nullif(src.close_account_update_time, ''), '0') as bigint) as close_account_update_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.close_account_update_time, ''), '0') as bigint)) as timestamp) as close_account_update_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.close_account_update_time, ''), '0') as bigint)) as date) as close_account_update_calendar_date,
    src.close_account_email_send_time,
    try_cast(nullif(nullif(src.close_account_email_send_time, ''), '0') as bigint) as close_account_email_send_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.close_account_email_send_time, ''), '0') as bigint)) as timestamp) as close_account_email_send_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.close_account_email_send_time, ''), '0') as bigint)) as date) as close_account_email_send_calendar_date,
    src.close_account_email_code,
    src.close_account_reject_reason,

    -- ---- wish express --------------------------------------------------------
    src.wish_express_state,
    src.wish_express_trial_start,
    try_cast(nullif(nullif(src.wish_express_trial_start, ''), '0') as bigint) as wish_express_trial_start_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.wish_express_trial_start, ''), '0') as bigint)) as timestamp) as wish_express_trial_start_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.wish_express_trial_start, ''), '0') as bigint)) as date) as wish_express_trial_start_calendar_date,
    src.wish_express_trial_end,
    try_cast(nullif(nullif(src.wish_express_trial_end, ''), '0') as bigint) as wish_express_trial_end_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.wish_express_trial_end, ''), '0') as bigint)) as timestamp) as wish_express_trial_end_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.wish_express_trial_end, ''), '0') as bigint)) as date) as wish_express_trial_end_calendar_date,
    src.wish_express_block_date,
    try_cast(nullif(nullif(src.wish_express_block_date, ''), '0') as bigint) as wish_express_block_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.wish_express_block_date, ''), '0') as bigint)) as timestamp) as wish_express_block_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.wish_express_block_date, ''), '0') as bigint)) as date) as wish_express_block_calendar_date,
    src.wish_express_unblock_date,
    try_cast(nullif(nullif(src.wish_express_unblock_date, ''), '0') as bigint) as wish_express_unblock_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.wish_express_unblock_date, ''), '0') as bigint)) as timestamp) as wish_express_unblock_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.wish_express_unblock_date, ''), '0') as bigint)) as date) as wish_express_unblock_calendar_date,
    src.wish_express_blocked_countries,

    -- ---- review, epc and ticket handling -------------------------------------
    src.epc_state,
    case src.epc_state
        when 1 then 'NONE'
        when 2 then 'PENDING'
        when 3 then 'REJECTED'
        when 4 then 'APPROVED'
        when 5 then 'SUSPENDED'
        when 6 then 'EXITED'
        when 7 then 'PRE_APPROVED'
        else cast(src.epc_state as varchar)
    end as epc_state_name,
    src.review_state,
    case src.review_state
        when 1 then 'PENDING'
        when 2 then 'APPROVED'
        when 3 then 'REJECTED'
        else cast(src.review_state as varchar)
    end as review_state_name,
    src.ticket_handling_state,

    -- ---- merchant flags ------------------------------------------------------
    src.collection_boost_enabled,
    src.exempt_from_ads,
    src.from_signup_v4,
    src.has_categories,
    src.has_products_promoted,
    src.has_used_logistic,
    src.impression_paused_for_seller_profile_verification,
    src.is_being_migrated_to_warehouse,
    src.is_consignment_mode,
    src.is_cost_based,
    src.is_in_bt_marketplace,
    src.is_merchant_plus,
    src.is_mms_merchant,
    src.is_preorder_merchant,
    src.is_store_merchant,
    src.is_test_account,
    src.is_trusted_for_verified_products,
    src.is_unity_enabled,
    src.msrp_updated_after_new_policy,
    src.paylock,
    src.paylock_payment_id,
    src.paylock_payment_ids,
    src.price_drop_enabled,
    src.request_payment_approved,
    src.seen_unity_welcome_modal,
    src.stop_scan_old_refund,
    src.use_shopify_shipping_rate,
    src.variable_shipping,
    src.waive_auto_disable_status,
    src.withhold_funds_permanently,

    -- ---- ratings, catalogue and activity counters ----------------------------
    src.average_rating,
    src.average_rating_14_days,
    src.average_rating_display,
    src.adjusted_average_ratings,
    src.rating_count,
    src.rating_count_14_days,
    src.num_active_products,
    src.num_last_90_day_transactions,
    src.num_disputes_attention,
    src.num_noti_attention,
    src.actions_received,

    -- ---- payments and disbursement -------------------------------------------
    src.auto_payment_status,
    case src.auto_payment_status
        when 0 then 'DISABLED'
        when 1 then 'ENABLED'
        else cast(src.auto_payment_status as varchar)
    end as auto_payment_status_name,
    src.merchant_payment_policy,
    case src.merchant_payment_policy
        when 1 then 'NORMAL'
        when 100 then 'EXPEDITED_MKL22133'
        when 101 then 'EXPEDITED_TRO_RESOLVED'
        when 199 then 'EXPEDITED_OTHER'
        when 1000 then 'NOT_EXPEDITED'
        else cast(src.merchant_payment_policy as varchar)
    end as merchant_payment_policy_name,
    src.payment_cycle,
    case src.payment_cycle
        when 1 then 'NORMAL'
        when 2 then 'WEEKLY'
        when 3 then 'BI_WEEKLY'
        else cast(src.payment_cycle as varchar)
    end as payment_cycle_name,
    src.payment_limit,
    src.net_payment_period,
    src.payment_receive_currency,
    src.payment_withhold_until,
    try_cast(nullif(nullif(src.payment_withhold_until, ''), '0') as bigint) as payment_withhold_until_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.payment_withhold_until, ''), '0') as bigint)) as timestamp) as payment_withhold_until_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.payment_withhold_until, ''), '0') as bigint)) as date) as payment_withhold_until_calendar_date,
    src.last_payment_time,
    cast(from_unixtime(src.last_payment_time) as timestamp) as last_payment_ts,
    cast(from_unixtime(src.last_payment_time) as date) as last_payment_calendar_date,
    src.rev_share,
    src.source,
    src.merchant_source_currency,
    src.merchant_payout_currencies,
    src.merchant_warehouse_feature_migration_date,
    cast(from_unixtime(src.merchant_warehouse_feature_migration_date) as timestamp) as merchant_warehouse_feature_migration_ts,
    cast(from_unixtime(src.merchant_warehouse_feature_migration_date) as date) as merchant_warehouse_feature_migration_calendar_date,
    src.return_id_counter,
    src.available_subsidy_count,

    -- ---- logistics and fulfilment --------------------------------------------
    src._localized_shipping_costs,
    src._shipping_costs_currency,
    src.shipping_costs,
    src.avg_fulfillment_time,
    try_cast(nullif(src.avg_fulfillment_time, '') as double) as avg_fulfillment_time_days,
    src.avg_shipping_time,
    try_cast(nullif(src.avg_shipping_time, '') as double) as avg_shipping_time_days,
    src.avg_ticket_response_time,
    try_cast(nullif(src.avg_ticket_response_time, '') as double) as avg_ticket_response_time_seconds,
    src.us_30_day_avg_delivery_time,
    try_cast(nullif(src.us_30_day_avg_delivery_time, '') as double) as us_30_day_avg_delivery_time_days,
    src.us_30_day_avg_fulfillment_time,
    try_cast(nullif(src.us_30_day_avg_fulfillment_time, '') as double) as us_30_day_avg_fulfillment_time_days,
    src.standard_shipping_warehouses,
    src.express_shipping_warehouses,
    src.warehouse_locations,
    src.return_addresses,

    -- ---- impression blocking and outsourced support --------------------------
    src.block_impressions_infractions,
    src.block_impressions_since,
    try_cast(nullif(nullif(src.block_impressions_since, ''), '0') as bigint) as block_impressions_since_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.block_impressions_since, ''), '0') as bigint)) as timestamp) as block_impressions_since_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.block_impressions_since, ''), '0') as bigint)) as date) as block_impressions_since_calendar_date,
    src.block_impressions_until,
    try_cast(nullif(nullif(src.block_impressions_until, ''), '0') as bigint) as block_impressions_until_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.block_impressions_until, ''), '0') as bigint)) as timestamp) as block_impressions_until_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.block_impressions_until, ''), '0') as bigint)) as date) as block_impressions_until_calendar_date,
    src.outsourced_support_start_date,
    try_cast(nullif(nullif(src.outsourced_support_start_date, ''), '0') as bigint) as outsourced_support_start_epoch,
    cast(from_unixtime(try_cast(nullif(nullif(src.outsourced_support_start_date, ''), '0') as bigint)) as timestamp) as outsourced_support_start_ts,
    cast(from_unixtime(try_cast(nullif(nullif(src.outsourced_support_start_date, ''), '0') as bigint)) as date) as outsourced_support_start_calendar_date,

    -- ---- insurance coverage --------------------------------------------------
    -- Not epoch encoded: these are free-form period strings, so they are
    -- exposed as-is and are not converted to a time dimension.
    src.insurance_start_period,
    src.insurance_end_period
from {{ source('wish', 'commerce_merchant') }} as src
