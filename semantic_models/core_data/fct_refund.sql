{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.fct_refund.
  Grain: one aggregated refund event row per the pipeline GROUP BY keys within
  partition dt (user, transaction, variation, amount, reason, type, times, etc.).
  Source: DailyCorePipelines / MRFDailyCore / fct_refund.yaml.
#}

select
    concat(
        r.dt, '|',
        r.transaction_id, '|',
        r.variation_id, '|',
        cast(r.time as string), '|',
        cast(r.refunded_amount as string), '|',
        cast(r.refund_reason_category as string), '|',
        r.refunded_amount_type
    ) as refund_event_id,

    r.user_id,
    r.transaction_id,
    r.product_id,
    r.variation_id,
    r.merchant_id,

    r.refunded_amount,
    r.refund_reason_category,
    case r.refund_reason_category
        when -1 then 'OTHER'
        when 0 then 'INSUFFICIENT_INVENTORY'
        when 1 then 'UNABLE_TO_SHIP'
        when 2 then 'CUSTOMER_REQUEST'
        when 3 then 'ITEM_DAMAGED'
        when 4 then 'SUSPECTED_FRAUD'
        when 5 then 'EXPIRED_GIFT'
        when 6 then 'DECLINED_GIFT'
        when 7 then 'WRONG_ITEM'
        when 8 then 'DOES_NOT_FIT'
        when 9 then 'LATE_OR_MISSING'
        when 10 then 'FAKE_OR_COUNTERFEIT'
        when 11 then 'INVALID_ADDRESS'
        when 12 then 'POOR_QUALITY'
        when 13 then 'DOES_NOT_FIT_USERS_FAULT'
        when 14 then 'DOES_NOT_FIT_INCORRECT_SIZE'
        when 15 then 'DOES_NOT_FIT_WRONG_SIZE'
        when 16 then 'DOES_FIT_WRONG_SIZE'
        when 17 then 'FRAUDULENT_ACTIVITY'
        when 18 then 'USER_PLACED_ORDER_BY_MISTAKE'
        when 19 then 'USER_NO_LONGER_WANTS_ITEM'
        when 20 then 'SHIPPING_TAKING_TOO_LONG'
        when 21 then 'ITEM_NEVER_ARRIVED'
        when 22 then 'ITEM_DOES_NOT_FIT'
        when 23 then 'RECEIVED_WRONG_ITEM'
        when 24 then 'ITEM_IS_COUNTERFEIT'
        when 25 then 'ITEM_IS_DAMAGED'
        when 26 then 'ITEM_DOES_NOT_WORK_AS_DESCRIBED'
        when 27 then 'ITEM_DOES_NOT_MATCH_LISTING'
        when 28 then 'USER_CANCELLED_ORDER'
        when 29 then 'MERCHANT_FAILED_TO_FULFILL'
        when 30 then 'MERCHANT_SENT_TO_WRONG_ADDRESS'
        when 31 then 'USER_ENTERED_WRONG_ADDRESS'
        when 32 then 'ITEM_RETURNED_TO_SENDER'
        when 33 then 'INCOMPLETE_ORDER'
        when 34 then 'MERCHANT_OUT_OF_STOCK'
        when 35 then 'ITEM_MARKED_DELIVERED_BUT_DID_NOT_ARRIVE'
        when 36 then 'NOT_QUALIFIED_SHIPPING_PROVIDER'
        when 37 then 'EXPIRED_GROUP_BUY'
        when 38 then 'REPLACEMENT_NEVER_RECEIVED'
        when 39 then 'FBW_WAREHOUSE_FAILED_TO_FULFILL'
        when 40 then 'CONSUMER_FRAUD'
        when 41 then 'WISHBLUE_EPC_LATE_FULFILLMENT'
        when 42 then 'MISLEADING_LISTING'
        when 43 then 'ITEM_IS_DANGEROUS'
        when 44 then 'PICKUP_NOW_ITEM_NOT_PICKED_UP'
        when 45 then 'ONEOFF_WISH_ERROR'
        when 46 then 'CONFIRMED_FUSION_ITEM_NOT_PICKED_UP'
        when 47 then 'FBS_STORE_QUIT'
        when 48 then 'FBW_FAILED_TO_FULFILL_DUE_TO_CARRIER_RETURN'
        when 49 then 'STORE_UPLOADED_INVENTORY_RETURN'
        when 50 then 'PREORDER_NOT_FULFILLED'
        when 51 then 'ORDER_ROUTING'
        when 52 then 'SHOPIFY_MERCHANT_CANCELLED'
        when 53 then 'USER_CANCEL_CHANGE_PAYMENT'
        when 54 then 'MERCHANT_REPORTED_BUYER_FRAUD'
        when 55 then 'PRESALE_TIMELINE_CLOSED'
        when 56 then 'IN_GRACE_PERIOD_DELAY_CANCEL'
        when 57 then 'LIMBO_ORDER_UNFULFILLED'
        when 58 then 'CIRCULAR_ROUTED_UNFULFILLED'
        when 59 then 'PRICE_MATCH'
        when 60 then 'ITEM_MARKED_DELIVERED_NOT_ALL_ITEMS_ARRIVED'
        when 61 then 'CONTENT_POLICY_VIOLATION_CANCELLATION'
        when 62 then 'CUSTOMER_MANUFACTURER_COMPLAINT'
        when 63 then 'RIGHT_OF_WITHDRAWAL'
        when 64 then 'CLEARING_LIMBO'
        when 65 then 'MERCHANT_REPORTED_ORDER'
        when 66 then 'PREFER_NOT_TO_SAY'
        when 101 then 'EPC_OVERWEIGHT'
        when 102 then 'EPC_OVERSIZE'
        when 103 then 'EPC_LAST_MILE_CARRIERS_UNABLE_TO_SHIP'
        when 104 then 'EPC_OVERVALUE'
        when 111 then 'CB_USER_CANCELLED_ORDER'
        when 200 then 'BLUE_ADMIN_REFUND'
        when 201 then 'BLUE_FUSION_SENT_TO_WRONG_STORE'
        when 202 then 'BLUE_FUSION_STORE_LOST'
        when 203 then 'BLUE_STORE_OUT_OF_STOCK'
        when 204 then 'BLUE_DELIVERY_NOT_DELIVERED'
        when 205 then 'BLUE_STORE_QUIT'
        when 206 then 'BLUE_FUSION_IN_TRANSIT_LOST'
        when 207 then 'BLUE_FUSION_STORE_NOT_SCAN_IN'
        when 208 then 'BLUE_PROGRAM_DEPRECATION'
        when 1001 then 'WRONG_COLOR'
        when 1002 then 'ITEM_IS_POOR_QUALITY'
        when 1004 then 'PRODUCT_LISTING_MISSING_INFO'
        when 1005 then 'ITEM_DID_NOT_MEET_EXPECTATIONS'
        when 1006 then 'EMPTY_PACKAGE'
        when 1007 then 'INCORRECT_QUANTITY_OF_ITEMS'
        when 1008 then 'MISSING_ITEM_OR_PARTS'
        when 1009 then 'STORE_SENT_THE_WRONG_SIZE'
        when 1010 then 'ITEM_HELD_AT_CUSTOMS'
        when 1011 then 'ORDER_PLACED_BY_TECHNICAL_ERROR'
        when 1012 then 'PRODUCT_MALFUNCTION'
        when 1013 then 'CS_REFUND_FOR_USER_CANCEL'
        when 1014 then 'USER_ENTERED_INVALID_ADDRESS'
        when 1015 then 'RECEIVED_NOTE_FROM_MERCHANT'
        when 1100 then 'COMMERCEHUB_OTHER'
        when 1101 then 'COMMERCEHUB_OUT_OF_STOCK'
        when 1102 then 'COMMERCEHUB_CANCELLED_AT_MERCHANTS_REQUEST'
        when 1103 then 'COMMERCEHUB_BAD_ADDRESS'
        when 1104 then 'COMMERCEHUB_BAD_SKU'
        when 1105 then 'COMMERCEHUB_SUPPLIER_DETECTED_FRAUD'
        when 1110 then 'MISSING_ITEM_OR_PACKAGE'
        else concat('CODE_', cast(r.refund_reason_category as string))
    end as refund_reason_category_name,

    r.refunded_amount_type,

    r.eat_cost_ratio,
    case r.eat_cost_ratio
        when 0 then 'Wish eats cost'
        when 1 then 'Merchant eats cost'
        else 'Other'
    end as eat_cost_ratio_name,

    r.is_ltd_product,

    r.transaction_time,
    r.refunded_time,
    r.time,
    cast(from_unixtime(r.transaction_time) as timestamp) as transaction_ts,
    cast(from_unixtime(r.refunded_time) as timestamp) as refunded_ts,
    cast(from_unixtime(r.time) as timestamp) as event_ts,

    r.ds,
    cast(r.dt as date) as dt,
    (r.refunded_time - r.transaction_time) / 86400.0 as refund_lag_days

from {{ source('core_data', 'fct_refund') }} as r
