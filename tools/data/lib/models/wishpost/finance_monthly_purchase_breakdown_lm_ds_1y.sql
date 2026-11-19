{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over
  wishpost.finance_monthly_purchase_breakdown_lm_ds_1y.

  Grain: one row per (dt, sales_date, country, region, is_124,
  business_type, purchase_pricing_channel, purchase_channel,
  purchase_logistics_supplier, purchase_warehouse_supplier,
  purchase_large_cargo_supplier). Built by WishpostOverallFinancePNL
  (FinancePurchaseBreakdownTask_LM_DS) as a UNION ALL of two
  aggregated branches: DS (Dropship / FBW, keyed on pre_* fields) and
  LM (EPC / A+ / Fusion / Smart Combined, keyed on post_* fields, with
  post fees split equally across pre parcels). Each dt partition is a
  full rebuild of the LM + DS breakdown from the current *_1y
  mid-mapping, so dt is the daily snapshot date and sales_day (the cast
  of sales_date) is the business (sales-payment) date inside that ~1-year
  window.

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

    pbd.business_type,
    case pbd.business_type
        when 'Dropship' then 'Dropship'
        when 'FBW' then 'Fulfilled by Wish'
        when 'EPC Combined' then 'EPC (Express Parcel China) Combined'
        when 'A+ Combined' then 'A+ Service Combined'
        when 'Fusion Combined' then 'Fusion Service Combined'
        when 'Smart Combined' then 'Smart Delivery Combined'
        else pbd.business_type
    end as business_type_name,

    pbd.is_124,
    case pbd.is_124
        when '124' then '124 channel'
        when 'non-124' then 'Non-124 channel'
        else pbd.is_124
    end as is_124_name,

    pbd.purchase_pricing_channel,
    pbd.purchase_channel,
    pbd.purchase_logistics_supplier,
    pbd.purchase_warehouse_supplier,
    pbd.purchase_large_cargo_supplier,

    pbd.volume,
    pbd.weight,

    pbd.purchase_logistics_fee,
    pbd.purchase_other_fees,
    pbd.purchase_insurance_fee,
    pbd.purchase_volumetric_fee,
    pbd.purchase_warehouse_fee,
    pbd.purchase_large_cargo_fee,
    pbd.purchase_vat_fee,

    pbd.time,
    cast(from_unixtime(pbd.time) as timestamp) as record_ts,

    -- Surrogate key over the documented logical grain.
    concat(
        coalesce(pbd.dt, '__null__'), '|',
        coalesce(pbd.sales_date, '__null__'), '|',
        coalesce(pbd.country, '__null__'), '|',
        coalesce(pbd.region, '__null__'), '|',
        coalesce(pbd.is_124, '__null__'), '|',
        coalesce(pbd.business_type, '__null__'), '|',
        coalesce(pbd.purchase_pricing_channel, '__null__'), '|',
        coalesce(pbd.purchase_channel, '__null__'), '|',
        coalesce(pbd.purchase_logistics_supplier, '__null__'), '|',
        coalesce(pbd.purchase_warehouse_supplier, '__null__'), '|',
        coalesce(pbd.purchase_large_cargo_supplier, '__null__')
    ) as purchase_breakdown_lm_ds_id

from {{ source('wishpost', 'finance_monthly_purchase_breakdown_lm_ds_1y') }} as pbd
