{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.commerce_transaction_refund_items.

  Grain: one row per CommerceTransactionRefundItem (a refund line item).
  `refund_id` is the unique row key. The parent grain is
  (transaction_id, variation_id); one parent refund document may carry many
  refund items, so aggregate at `refund_id` before joining to avoid fan-out.

  Read-only: the source is a Hive view over the latest dated snapshot
  sweeper_dev.commerce_transaction_refund_items_YYYYMMDD, rewritten daily by
  Airflow DAG IncrementalCTRefund_Tahoe (08:00 UTC). Materialized as a view
  in semantic_dw so we never overwrite wish.commerce_transaction_refund_items.

  Column handling:
    * `dt` (varchar YYYY-MM-DD) is the Pacific refund-day partition; it is
      cast to DATE here and is the default metric time dimension.
    * `refund_time` (unix seconds, UTC) and `merchant_payment_time`
      (stringified unix seconds) are converted to TIMESTAMP for joins and
      display only. They are NOT registered as MetricFlow time dimensions -
      the project time spine is day and only `dt` qualifies.
    * `time` and `date` are ETL load-window markers (Airflow day-window end /
      start), not business timestamps. Exposed for lineage only.
    * Enum codes keep their raw column and gain a human-readable `*_name`
      column (CASE mapping of the documented code list). The raw code stays a
      categorical dimension.
    * `refund_to_original_payment_amount`, `refund_to_wish_cash_amount`,
      `merchant_amount` and `merchant_responsible_amount` implement the
      documented calculated-field formulas verbatim. They are not stored
      columns in the source table.

  `reason_id` is intentionally NOT expanded into a name column: the table doc
  recommends using `reason_id` + `high_level_refund_category` on this table
  because sweeper_dev.dim_refund_reasons may lag the Python enum. Join that
  dimension in a Tableau model, not here.
#}

select
    -- ------------------------------------------------------------------
    -- keys / entities
    -- ------------------------------------------------------------------
    txn.refund_id,
    txn.transaction_id,
    txn.variation_id,
    txn.merchant_payment_id,

    -- ------------------------------------------------------------------
    -- time
    -- ------------------------------------------------------------------
    -- Pacific refund-day partition (varchar YYYY-MM-DD) cast to date.
    cast(txn.dt as date) as dt,

    -- Refund item creation time (unix seconds, UTC).
    txn.refund_time,
    cast(from_unixtime(txn.refund_time) as timestamp) as refund_time_ts,

    -- Merchant payout deduction time (varchar stringified unix seconds).
    txn.merchant_payment_time,
    cast(from_unixtime(try_cast(txn.merchant_payment_time as bigint)) as timestamp)
        as merchant_payment_time_ts,

    -- Original-payment refund leg status change time (unix seconds).
    txn.payment_refund_status_time,

    -- ETL load-window markers. NOT business timestamps - do not report on them.
    txn.time,
    txn.date,

    -- ------------------------------------------------------------------
    -- user-facing refund amounts (USD)
    -- ------------------------------------------------------------------
    txn.amount,
    txn.refund_payment_amount,
    txn.refund_cash_amount,
    txn.refund_fee_amount,
    txn.localized_amount,
    txn.localized_refund_payment_amount,
    txn.localized_refund_cash_amount,
    txn.quantity,

    -- ------------------------------------------------------------------
    -- merchant cost basis (USD) - not what the user was refunded
    -- ------------------------------------------------------------------
    txn.cost,
    txn.shipping_cost,
    txn.merchant_tax_amount,
    txn.merchant_responsibility,
    txn.partial_amount_percentage,

    -- ------------------------------------------------------------------
    -- documented calculated fields (not stored in the source table)
    -- ------------------------------------------------------------------
    -- Refund to original payment (OG) amount.
    case
        when coalesce(txn.refund_payment_method, 1) = 1
            then coalesce(txn.refund_payment_amount, txn.amount)
        else 0
    end as refund_to_original_payment_amount,

    -- Refund to Wish Cash amount.
    coalesce(txn.refund_cash_amount, 0)
        + case
            when txn.refund_payment_method = 2
                then coalesce(txn.refund_payment_amount, 0)
            else 0
          end as refund_to_wish_cash_amount,

    -- Merchant cost basis for the refunded line, with the type = 3
    -- (PARTIAL_AMOUNT) percentage adjustment.
    case
        when txn.type = 3
            then ((txn.cost + txn.shipping_cost) * txn.quantity)
                 * coalesce(txn.partial_amount_percentage, 0)
        else (txn.cost + txn.shipping_cost) * txn.quantity
    end as merchant_amount,

    -- Merchant share of that cost basis.
    case
        when txn.type = 3
            then ((txn.cost + txn.shipping_cost) * txn.quantity)
                 * coalesce(txn.partial_amount_percentage, 0)
        else (txn.cost + txn.shipping_cost) * txn.quantity
    end * coalesce(txn.merchant_responsibility, 0) as merchant_responsible_amount,

    -- ------------------------------------------------------------------
    -- reason
    -- ------------------------------------------------------------------
    txn.reason_id,
    txn.reason_note,
    txn.high_level_refund_category,
    txn.refund_by,

    -- ------------------------------------------------------------------
    -- enums: raw code + human-readable label
    -- ------------------------------------------------------------------
    txn.source,
    case txn.source
        when 100 then 'Merchant Dashboard'
        when 200 then 'Wish Assistant / Transaction Detail Page'
        when 300 then 'Wish Admin / CS Agent'
        when 400 then 'Payment Provider'
        else cast(txn.source as varchar)
    end as source_name,

    txn.type,
    case txn.type
        when 1 then 'FULL'
        when 2 then 'PARTIAL_QUANTITY'
        when 3 then 'PARTIAL_AMOUNT'
        else cast(txn.type as varchar)
    end as type_name,

    txn.amount_type,
    case txn.amount_type
        when 1 then 'GENERAL'
        when 2 then 'SHIPPING'
        when 3 then 'PRICE'
        else cast(txn.amount_type as varchar)
    end as amount_type_name,

    txn.refund_payment_method,
    case txn.refund_payment_method
        when 1 then 'ORIGINAL_PAYMENT'
        when 2 then 'COMMERCE_CASH'
        else cast(txn.refund_payment_method as varchar)
    end as refund_payment_method_name,

    txn.payment_refund_status,
    case txn.payment_refund_status
        when 1 then 'REFUND_INITIATED'
        when 2 then 'REFUND_ISSUED'
        when 3 then 'REFUND_VOIDED'
        when 4 then 'REFUND_FAILED'
        else cast(txn.payment_refund_status as varchar)
    end as payment_refund_status_name,

    txn.merchant_payment_status,
    case txn.merchant_payment_status
        when 0 then 'UNDEDUCTED'
        when 1 then 'DEDUCTED_BEFORE_PAYMENT'
        when 2 then 'DEDUCTED_AFTER_PAYMENT'
        else cast(txn.merchant_payment_status as varchar)
    end as merchant_payment_status_name,

    txn.should_refund_payment,
    case txn.should_refund_payment
        when 'true' then 'Refund to original payment'
        when 'false' then 'Cash-only refund (no external payment refund)'
        else txn.should_refund_payment
    end as should_refund_payment_name,

    txn.merchant_dispute_reason,
    case txn.merchant_dispute_reason
        when '1' then 'CORRECT_SIZE'
        when '2' then 'VALID_TRACKING'
        when '3' then 'AUTHORIZED_TO_SELL'
        when '4' then 'FRAUDULENT_BEHAVIOR'
        when '5' then 'NOT_DELIVERED_ON_TIME'
        when '6' then 'LATE_CONFIRMED_FULFILLMENT'
        when '7' then 'ITEM_IS_DAMAGED'
        when '8' then 'ITEM_NOT_MATCH_LISTING'
        when '9' then 'BANNED_MERCHANT'
        when '10' then 'PRODUCT_HIGH_REFUND_RATIO'
        when '11' then 'DELIVERED_TO_WRONG_ADDRESS'
        when '12' then 'INCOMPLETE_ORDER'
        when '13' then 'COUNTERFEIT_ITEM'
        when '14' then 'RETURNED_TO_SENDER'
        when '15' then 'OUT_OF_STOCK'
        when '16' then 'PRODUCT_LOW_RATING'
        when '17' then 'ITEM_MARKED_DELIVERED_BUT_DID_NOT_ARRIVE'
        when '18' then 'DID_NOT_ACCEPT_TOS_ON_TIME'
        when '19' then 'NOT_QUALIFIED_SHIPPING_PROVIDER'
        when '20' then 'MERCHANT_HIGH_REFUND_EAT_COST'
        when '21' then 'FAKE_TRACKING'
        when '22' then 'WISHBLUE_EPC_LATE_FULFULLMENT'
        when '23' then 'ITEM_IS_DANGEROUS'
        when '24' then 'MISLEADING_PRODUCT_TAG'
        when '25' then 'FBS_ITEM_NOT_PICKUP'
        when '26' then 'EPC_OVERWEIGHT'
        when '27' then 'EPC_OVERSIZE'
        when '28' then 'EPC_LAST_MILE_CARRIERS_UNABLE_TO_SHIP'
        when '29' then 'STORE_UPLOADED_INVENTORY_RETURN'
        when '30' then 'EPC_OVERVALUE'
        when '31' then 'RIGHT_OF_WITHDRAWAL'
        when '32' then 'MERCHANT_MANAGED_SERVICES'
        when '1000' then 'MERCHANT_REPORT_FRAUD'
        when '1001' then 'MERCHANT_REPORT_RETURN'
        else txn.merchant_dispute_reason
    end as merchant_dispute_reason_name

from {{ source('wish', 'commerce_transaction_refund_items') }} as txn
