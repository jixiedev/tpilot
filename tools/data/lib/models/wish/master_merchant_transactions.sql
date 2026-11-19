{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.master_merchant_transactions.

  Grain: one row per `m_transaction_id` (MongoDB `MerchantTransaction._id`),
  the documented primary key of the table. The physical table is
  partitioned by `dt` (varchar YYYY-MM-DD) and written daily by the
  Airflow DAG `dag_mt_incremental_tahoe.py` (01:00 UTC) from the MongoDB
  `MerchantTransaction` collection plus the related commerce transaction,
  order-tracking and shipping-estimate collections. The wrapper
  materializes as a view in `semantic_dw`; the underlying table is never
  overwritten.

  Time semantics: `dt` is the Hive partition date and is the default
  metric time dimension. All `*_time` / `*_time` style integer columns
  are Unix epoch seconds in UTC (the table doc states "All timestamps
  are in UTC"); the raw integers are kept for joins and the `_ts`
  timestamp twins are exposed for display and join convenience. Only the
  `date`-cast columns (`dt`, `order_date`, `transaction_date`,
  `merchant_payment_date`, `refunded_date`) are registered as MetricFlow
  time dimensions, because the project time spine is `day`.

  Enums: `state`, `merchant_payment_status`, `refund_reason_category`
  and `withhold_reason` have documented closed domains. The raw code
  column is kept as a categorical dimension and a human-readable
  `*_name` column is added next to it.

  Joins to dimension tables (merchant, product, variation, warehouse)
  are intentionally NOT performed here - they belong in a Tableau
  datasource model under `semantic_layer/models/tableau/` that `ref()`s
  this wrapper.
#}

select
    -- ------------------------------------------------------------------
    -- primary key
    -- ------------------------------------------------------------------
    cast(txn.m_transaction_id as varchar)                              as m_transaction_id,

    -- ------------------------------------------------------------------
    -- entity / join keys
    -- ------------------------------------------------------------------
    cast(txn.user_id as varchar)                                      as user_id,
    cast(txn.merchant_id as varchar)                                  as merchant_id,
    cast(txn.c_transaction_id as varchar)                             as c_transaction_id,
    cast(txn.product_id as varchar)                                   as product_id,
    cast(txn.variation_id as varchar)                                 as variation_id,
    cast(txn.sku as varchar)                                          as sku,
    cast(txn.merchant_payment_id as varchar)                          as merchant_payment_id,
    cast(txn.merchant_refund_id as varchar)                           as merchant_refund_id,
    cast(txn.wish_fulfill_provider_id as varchar)                     as wish_fulfill_provider_id,
    cast(txn.wish_fulfill_warehouse_id as varchar)                    as wish_fulfill_warehouse_id,
    cast(txn.merchant_warehouse_id as varchar)                        as merchant_warehouse_id,
    cast(txn.tracking_id as varchar)                                  as tracking_id,
    cast(txn.wps_shipment_id as varchar)                              as wps_shipment_id,
    cast(txn.store_id as varchar)                                     as store_id,
    cast(txn.shipping_option_id as varchar)                           as shipping_option_id,
    cast(txn.incentive_program_id as varchar)                         as incentive_program_id,
    cast(txn.combined_order_id as varchar)                            as combined_order_id,
    cast(txn.routed_merchant_transaction_id as varchar)               as routed_merchant_transaction_id,
    cast(txn.initial_wishpost_tracking_id_item_currency_conversion_id as varchar)
                                                                        as initial_wishpost_tracking_id_item_currency_conversion_id,
    cast(txn.initial_wishpost_tracking_id_item_localized_currency as varchar)
                                                                        as initial_wishpost_tracking_id_item_localized_currency,

    -- ------------------------------------------------------------------
    -- timestamps (unix epoch seconds, UTC) - raw + timestamp twins
    -- ------------------------------------------------------------------
    cast(txn.time as bigint)                                          as time,
    cast(from_unixtime(txn.time) as timestamp)                        as time_ts,

    cast(txn.order_time as bigint)                                    as order_time,
    cast(from_unixtime(txn.order_time) as timestamp)                  as order_time_ts,
    cast(from_unixtime(txn.order_time) as date)                      as order_date,

    cast(txn.transaction_time as bigint)                              as transaction_time,
    cast(from_unixtime(txn.transaction_time) as timestamp)            as transaction_time_ts,
    cast(from_unixtime(txn.transaction_time) as date)                 as transaction_date,

    cast(txn.merchant_payment_time as bigint)                         as merchant_payment_time,
    cast(from_unixtime(txn.merchant_payment_time) as timestamp)       as merchant_payment_time_ts,
    cast(from_unixtime(txn.merchant_payment_time) as date)            as merchant_payment_date,

    cast(txn.refunded_time as bigint)                                 as refunded_time,
    cast(from_unixtime(txn.refunded_time) as timestamp)               as refunded_time_ts,
    cast(from_unixtime(txn.refunded_time) as date)                    as refunded_date,

    cast(txn.released_to_merchant_time as bigint)                     as released_to_merchant_time,
    cast(from_unixtime(txn.released_to_merchant_time) as timestamp)   as released_to_merchant_time_ts,

    cast(txn.order_approved_time as bigint)                           as order_approved_time,
    cast(from_unixtime(txn.order_approved_time) as timestamp)         as order_approved_time_ts,

    cast(txn.user_confirmed_delivered_time as bigint)                 as user_confirmed_delivered_time,
    cast(from_unixtime(txn.user_confirmed_delivered_time) as timestamp) as user_confirmed_delivered_time_ts,

    cast(txn.marked_shipped as bigint)                                as marked_shipped,
    cast(from_unixtime(txn.marked_shipped) as timestamp)              as marked_shipped_ts,

    cast(txn.chargeback_time as bigint)                               as chargeback_time,
    cast(from_unixtime(txn.chargeback_time) as timestamp)             as chargeback_time_ts,

    cast(txn.withheld_time as bigint)                                 as withheld_time,
    cast(from_unixtime(txn.withheld_time) as timestamp)               as withheld_time_ts,

    cast(txn.payment_forfeited_time as bigint)                        as payment_forfeited_time,
    cast(from_unixtime(txn.payment_forfeited_time) as timestamp)      as payment_forfeited_time_ts,

    cast(txn.last_update as bigint)                                   as last_update,
    cast(from_unixtime(txn.last_update) as timestamp)                 as last_update_ts,

    cast(txn.last_changed_time as bigint)                             as last_changed_time,
    cast(from_unixtime(txn.last_changed_time) as timestamp)           as last_changed_time_ts,

    cast(txn.initial_wishpost_shipping_saved_time as bigint)          as initial_wishpost_shipping_saved_time,
    cast(from_unixtime(txn.initial_wishpost_shipping_saved_time) as timestamp)
                                                                        as initial_wishpost_shipping_saved_time_ts,

    -- ------------------------------------------------------------------
    -- documented enums: raw code + human readable name
    -- ------------------------------------------------------------------
    cast(txn.state as int)                                            as state,
    case
        when txn.state = 0 then 'PENDING'
        when txn.state = 1 then 'APPROVED'
        when txn.state = 2 then 'SHIPPED'
        when txn.state = 3 then 'DELIVERED'
        when txn.state = 4 then 'CANCELLED'
        when txn.state = 5 then 'REFUNDED'
        else cast(txn.state as varchar)
    end                                                                as state_name,

    cast(txn.merchant_payment_status as int)                          as merchant_payment_status,
    case
        when txn.merchant_payment_status = 0 then 'PENDING'
        when txn.merchant_payment_status = 1 then 'PAID'
        when txn.merchant_payment_status = 2 then 'WITHHELD'
        when txn.merchant_payment_status = 3 then 'FORFEITED'
        else cast(txn.merchant_payment_status as varchar)
    end                                                                as merchant_payment_status_name,

    cast(txn.refund_reason_category as int)                           as refund_reason_category,
    case
        when txn.refund_reason_category = 20 then 'SHIPMENT_BEYOND_LDD'
        when txn.refund_reason_category = 21 then 'ITEM_NOT_ARRIVED'
        when txn.refund_reason_category = 24 then 'ITEM_COUNTERFEIT'
        when txn.refund_reason_category = 25 then 'ITEM_DAMAGED'
        when txn.refund_reason_category = 26 then 'ITEM_NOT_WORK'
        when txn.refund_reason_category = 27 then 'ITEM_NOT_MATCH_DESCRIPTION'
        when txn.refund_reason_category = 35 then 'OTHER_LOGISTICS_ISSUES'
        else cast(txn.refund_reason_category as varchar)
    end                                                                as refund_reason_category_name,

    cast(txn.withhold_reason as int)                                  as withhold_reason,
    case
        when txn.withhold_reason = 1 then 'QUALITY_ISSUES'
        when txn.withhold_reason = 3 then 'POLICY_VIOLATIONS'
        when txn.withhold_reason = 4 then 'FRAUD_DETECTION'
        when txn.withhold_reason = 6 then 'WISH_EXPRESS_POLICY_VIOLATION'
        when txn.withhold_reason = 8 then 'WAREHOUSE_FULFILLMENT_POLICY_VIOLATION'
        else cast(txn.withhold_reason as varchar)
    end                                                                as withhold_reason_name,

    -- ------------------------------------------------------------------
    -- flags and categorical attributes
    -- ------------------------------------------------------------------
    cast(txn.fbw as varchar)                                          as fbw,
    cast(txn.is_partial_refund as varchar)                            as is_partial_refund,
    cast(txn.is_new_refund as varchar)                                as is_new_refund,
    cast(txn.is_wish_express_prefulfillment_cancellation as varchar)  as is_wish_express_prefulfillment_cancellation,
    cast(txn.wish_x as varchar)                                       as wish_x,
    cast(txn.chargeback as varchar)                                   as chargeback,
    cast(txn.prefulfill_cancellation as varchar)                      as prefulfill_cancellation,
    cast(txn.wish_pays as varchar)                                    as wish_pays,
    cast(txn.is_wish_express as varchar)                              as is_wish_express,
    cast(txn.is_self_serve_fbw as varchar)                            as is_self_serve_fbw,
    cast(txn.is_fbw_v2 as varchar)                                    as is_fbw_v2,
    cast(txn.is_fbw as varchar)                                       as is_fbw,
    cast(txn.is_wlc as varchar)                                       as is_wlc,
    cast(txn.is_wish_express_late_arrival as varchar)                 as is_wish_express_late_arrival,
    cast(txn.wish_express_on_time as varchar)                         as wish_express_on_time,
    cast(txn.consistent_channel as varchar)                           as consistent_channel,
    cast(txn.consistent_registered as varchar)                        as consistent_registered,
    cast(txn.consistent_last_mile as varchar)                         as consistent_last_mile,
    cast(txn.hide_from_merchant as varchar)                           as hide_from_merchant,
    cast(txn.affected_by_delivery_policy as varchar)                  as affected_by_delivery_policy,
    cast(txn.eligible_for_fast_payment_by_product_list_program as varchar)
                                                                        as eligible_for_fast_payment_by_product_list_program,
    cast(txn.is_wishify_order as varchar)                             as is_wishify_order,
    cast(txn.is_aplus as varchar)                                     as is_aplus,
    cast(txn.is_unity_order as varchar)                               as is_unity_order,
    cast(txn.is_ltl as varchar)                                       as is_ltl,
    cast(txn.pay_after as varchar)                                    as pay_after,
    cast(txn.is_unity_order_and_payment_enabled as varchar)           as is_unity_order_and_payment_enabled,
    cast(txn.is_payment_forfeited as varchar)                         as is_payment_forfeited,
    cast(txn.is_express_rev_disqualified as varchar)                  as is_express_rev_disqualified,
    cast(txn.is_eligible_to_ship_with_wps as varchar)                 as is_eligible_to_ship_with_wps,
    cast(txn.uni_inventory_flag as varchar)                           as uni_inventory_flag,
    cast(txn.is_consignment_order as varchar)                         as is_consignment_order,

    cast(txn.size as varchar)                                         as size,
    cast(txn.color as varchar)                                        as color,
    cast(txn.wish_express_delivery_deadline as varchar)               as wish_express_delivery_deadline,
    cast(txn.refund_reason as varchar)                                as refund_reason,
    cast(txn.declined_reason as varchar)                              as declined_reason,
    cast(txn.provider as varchar)                                     as provider,
    cast(txn.shipping_country as varchar)                             as shipping_country,
    cast(txn.shipping_state as varchar)                               as shipping_state,
    cast(txn.shipping_city as varchar)                                as shipping_city,
    cast(txn.shipping_zipcode as varchar)                             as shipping_zipcode,
    cast(txn.merchant_source_currency as varchar)                     as merchant_source_currency,

    cast(txn.refunded_by as int)                                      as refunded_by,
    cast(txn.consistent_provider as int)                              as consistent_provider,
    cast(txn.estimator_used as int)                                   as estimator_used,
    cast(txn.consecutive_carrier_counter as int)                      as consecutive_carrier_counter,
    cast(txn.consecutive_carrier_provider as int)                     as consecutive_carrier_provider,
    cast(txn.top_level_channel as int)                                as top_level_channel,
    cast(txn.merchant_standing_when_order_released as int)            as merchant_standing_when_order_released,
    cast(txn.limbo_state as int)                                      as limbo_state,
    cast(txn.pickup_now_inventory_type as int)                        as pickup_now_inventory_type,
    cast(txn.merchant_warehouse_shipping_type as int)                 as merchant_warehouse_shipping_type,
    cast(txn.withhold_sub_category as int)                            as withhold_sub_category,
    cast(txn.payment_forfeited_reason as int)                         as payment_forfeited_reason,
    cast(txn.original_rev_share_tag as int)                           as original_rev_share_tag,
    cast(txn.original_rev_share_shipping_source as int)               as original_rev_share_shipping_source,
    cast(txn.original_rev_share_tax_entity as int)                    as original_rev_share_tax_entity,
    cast(txn.updated_rev_share_tag as int)                            as updated_rev_share_tag,
    cast(txn.rev_disqualified_merchant_warehouse_shipping_type as int) as rev_disqualified_merchant_warehouse_shipping_type,
    cast(txn.sensitivity_selection_reason as int)                     as sensitivity_selection_reason,
    cast(txn.calculated_shipping_mode as int)                         as calculated_shipping_mode,
    cast(txn.picker_source as int)                                    as picker_source,
    cast(txn.user_confirmed_delivery as int)                          as user_confirmed_delivery,

    -- ------------------------------------------------------------------
    -- amounts and measures
    -- ------------------------------------------------------------------
    cast(txn.paid_amount as double)                                   as paid_amount,
    cast(txn.merchant_price as double)                                as merchant_price,
    cast(txn.merchant_shipping as double)                             as merchant_shipping,
    cast(txn.cost as double)                                          as cost,
    cast(txn.price as double)                                         as price,
    cast(txn.original_price as double)                                as original_price,
    cast(txn.shipping as double)                                      as shipping,
    cast(txn.shipping_cost as double)                                 as shipping_cost,
    cast(txn.merchant_eat_cost_amount as double)                      as merchant_eat_cost_amount,
    cast(txn.merchant_eat_cost_ratio as double)                       as merchant_eat_cost_ratio,
    cast(txn.merchant_payment_amt as double)                          as merchant_payment_amt,
    cast(txn.merchant_payment_tax_amount as double)                   as merchant_payment_tax_amount,
    cast(txn.merchant_tax_amount as double)                           as merchant_tax_amount,
    cast(txn.tax_cost as double)                                      as tax_cost,
    cast(txn.refund_amount as double)                                 as refund_amount,
    cast(txn.refund_risk_score as double)                             as refund_risk_score,
    cast(txn.client as double)                                        as client,
    cast(txn.third_party_pinged as double)                             as third_party_pinged,
    cast(txn.quantity as bigint)                                      as quantity,
    cast(txn.qty_refunded as bigint)                                  as qty_refunded,
    cast(txn.partial_refunds as bigint)                               as partial_refunds,
    cast(txn.business_days_to_arrival as bigint)                      as business_days_to_arrival,
    cast(txn.additional_fulfillment_hours as bigint)                  as additional_fulfillment_hours,

    cast(txn.original_rev_share as double)                            as original_rev_share,
    cast(txn.updated_rev_share as double)                             as updated_rev_share,

    cast(txn.localized_merchant_price as double)                      as localized_merchant_price,
    cast(txn.localized_merchant_shipping as double)                   as localized_merchant_shipping,
    cast(txn.localized_merchant_shipping_cost as double)              as localized_merchant_shipping_cost,
    cast(txn.localized_merchant_cost as double)                       as localized_merchant_cost,
    cast(txn.localized_wishpost_shipping as double)                   as localized_wishpost_shipping,
    cast(txn.localized_wishpost_shipping_cost as double)              as localized_wishpost_shipping_cost,
    cast(txn.localized_wishpost_shipping_price as double)             as localized_wishpost_shipping_price,
    cast(txn.localized_unity_wishpost_shipping as double)             as localized_unity_wishpost_shipping,
    cast(txn.localized_initial_wishpost_shipping_amount as double)    as localized_initial_wishpost_shipping_amount,
    cast(txn.localized_estimated_wishpost_shipping_cost as double)    as localized_estimated_wishpost_shipping_cost,
    cast(txn.initial_wishpost_tracking_id_item_localized_amount as double)
                                                                        as initial_wishpost_tracking_id_item_localized_amount,

    cast(txn.merchant_currency_exchange_rate as double)               as merchant_currency_exchange_rate,
    cast(txn.merchant_currency_hedged_exchange_rate as double)        as merchant_currency_hedged_exchange_rate,
    cast(txn.merchant_currency_daily_exchange_rate as double)         as merchant_currency_daily_exchange_rate,

    -- ------------------------------------------------------------------
    -- partition
    -- ------------------------------------------------------------------
    cast(txn.dt as date)                                              as dt

from {{ source('wish', 'master_merchant_transactions') }} as txn
