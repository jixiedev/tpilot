{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wishpost.finance_monthly_sales_breakdown_1y.
  Grain: one row per (dt, date_type, date_value, country, region, is_124,
  business_type, pricing_channel, channel) aggregation cell. Built by
  WishpostOverallFinancePNL (Airflow DAG `WishpostOverallFinancePNL`,
  task `FinanceSalesBreakdownTask`, daily 10:00 Asia/Shanghai) as a
  rolling ~366-day recompute of the sales side, written with
  `INSERT OVERWRITE ... PARTITION (dt='{biz_date}')` where biz_date is
  execution_date - 1 day. Each dt partition therefore holds the full
  ~1y window: dt is the daily snapshot ("as of") date, while
  date_value (sales_day) is the business sales-payment calendar day
  inside that window.

  Fee columns (logistics_fee / overtime_fine / sensitive_fee /
  other_fees) and weight are maturity-gated: immature parcels
  contribute 0, so use volume_mature as the fee denominator. Revenue is
  logistics_fee + overtime_fine + sensitive_fee + other_fees. No FX
  conversion is applied in the DAG (amounts follow the sales payment
  dump currency). `time` is the ETL write epoch marker, not business
  time. Tableau models under semantic_layer/models/tableau/ own any
  dimension joins; this wrapper performs no joins.
#}

select
    cast(fmsb.dt as date) as dt,

    cast(fmsb.date_value as date) as sales_day,
    fmsb.date_value,
    fmsb.date_type,

    fmsb.country,
    fmsb.region,

    fmsb.is_124,
    case fmsb.is_124
        when '124' then '124 channel'
        when 'non-124' then 'Non-124 channel'
        else fmsb.is_124
    end as is_124_name,

    fmsb.business_type,
    case fmsb.business_type
        when 'A+ Combined' then 'A+'
        when 'Fusion Combined' then 'Fusion'
        when 'EPC Combined' then 'EPC'
        when 'Smart Combined' then 'Smart'
        when 'Dropship' then 'Dropship'
        when 'FBW' then 'FBW'
        else 'Others'
    end as delivery_program,
    case fmsb.business_type
        when 'A+ Combined' then 'A+ service'
        when 'Fusion Combined' then 'Fusion service'
        when 'EPC Combined' then 'EPC (Express Parcel China)'
        when 'Smart Combined' then 'Smart delivery'
        when 'Dropship' then 'Dropship'
        when 'FBW' then 'Fulfilled by Wish'
        else 'Others'
    end as delivery_program_name,

    fmsb.pricing_channel,
    fmsb.channel,

    fmsb.time,
    cast(from_unixtime(fmsb.time) as timestamp) as record_ts,

    cast(fmsb.volume as bigint) as volume,
    cast(fmsb.volume_mature as bigint) as volume_mature,
    cast(fmsb.weight as double) as weight,
    cast(fmsb.logistics_fee as double) as logistics_fee,
    cast(fmsb.overtime_fine as double) as overtime_fine,
    cast(fmsb.sensitive_fee as double) as sensitive_fee,
    cast(fmsb.other_fees as double) as other_fees,
    cast(fmsb.mid_cnt as bigint) as mid_cnt,
    cast(fmsb.gmv as double) as gmv,

    cast(fmsb.dt as varchar) || '|' || coalesce(fmsb.date_type, '__null__')
        || '|' || coalesce(fmsb.date_value, '__null__')
        || '|' || coalesce(fmsb.country, '__null__')
        || '|' || coalesce(fmsb.region, '__null__')
        || '|' || coalesce(fmsb.is_124, '__null__')
        || '|' || coalesce(fmsb.business_type, '__null__')
        || '|' || coalesce(fmsb.pricing_channel, '__null__')
        || '|' || coalesce(fmsb.channel, '__null__') as sales_cell_id

from {{ source('wishpost', 'finance_monthly_sales_breakdown_1y') }} as fmsb
