{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.fct_transaction_variations.
  Grain: one row per (transaction_id, variation_id) within partition dt.
#}

select
    concat(txn.transaction_id, '|', txn.variation_id) as transaction_variation_id,

    txn.transaction_id,
    txn.variation_id,
    txn.order_id,
    txn.user_id,
    txn.merchant_id,
    txn.product_id,
    txn.visitor_id,
    txn.seed_visitor_id,

    txn.payment_received_time,
    txn.transaction_time,
    cast(txn.dt as date) as dt,
    cast(from_unixtime(txn.transaction_timestamp) as timestamp) as transaction_ts,
    cast(from_unixtime(txn.time) as timestamp) as payment_received_ts,
    txn.transaction_timestamp,
    txn.time,
    datediff(txn.payment_received_time, txn.transaction_time) as payment_lag_days,

    txn.shipping_country,
    txn.client,
    case txn.client
        when 0 then 'Web'
        when 1 then 'iPhone'
        when 2 then 'iPad'
        when 3 then 'Android'
        when 4 then 'Mobile Web'
        when 5 then 'Windows Desktop'
        when 6 then 'Windows Phone'
        when 7 then 'Android Instant App'
        else 'Unknown'
    end as client_name,
    txn.payment_type,
    case txn.payment_type
        when -1 then 'None'
        when 0 then 'PayPal'
        when 1 then 'Braintree'
        when 2 then 'Braintree Facebook Autofill'
        when 3 then 'Stripe'
        when 4 then 'Braintree Google Wallet'
        when 5 then 'Stripe Google Wallet'
        when 6 then 'Boleto'
        when 7 then 'Stripe Apple Pay'
        when 8 then 'Klarna'
        when 9 then 'Adyen'
        when 10 then 'Ebanx'
        when 11 then 'OXXO'
        when 12 then 'Unknown'
        when 13 then 'Twitter Buy Now'
        when 14 then 'Boku'
        when 15 then 'Affirm'
        when 16 then 'Braintree PayPal'
        when 17 then 'Stripe iDEAL'
        when 18 then 'PayNearMe'
        when 19 then 'Braintree Venmo'
        when 20 then 'Stripe Samsung Pay'
        when 21 then 'Buy Now Pay Later'
        when 22 then 'Paytm'
        when 23 then 'Xendit Invoice'
        when 24 then 'Facebook Checkout'
        when 25 then 'Adyen Banking'
        when 26 then 'Offline Cash'
        when 27 then 'Braintree ACH'
        when 28 then 'Shopify Checkout'
        when 29 then 'Pix'
        when 30 then 'Afterpay'
        when 31 then 'Klarna Paylater'
        when 32 then 'Cash App Pay'
        else 'Other'
    end as payment_type_name,
    txn.installments,
    coalesce(txn.installments, 1) > 1 as is_installment,
    txn.is_ltd_product,
    txn.is_temporary_user,

    txn.quantity,
    txn.total,
    txn.gmv_variation,
    txn.raw_revenue_variation,
    txn.raw_total_tax,
    txn.wish_cash_variation
from {{ source('core_data', 'fct_transaction_variations') }} as txn
