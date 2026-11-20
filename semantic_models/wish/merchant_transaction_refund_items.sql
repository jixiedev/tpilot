{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.merchant_transaction_refund_items.

  Grain: one row per merchant refund item (`id`, the MongoDB
  MerchantTransactionRefundItem ObjectId string). One refund item belongs to
  one merchant transaction (`m_transaction_id`); a merchant transaction can
  carry many refund items, so aggregate at `id` before joining.

  Read-only: the source is a partitioned Hive VIEW over the daily snapshot
  sweeper.merchant_transaction_refund_items_YYYYMMDD, recreated by Airflow
  DAG incremental_mtrefund_tahoe (docs cite `IncrementalMTRefund_Tahoe`).
  Materialized as a view in semantic_dw so we never overwrite
  wish.merchant_transaction_refund_items.

  Time semantics:
    * `dt` (varchar YYYY-MM-DD) is the ETL load/change day of the row
      version, NOT the business day of the refund. The upstream ETL is a
      MongoDB change-data-capture merge that keeps the newest version of
      each `id` (ROW_NUMBER() OVER (PARTITION BY id ORDER BY dt DESC)), so
      a refund item edited upstream is re-emitted into a later `dt`
      partition. Cast to DATE here; it is the default metric time dimension
      and drives partition pruning.
    * `refund_time` / `merchant_payment_time` /
      `payment_refund_status_time` / `cash_refund_status_time` are stored as
      DATE strings ("%Y-%m-%d", not unix seconds) by the ETL
      (strftime(date_format) with date_format = "%Y-%m-%d"). They are
      cast to DATE here and renamed to `*_date` so the name matches the
      value. `try_cast` is used because the ETL writes a NULL (not an
      empty string) for missing timestamps, and the legacy master rows are
      not guaranteed to be clean.
    * `refunded_date` is the same refund day rendered by the ETL as
      "%b %d, %Y" (e.g. "Jan 05, 2024"). It is a non-ISO duplicate of
      `refund_date` and is kept as a raw string for lineage only.
    * `time` is the ETL day-window start epoch (pipeline metadata), not a
      business timestamp. Kept raw plus a `_ts` mirror for joins; it is
      NOT a MetricFlow time dimension.

  Enum codes keep their raw column and gain a human-readable `*_name`
  column (CASE mapping of the documented code list from
  clroot/sweeper/model/commerce_transaction_refund.py):
  RefundSource (100/200/300/400), RefundType (1/2/3),
  RefundAmountType (1/2/3), RefundMethod (1/2), PaymentStatus (0/1/2).
  The raw code stays a categorical dimension.

  ETL artifact fix: the ETL writes `str(<optional ObjectId>)`, which turns
  a missing id into the literal string 'None' rather than NULL. The three
  affected columns (`merchant_payment_id`, `dispute_payment_id`,
  `dispute_approved_id`) are wrapped in `nullif(..., 'None')` so that
  count_distinct and entity joins do not treat 'None' as a real key.

  No dimension joins happen here. Join merchant / product / warehouse
  dimensions in a Tableau model that `ref()`s this wrapper.
#}

select
    -- ------------------------------------------------------------------
    -- keys / entities
    -- ------------------------------------------------------------------
    txn.id,
    txn.m_transaction_id,
    nullif(txn.merchant_payment_id, 'None') as merchant_payment_id,

    -- ------------------------------------------------------------------
    -- time
    -- ------------------------------------------------------------------
    -- ETL load / change day partition (varchar YYYY-MM-DD) cast to date.
    cast(txn.dt as date) as dt,

    -- Business refund day (UTC calendar day the refund item was created).
    try_cast(txn.refund_time as date) as refund_date,

    -- Business day the merchant payout was deducted.
    try_cast(txn.merchant_payment_time as date) as merchant_payment_date,

    -- Day the original-payment refund leg status last changed.
    try_cast(txn.payment_refund_status_time as date) as payment_refund_status_date,

    -- Day the Wish Cash refund leg status last changed.
    try_cast(txn.cash_refund_status_time as date) as cash_refund_status_date,

    -- Legacy non-ISO rendering of the refund day ("Jan 05, 2024").
    txn.refunded_date,

    -- ETL day-window start epoch. Pipeline metadata, not a business time.
    txn.time,
    cast(from_unixtime(txn.time) as timestamp) as time_ts,

    -- ------------------------------------------------------------------
    -- refund amounts (original / merchant currency - NOT USD)
    -- ------------------------------------------------------------------
    txn.amount,
    txn.refund_payment_amount,
    txn.refund_cash_amount,
    txn.refund_credit_amount,

    -- Buyer's local currency counterparts. Not aggregatable across
    -- currencies, so they are deliberately not exposed as metrics.
    txn.localized_amount,
    txn.localized_refund_payment_amount,
    txn.localized_refund_cash_amount,
    txn.localized_refund_credit_amount,

    -- ------------------------------------------------------------------
    -- merchant cost basis and responsibility (merchant source currency)
    -- ------------------------------------------------------------------
    txn.merchant_amount,
    txn.merchant_amount_with_wishpost,
    txn.merchant_responsible_amount,
    txn.merchant_responsible_amount_with_wishpost,
    txn.merchant_responsibility,
    txn.merchant_tax_amount,

    -- ------------------------------------------------------------------
    -- tax
    -- ------------------------------------------------------------------
    txn.refund_tax,

    -- Deprecated / not populated by the current ETL. Kept for lineage.
    txn.net_tax,
    txn.sales_tax,
    txn.net_tax_in_merchant_currency,
    txn.sales_tax_in_merchant_currency,
    txn.refund_tax_in_merchant_currency,

    -- ------------------------------------------------------------------
    -- currency / country context
    -- ------------------------------------------------------------------
    txn.merchant_source_currency,
    txn.merchant_currency_code,
    txn.authority_currency_code,
    txn.authority_country_code,

    -- ------------------------------------------------------------------
    -- quantity and partial-refund share
    -- ------------------------------------------------------------------
    txn.quantity,
    txn.partial_amount_percentage,
    txn.partial_amount_percentage_formatted,

    -- ------------------------------------------------------------------
    -- reason
    -- ------------------------------------------------------------------
    txn.reason_id,
    txn.reason_text,
    txn.reason_note,
    txn.buyer_fraud_reason_category,

    -- ------------------------------------------------------------------
    -- dispute
    -- ------------------------------------------------------------------
    txn.dispute_reason,
    txn.dispute_reason_policy,
    txn.dispute_reason_text,
    nullif(txn.dispute_approved_id, 'None') as dispute_approved_id,
    nullif(txn.dispute_payment_id, 'None') as dispute_payment_id,
    txn.eat_cost_warning_id,

    -- ------------------------------------------------------------------
    -- flags (varchar 'true' / 'false')
    -- ------------------------------------------------------------------
    txn.is_dispute_approved,
    txn.is_refund_item_disputable,
    txn.is_refund_to_cash,

    -- ------------------------------------------------------------------
    -- enums: raw code + human-readable label
    -- ------------------------------------------------------------------
    txn.source,
    case txn.source
        when 100 then 'Merchant'
        when 200 then 'Customer Cancelled'
        when 300 then 'Wish'
        when 400 then 'Payment Provider'
        else cast(txn.source as varchar)
    end as source_name,

    txn.source_text,

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

    txn.refund_payment_method_text,

    -- Status columns already carry the human-readable text produced by the
    -- ETL (RefundStatus.id_to_text): Pending / Confirmed / Not Paid /
    -- Denied. No *_name column is needed.
    txn.payment_refund_status,
    txn.cash_refund_status,

    txn.merchant_payment_status,
    case txn.merchant_payment_status
        when 0 then 'UNDEDUCTED'
        when 1 then 'DEDUCTED_BEFORE_PAYMENT'
        when 2 then 'DEDUCTED_AFTER_PAYMENT'
        else cast(txn.merchant_payment_status as varchar)
    end as merchant_payment_status_name

from {{ source('wish', 'merchant_transaction_refund_items') }} as txn
