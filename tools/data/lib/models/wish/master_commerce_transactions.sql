{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.master_commerce_transactions.

  Grain: one row per commerce line item. The documented composite key is
  (transaction_id, variation_id) -- `transaction_variation_id` is the surrogate
  primary key built from it. One commerce transaction spans many line rows, so
  the transaction-level columns (total, subtotal, total_shipping, tax_*,
  processor_fee, cash, credits, discounts) are repeated on every line row of
  the same transaction. Summing them over line rows over-counts; aggregate at
  transaction_id first if a per-transaction number is needed.

  Read-only: the physical table is produced by the Airflow / Spark ETL that
  lands MongoDB commerce transaction data. This wrapper is materialized as a
  view in schema `semantic_dw` (see dbt_project.yml), so it never overwrites
  wish.master_commerce_transactions.

  Column handling:
    * `dt` (varchar YYYY-MM-DD) is the physical partition. It is cast to DATE
      here and is the default metric time dimension.
    * Unix-second columns are kept as-is (for joins) and paired with a `*_ts`
      timestamp column. The `*_date` day-grain columns are the only extra
      MetricFlow time dimensions -- the project time spine is day.
    * Enum codes keep their raw column and gain a human-readable `*_name`
      column (CASE over the documented code list): state, payment_type,
      client, refund_reason_category. `app_type_name` already exists in the
      source and is passed through unchanged.
    * The documented calculated fields are materialized here: `gmv`
      (paid_price + paid_shipping) and `actual_gmv` (gmv minus the
      proportional share of discount_amount).

  No dimension tables are joined here. Joins belong in Tableau models under
  semantic_layer/models/tableau/ that ref() this wrapper.
#}

select
    -- ------------------------------------------------------------------
    -- keys / entities
    -- ------------------------------------------------------------------
    concat(txn.transaction_id, '-', txn.variation_id) as transaction_variation_id,
    txn.transaction_id,
    txn.variation_id,
    txn.user_id,
    txn.merchant_id,
    txn.product_id,
    txn.payment_id,
    txn.orig_product_id,
    txn.orig_variation_id,
    txn.orig_merchant_id,
    txn.conversion_table_id,
    txn.refund_transaction_id,
    txn.tracking_id,
    txn.fbw_warehouse_id,

    -- ------------------------------------------------------------------
    -- time
    -- ------------------------------------------------------------------
    cast(txn.dt as date) as dt,
    cast(from_unixtime(txn.time) as date) as transaction_create_date,
    cast(from_unixtime(txn.transaction_time) as date) as transaction_date,
    cast(from_unixtime(txn.payment_received_time) as date) as payment_received_date,

    txn.time as transaction_created_at,
    cast(from_unixtime(txn.time) as timestamp) as transaction_created_ts,
    txn.transaction_time,
    cast(from_unixtime(txn.transaction_time) as timestamp) as transaction_time_ts,
    txn.payment_received_time,
    cast(from_unixtime(txn.payment_received_time) as timestamp) as payment_received_ts,
    txn.refunded_time,
    cast(from_unixtime(txn.refunded_time) as timestamp) as refunded_ts,
    txn.limbo_start_time,
    cast(from_unixtime(txn.limbo_start_time) as timestamp) as limbo_start_ts,

    -- ------------------------------------------------------------------
    -- transaction-level amounts (repeated on every line row of a transaction)
    -- ------------------------------------------------------------------
    txn.total as order_total,
    txn.subtotal as order_subtotal,
    txn.total_shipping as order_shipping,
    txn.tax_amount,
    txn.tax_cost,
    txn.tax_fee,
    txn.processor_fee,
    txn.cash as cash_applied,
    txn.discount_amount,
    txn.discounts_applied,
    txn.total_credits_applied,
    txn.credits_applied,
    txn.installments,
    txn.shipping_cost,
    txn.flat_rate_shipping,

    -- ------------------------------------------------------------------
    -- line-level amounts
    -- ------------------------------------------------------------------
    txn.paid_price,
    txn.paid_shipping,
    txn.item_price,
    txn.item_total,
    txn.cost,
    txn.quantity,
    txn.local_amount,
    txn.wish_cash_paid,
    txn.wish_cash_credit,
    txn.refund_amount,
    txn.refundable_cash_amount,
    txn.displayed_price,
    txn.displayed_shipping,
    txn.pppi_price_before_personal_price,
    txn.pppi_price_after_personal_price,
    txn.sppi_price_before_personal_price,
    txn.sppi_price_after_personal_price,
    txn.retail_delivery_fee_amount,
    txn.merchant_currency_spot_exchange_rate,
    txn.merchant_currency_hedged_exchange_rate,
    txn.merchant_currency_daily_exchange_rate,
    txn.user_currency_spot_exchange_rate,
    txn.user_currency_hedged_exchange_rate,
    txn.user_currency_daily_exchange_rate,

    -- ------------------------------------------------------------------
    -- calculated fields (documented formulas)
    -- ------------------------------------------------------------------
    coalesce(txn.paid_price, 0) + coalesce(txn.paid_shipping, 0) as gmv,
    (
        coalesce(txn.paid_price, 0) + coalesce(txn.paid_shipping, 0)
    ) - (
        case
            when coalesce(txn.total, 0) + coalesce(txn.cash, 0) + coalesce(txn.discount_amount, 0) <> 0
                then (
                    coalesce(txn.paid_price, 0) + coalesce(txn.paid_shipping, 0)
                ) / (
                    coalesce(txn.total, 0) + coalesce(txn.cash, 0) + coalesce(txn.discount_amount, 0)
                )
            else 0.0
        end
    ) * coalesce(txn.discount_amount, 0) as actual_gmv,

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
        when 27 then 'ITEM_DOES_NOT_MATCH_LISTING'
        when 40 then 'FRAUD'
        when 54 then 'FRAUD'
        when 65 then 'FRAUD'
        else null
    end as refund_reason_category_name,

    txn.app_type,
    txn.app_type_name,
    txn.item_state,
    txn.item_prev_state,
    txn.ltd_product_state,
    txn.reroute_source,
    txn.ttd_tags_override_case_num,

    -- ------------------------------------------------------------------
    -- flags ('true' / 'false' string booleans)
    -- ------------------------------------------------------------------
    txn.is_c2c,
    txn.is_wish_express,
    txn.is_gifting,
    txn.is_free_gift,
    txn.is_free_sample,
    txn.is_daily_giveaway,
    txn.is_commerce_loan,
    txn.is_pts_redemption,
    txn.is_strategic_merchant,
    txn.is_wish_x_merchant,
    txn.is_testing,
    txn.is_ltd_product,
    case
        when lower(txn.is_ltd_product) = 'true' then true
        else false
    end as is_ltd_product_flag,
    txn.item_is_fbw,
    txn.contains_fbw_item,
    txn.contains_self_serve_fbw_item,
    txn.chargeback,

    -- ------------------------------------------------------------------
    -- geography / payment attributes
    -- ------------------------------------------------------------------
    txn.shipping_country,
    txn.country_code,
    txn.ip_country,
    txn.shipping_state,
    txn.shipping_city,
    txn.postal_code,
    txn.currency,
    txn.payment_method,
    txn.card_type,
    txn.funding_type,
    txn.bin_number,
    txn.cvv_check_response,
    txn.avs_error_response,
    txn.avs_postal_check_response,
    txn.avs_street_check_response,

    -- ------------------------------------------------------------------
    -- free text / identifiers
    -- ------------------------------------------------------------------
    txn.pending_reason,
    txn.credit_ids,
    txn.credit_applied,
    txn.cart_coupon_codes_applied,
    txn.wishcash_in,
    txn.pppi_personal_price_types,
    txn.sppi_personal_price_types,
    txn.ttd_tags_before_override,
    txn.min_shipping_time_shown,
    txn.max_shipping_time_shown,
    txn.min_delivery_time_before_grouping,
    txn.max_delivery_time_before_grouping,
    txn.refunded_by,

    -- ------------------------------------------------------------------
    -- PII / device identifiers
    -- ------------------------------------------------------------------
    txn.ip_address,
    txn.shipping_recipient,
    txn.device_id,
    txn.req_visitor_id,
    txn.seed_visitor_id
from {{ source('wish', 'master_commerce_transactions') }} as txn
