{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wishpost.finance_monthly_profits_1y.
  Grain: one row per (dt, date_type, date_value, delivery_program,
  country, region, is_124) cell. Built by WishpostOverallFinancePNL
  (dag_wishpost_overall_finance_pnl.py, lines 1362-1479) as a UNION ALL
  of three aggregated branches: the sales-side branch
  (date_type = 'sales_date', date_value = sale date) and two
  purchase-side branches (date_type = 'purchase_date', date_value =
  purchase date) covering Dropship/FBW and the EPC-family programs
  (EPC, A+, Fusion, Smart). Each dt partition is a full rolling
  ~366-day recompute of the business window, so dt is the daily
  snapshot date and date_value is the business date inside that
  window. All amounts are USD. pre_tracking_id_cnt counts parcels
  before logistics combination, post_tracking_id_cnt counts parcels
  after combination; their ratio is the EPC combination ratio used to
  allocate purchase cost. Tableau models under
  semantic_layer/models/tableau/ own any dimension joins; this wrapper
  performs no joins.
#}

select
    cast(fmp.dt as date) as dt,

    cast(fmp.date_value as date) as business_date,
    fmp.date_value,

    fmp.date_type,

    fmp.delivery_program,
    case fmp.delivery_program
        when 'Dropship' then 'Dropship'
        when 'FBW' then 'Fulfilled by Wish'
        when 'EPC' then 'EPC (Express Parcel China)'
        when 'A+' then 'A+ service'
        when 'Fusion' then 'Fusion service'
        when 'Smart' then 'Smart delivery'
        else fmp.delivery_program
    end as delivery_program_name,

    fmp.country,

    fmp.region,
    case fmp.region
        when 'EU' then 'Europe'
        when 'AM' then 'Americas'
        when 'AP' then 'Asia-Pacific'
        when 'Other' then 'Other'
        else fmp.region
    end as region_name,

    fmp.is_124,
    case fmp.is_124
        when '124' then '124 channel'
        when 'non-124' then 'Non-124 channel'
        else fmp.is_124
    end as is_124_name,

    fmp.time,
    cast(from_unixtime(fmp.time) as timestamp) as record_ts,
    cast(from_unixtime(fmp.time) as date) as record_dt,

    fmp.sales_amount,
    fmp.purchase_amount,
    fmp.pre_tracking_id_cnt,
    fmp.post_tracking_id_cnt,

    cast(fmp.dt as varchar) || '|' || coalesce(fmp.date_type, '__null__')
        || '|' || coalesce(fmp.date_value, '__null__')
        || '|' || coalesce(fmp.delivery_program, '__null__')
        || '|' || coalesce(fmp.country, '__null__')
        || '|' || coalesce(fmp.region, '__null__')
        || '|' || coalesce(fmp.is_124, '__null__') as profit_cell_id

from {{ source('wishpost', 'finance_monthly_profits_1y') }} as fmp
