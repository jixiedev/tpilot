{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over
  wishpost.finance_monthly_purchase_breakdown_fm_1y.

  fm = First Mile. First-mile (pre-leg, before last-mile combine)
  purchase-cost breakdown for the combined delivery programs
  (EPC / A+ / Fusion / Smart).

  Grain: one row per (dt, sales_date, country, region, is_124,
  pre_business_type, purchase_pre_pricing_channel,
  purchase_pre_channel, purchase_pre_logistics_supplier,
  purchase_pre_warehouse_supplier) cell. Built by
  WishpostOverallFinancePNL (task FinancePurchaseBreakdownTask_FM):
  sales mid-mapping joined to purchase mid-mapping on `mid`, filtered
  to pre-leg combined programs that also carry a post combined leg,
  passed through the 124-channel quality gate, deduped to one row per
  `pre_tracking_id`, then aggregated over ~1 year of mid-mapping
  history into a volume column and five pre-leg fee buckets.

  Each dt partition is a FULL rebuild of the FM breakdown, so dt is
  the daily snapshot date and sales_day (the cast of sales_date) is
  the business (sales-payment) date inside that ~1-year window.
  Summing across several dt partitions double-counts every sales day.

  Fee columns are CNY-normalized upstream via
  cnfinance.boc_exchange_rate_di; the Tableau dashboard converts to
  USD in BI. `time` is only the ETL load marker and is never a
  business date.

  Tableau models under semantic_layer/models/tableau/ own any
  dimension joins; this wrapper performs no joins.
#}

select
    cast(pbd.dt as date) as dt,

    cast(pbd.sales_date as date) as sales_day,
    pbd.sales_date,

    pbd.country,

    pbd.region,
    case pbd.region
        when 'European States' then 'Europe'
        when 'Americas' then 'Americas'
        when 'ROW' then 'Rest of World'
        when 'Other' then 'Other'
        else pbd.region
    end as region_name,

    pbd.pre_business_type,
    case pbd.pre_business_type
        when 'EPC' then 'EPC (Express Parcel China)'
        when 'A+' then 'A+ Service'
        when 'Fusion' then 'Fusion Service'
        when 'Smart' then 'Smart Delivery'
        else pbd.pre_business_type
    end as pre_business_type_name,

    pbd.is_124,
    case pbd.is_124
        when '124' then '124 channel'
        when 'non-124' then 'Non-124 channel'
        else pbd.is_124
    end as is_124_name,

    pbd.purchase_pre_pricing_channel,
    pbd.purchase_pre_channel,
    pbd.purchase_pre_logistics_supplier,
    pbd.purchase_pre_warehouse_supplier,

    pbd.volume,

    pbd.purchase_pre_logistics_fee,
    pbd.purchase_pre_warehouse_fee,
    pbd.purchase_pre_outbound_fee,
    pbd.purchase_pre_hub_fee,
    pbd.purchase_pre_other_fees,

    pbd.time,
    cast(from_unixtime(pbd.time) as timestamp) as record_ts,

    -- Surrogate key over the documented logical grain.
    concat(
        coalesce(pbd.dt, '__null__'), '|',
        coalesce(pbd.sales_date, '__null__'), '|',
        coalesce(pbd.country, '__null__'), '|',
        coalesce(pbd.region, '__null__'), '|',
        coalesce(pbd.is_124, '__null__'), '|',
        coalesce(pbd.pre_business_type, '__null__'), '|',
        coalesce(pbd.purchase_pre_pricing_channel, '__null__'), '|',
        coalesce(pbd.purchase_pre_channel, '__null__'), '|',
        coalesce(pbd.purchase_pre_logistics_supplier, '__null__'), '|',
        coalesce(pbd.purchase_pre_warehouse_supplier, '__null__')
    ) as purchase_breakdown_fm_id

from {{ source('wishpost', 'finance_monthly_purchase_breakdown_fm_1y') }} as pbd
