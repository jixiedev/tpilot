{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.fact_trans_detail.

  Physical grain: one row per commerce line item. The documented natural key is
  (c_transaction_id, variation_id) -- the data-quality duplication check for this
  table dedups on exactly that pair -- so `transaction_variation_id` is the
  surrogate primary key built from it. One commerce transaction spans many line
  rows, so the transaction-level columns (total, subtotal, total_shipping,
  flat_rate_shipping, tax_amount, tax_cost, tax_fee, processor_fee, cash,
  discount_amount, discounts_applied, total_credits_applied, credits_applied,
  installments) are repeated on every line row of the same transaction. Summing
  them over line rows over-counts; aggregate at c_transaction_id first when a
  per-transaction number is needed. The line-level columns (paid_price,
  paid_shipping, item_price, price, shipping, quantity, gmv, paid_amount, cost)
  are safe to sum over line rows.

  Read-only: the physical table is produced by the Airflow / Spark ETL
  (DAG `IncrementalFactTransDetail`, daily 06:00 PST) that lands the MongoDB
  commerce_transaction / commerce_transaction_item, MerchantTransaction and
  OrderTrackingInfo documents. This wrapper is materialized as a view in schema
  `semantic_dw` (see dbt_project.yml), so it never overwrites
  wish.fact_trans_detail. The ETL is not reimplemented here.

  Column handling:
    * `dt` (varchar YYYY-MM-DD) is the physical partition. It is cast to DATE
      here and is the default metric time dimension. It is the UTC calendar
      date of the transaction -- not the payment-received, order-approved or
      refund day.
    * Unix-second columns are kept as-is (for joins) and paired with a `*_ts`
      timestamp column. The `*_date` day-grain columns are the only extra
      MetricFlow time dimensions -- the project time spine is day, so no
      hour/second-grain time dimension is registered.
    * Enum codes keep their raw column and gain a human-readable `*_name`
      column (CASE over the documented code list): state, payment_type,
      client, refund_reason_category, order_state. `app_type_name` already
      exists in the source and is passed through unchanged.
    * The documented calculated fields (gmv, paid_price, item_price, ..) are
      already materialised by the ETL as columns of this table, so they are
      passed through rather than re-derived.

  No dimension tables are joined here. Joins belong in Tableau models under
  semantic_layer/models/tableau/ that ref() this wrapper.
#}

select
    -- ------------------------------------------------------------------
    -- surrogate primary key (grain: c_transaction_id + variation_id)
    -- ------------------------------------------------------------------
    concat(txn.c_transaction_id, '-', txn.variation_id) as transaction_variation_id,

    -- ------------------------------------------------------------------
    -- keys / entities
    -- ------------------------------------------------------------------
    txn.c_transaction_id,
    txn.variation_id,
    txn.user_id,
    txn.merchant_id,
    txn.product_id,
    txn.payment_id,
    txn.m_transaction_id,
    txn.merchant_payment_id,
    txn.merchant_refund_id,
    txn.tracking_id,
    txn.wish_standard_tracking_id,
    txn.store_id,
    txn.combined_order_id,
    txn.fbw_warehouse_id,
    txn.wish_fulfill_provider_id,
    txn.wish_fulfill_warehouse_id,
    txn.merchant_warehouse_id,
    txn.routed_merchant_transaction_id,
    txn.wps_shipment_id,
    txn.shipping_option_id,
    txn.incentive_program_id,
    txn.refunded_by,
    txn.provider_id,
    txn.refund_transaction_id,
    txn.orig_product_id,
    txn.orig_variation_id,
    txn.orig_merchant_id,
    txn.initial_wishpost_tracking_id_item_currency_conversion_id,

    -- ------------------------------------------------------------------
    -- time: derived day-grain + timestamp columns, then the raw unix seconds
    -- ------------------------------------------------------------------
    cast(txn.dt as date) as dt,
    txn.time,
    cast(from_unixtime(txn.transaction_time) as date) as transaction_date,
    cast(from_unixtime(txn.transaction_time) as timestamp) as transaction_ts,
    txn.transaction_time,
    cast(from_unixtime(txn.payment_received_time) as date) as payment_received_date,
    cast(from_unixtime(txn.payment_received_time) as timestamp) as payment_received_ts,
    txn.payment_received_time,
    cast(from_unixtime(txn.order_approved_time) as date) as order_approved_date,
    cast(from_unixtime(txn.order_approved_time) as timestamp) as order_approved_ts,
    txn.order_approved_time,
    cast(from_unixtime(txn.order_time) as date) as order_date,
    cast(from_unixtime(txn.order_time) as timestamp) as order_ts,
    txn.order_time,
    cast(from_unixtime(txn.confirmed_delivered_time) as date) as confirmed_delivered_date,
    cast(from_unixtime(txn.confirmed_delivered_time) as timestamp) as confirmed_delivered_ts,
    txn.confirmed_delivered_time,
    cast(from_unixtime(txn.refunded_time) as date) as refunded_date,
    cast(from_unixtime(txn.refunded_time) as timestamp) as refunded_ts,
    txn.refunded_time,
    txn.released_to_merchant_time,
    txn.merchant_payment_time,
    txn.shipped_date,
    txn.marked_shipped,
    txn.user_confirmed_delivered_time,
    txn.user_confirmed_delivery,
    txn.delivered,
    txn.confirmed_shipped,
    txn.first_confirmed_update_time,
    txn.tracking_created_time,
    txn.last_update,
    txn.last_changed_time,
    txn.withheld_time,
    txn.chargeback_time,
    txn.payment_forfeited_time,
    txn.exp_delivery_time,
    txn.tracking_cancelled_date,
    txn.wishpost_order_creation_time,
    txn.first_in_transit_tracking_time,
    txn.initial_wishpost_shipping_saved_time,
    txn.consistent_provider,
    txn.estimator_used,
    txn.consecutive_carrier_counter,
    txn.limbo_start_time,

    -- ------------------------------------------------------------------
    -- line-level amounts
    -- ------------------------------------------------------------------
    txn.paid_price,
    txn.paid_shipping,
    txn.item_price,
    txn.item_total,
    txn.price,
    txn.shipping,
    txn.quantity,
    txn.gmv,
    txn.paid_amount,
    txn.cost,
    txn.merchant_price,
    txn.merchant_shipping,
    txn.shipping_cost,
    txn.merchant_eat_cost_amount,
    txn.original_price,
    txn.refund_amount,
    txn.qty_refunded,
    txn.refundable_cash_amount,
    txn.local_amount,
    txn.wish_cash_paid,
    txn.wish_cash_credit,
    txn.retail_delivery_fee_amount,
    txn.merchant_payment_amt,
    txn.third_party_pinged,
    txn.refund_risk_score,
    txn.merchant_eat_cost_ratio,
    txn.merchant_payment_tax_amount,
    txn.merchant_tax_amount,
    txn.original_rev_share,
    txn.updated_rev_share,

    -- ------------------------------------------------------------------
    -- transaction-level amounts (repeated on every line row of a transaction)
    -- ------------------------------------------------------------------
    txn.total as total_amount,
    txn.subtotal,
    txn.total_shipping,
    txn.flat_rate_shipping,
    txn.tax_amount,
    txn.tax_cost,
    txn.tax_fee,
    txn.processor_fee,
    txn.cash,
    txn.discount_amount,
    txn.discounts_applied,
    txn.total_credits_applied,
    txn.credits_applied,
    txn.installments,
    txn.merchant_currency_spot_exchange_rate,
    txn.merchant_currency_hedged_exchange_rate,
    txn.merchant_currency_daily_exchange_rate,
    txn.user_currency_spot_exchange_rate,
    txn.user_currency_hedged_exchange_rate,
    txn.user_currency_daily_exchange_rate,
    txn.merchant_currency_exchange_rate,
    txn.merchant_source_currency,
    txn.localized_merchant_price,
    txn.localized_merchant_shipping,
    txn.localized_merchant_shipping_cost,
    txn.localized_merchant_cost,
    txn.localized_wishpost_shipping,
    txn.localized_wishpost_shipping_cost,
    txn.localized_wishpost_shipping_price,
    txn.localized_unity_wishpost_shipping,
    txn.localized_initial_wishpost_shipping_amount,
    txn.localized_estimated_wishpost_shipping_cost,
    txn.initial_wishpost_tracking_id_item_localized_amount,
    txn.initial_wishpost_tracking_id_item_localized_currency,

    -- ------------------------------------------------------------------
    -- enums: raw code + human-readable label
    -- ------------------------------------------------------------------
    txn.state,
    case txn.state
        when 0 then 'PENDING'
        when 1 then 'APPROVED'
        when 2 then 'ACKNOWLEDGED'
        when 3 then 'SHIPPED'
        when 4 then 'DECLINED'
        when 5 then 'REFUNDED'
        when 6 then 'C2C_ON_DELIVERY'
        when 7 then 'C2C_DELIVERED'
        when 8 then 'C2C_ACCEPTED'
        when 10 then 'EXCEPTION'
        when 11 then 'GIFT_WAITING_FOR_ACCEPT'
        when 12 then 'REQUIRE_REVIEW'
        when 13 then 'DELAYING'
        when 14 then 'LABEL_GENERATED'
        when 15 then 'LABEL_DOWNLOADED'
        else null
    end as state_name,

    txn.payment_type,
    case txn.payment_type
        when -1 then 'NONE'
        when 0 then 'PAYPAL'
        when 1 then 'BRAINTREE'
        when 2 then 'BRAINTREE_FB'
        when 3 then 'STRIPE'
        when 4 then 'BRAINTREE_GOOGLE'
        when 5 then 'STRIPE_GOOGLE'
        when 6 then 'BOLETO'
        when 7 then 'STRIPE_APPLE_PAY'
        when 8 then 'KLARNA'
        when 9 then 'ADYEN'
        when 10 then 'EBANX'
        when 11 then 'OXXO'
        when 12 then 'UNKNOWN'
        when 13 then 'TWITTERDIRECTBUY'
        when 14 then 'BOKU'
        when 15 then 'AFFIRM'
        when 16 then 'BRAINTREE_PAYPAL'
        when 17 then 'STRIPE_IDEAL'
        when 18 then 'PAYNEARME'
        when 19 then 'BRAINTREE_VENMO'
        when 20 then 'STRIPE_SAMSUNG_PAY'
        when 21 then 'COMMERCE_LOAN'
        when 22 then 'PAYTM'
        when 23 then 'XENDIT_INVOICE'
        when 24 then 'FB_CHECKOUT'
        when 25 then 'ADYEN_BANKING'
        when 26 then 'OFFLINE_CASH'
        when 27 then 'BRAINTREE_ACH'
        when 28 then 'SHOPIFY_CHECKOUT'
        when 29 then 'PIX'
        when 30 then 'AFTERPAY'
        when 31 then 'KLARNA_PAYLATER'
        when 32 then 'AFTERPAY_CASHAPP'
        else null
    end as payment_type_name,

    txn.client,
    case txn.client
        when 0 then 'Web'
        when 1 then 'iPhone'
        when 2 then 'iPad'
        when 3 then 'Android'
        when 4 then 'Mobile Web'
        when 5 then 'Windows Desktop'
        when 6 then 'Windows Phone'
        else null
    end as client_name,

    txn.refund_reason_category,
    case txn.refund_reason_category
        when 4 then 'SUSPECTED_FRAUD'
        when 20 then 'QUALITY'
        when 21 then 'QUALITY'
        when 22 then 'QUALITY'
        when 23 then 'QUALITY'
        when 24 then 'ITEM_IS_COUNTERFEIT'
        when 25 then 'ITEM_IS_DAMAGED'
        when 26 then 'ITEM_DOES_NOT_WORK_AS_DESCRIBED'
        when 27 then 'QUALITY'
        when 40 then 'FRAUD'
        when 54 then 'FRAUD'
        when 65 then 'FRAUD'
        else null
    end as refund_reason_category_name,

    txn.order_state,
    case txn.order_state
        when 3 then 'SHIPPED'
        else null
    end as order_state_name,

    -- ------------------------------------------------------------------
    -- other enums / codes (raw, no documented mapping)
    -- ------------------------------------------------------------------
    txn.app_type,
    txn.app_type_name,
    txn.item_state,
    txn.item_prev_state,
    txn.ltd_product_state,
    txn.payment_method,
    txn.card_type,
    txn.funding_type,
    txn.cvv_check_response,
    txn.avs_error_response,
    txn.avs_postal_check_response,
    txn.avs_street_check_response,
    txn.bin_number,
    txn.aftership_state,
    txn.carrier_tier,
    txn.tracking_source,
    txn.wishpost_channel,
    txn.wishpost_warehouse,
    txn.top_level_channel,
    txn.picker_source,
    txn.merchant_payment_status,
    txn.service_code,
    txn.provider,
    txn.weight_unit,
    txn.merchant_warehouse_shipping_type,
    txn.withhold_reason,
    txn.withhold_sub_category,
    txn.payment_forfeited_reason,
    txn.original_rev_share_tag,
    txn.updated_rev_share_tag,
    txn.original_rev_share_shipping_source,
    txn.original_rev_share_tax_entity,
    txn.rev_disqualified_merchant_warehouse_shipping_type,
    txn.calculated_shipping_mode,
    txn.sensitivity_selection_reason,
    txn.merchant_standing_when_order_released,
    txn.pickup_now_inventory_type,
    txn.additional_fulfillment_hours,
    txn.consistent_channel,
    txn.currency,
    txn.limbo_state,
    txn.reroute_source,

    -- ------------------------------------------------------------------
    -- flags ('true' / 'false' string booleans)
    -- ------------------------------------------------------------------
    txn.is_c2c,
    txn.is_wish_express,
    txn.is_gifting,
    txn.is_free_gift,
    txn.is_free_sample,
    txn.is_daily_giveaway,
    txn.item_is_fbw,
    txn.contains_fbw_item,
    txn.contains_self_serve_fbw_item,
    txn.is_strategic_merchant,
    txn.is_wish_x_merchant,
    txn.is_commerce_loan,
    txn.is_pts_redemption,
    txn.is_partial_refund,
    txn.is_new_refund,
    txn.is_wish_express_prefulfillment_cancellation,
    txn.chargeback,
    txn.prefulfill_cancellation,
    txn.wish_pays,
    txn.is_self_serve_fbw,
    txn.is_fbw_v2,
    txn.is_fbw,
    txn.is_wlc,
    txn.is_wish_express_late_arrival,
    txn.wish_express_on_time,
    txn.consistent_registered,
    txn.consistent_last_mile,
    txn.hide_from_merchant,
    txn.affected_by_delivery_policy,
    txn.eligible_for_fast_payment_by_product_list_program,
    txn.is_wishify_order,
    txn.is_aplus,
    txn.is_unity_order,
    txn.is_ltl,
    txn.is_valid_tracking,
    txn.is_confirmed_shipped,
    txn.is_delivered,
    txn.is_confirmed,
    txn.wishpost_registered,
    txn.last_mile_tracking_expected,
    txn.is_delivery_failure,
    txn.is_payment_forfeited,
    txn.return_to_sender,
    txn.is_eligible_to_ship_with_wps,
    txn.is_unity_order_and_payment_enabled,
    txn.is_consignment_order,
    txn.uni_inventory_flag,
    txn.fbw,
    txn.wish_x,
    txn.is_express_rev_disqualified,
    txn.is_testing,

    txn.is_ltd_product,
    case
        when lower(txn.is_ltd_product) = 'true' then true
        else false
    end as is_ltd_product_flag,

    -- ------------------------------------------------------------------
    -- geography / address
    -- ------------------------------------------------------------------
    txn.shipping_country,
    txn.shipping_state,
    txn.shipping_city,
    txn.shipping_postal_code,
    txn.shipping_recipient,
    txn.shipping_zipcode,
    txn.name,
    txn.street_address,
    txn.phone_number,
    txn.dest_city,
    txn.dest_state,
    txn.dest_zipcode,
    txn.dest_country,
    txn.dest_country_tracking,
    txn.shipping_city_tracking,
    txn.shipping_state_tracking,
    txn.shipping_zipcode_tracking,
    txn.shipping_country_tracking,
    txn.origin_country,
    txn.country_code,
    txn.ip_country,
    txn.ip_address,
    txn.pickup_location,
    txn.pickup_note,
    txn.signed_by,

    -- ------------------------------------------------------------------
    -- other attributes
    -- ------------------------------------------------------------------
    txn.sku,
    txn.size,
    txn.color,
    txn.refund_reason,
    txn.declined_reason,
    txn.pending_reason,
    txn.credit_ids,
    txn.credit_applied,
    txn.cart_coupon_codes_applied,
    txn.wishcash_in,
    txn.displayed_price,
    txn.displayed_shipping,
    txn.ttd_tags_before_override,
    txn.ttd_tags_override_case_num,
    txn.min_shipping_time_shown,
    txn.max_shipping_time_shown,
    txn.min_delivery_time_before_grouping,
    txn.max_delivery_time_before_grouping,
    txn.pppi_price_before_personal_price,
    txn.pppi_price_after_personal_price,
    txn.pppi_personal_price_types,
    txn.sppi_price_before_personal_price,
    txn.sppi_price_after_personal_price,
    txn.sppi_personal_price_types,
    txn.device_id,
    txn.req_visitor_id,
    txn.seed_visitor_id,
    txn.consecutive_carrier_provider,
    txn.weight,
    txn.partial_refunds,
    txn.business_days_to_arrival,
    txn.blended_ttd,
    txn.wish_express_delivery_deadline,
from {{ source('wish', 'fact_trans_detail') }} as txn
