{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over
  wishpost.finance_monthly_profits_by_combine_ratio_1y.

  Grain: one row per (dt, date_type, date_value, delivery_program,
  country, region, is_124, combined_orphaned_reason, combine_ratio)
  cell. Built by WishpostOverallFinancePNL (dag_wishpost_overall_finance_pnl.py,
  task FinanceMonthlyProfitsByCombineTask) and scoped to the
  warehouse-combination programs only: EPC, A+, Fusion and Smart
  (Dropship / FBW are filtered out upstream).

  Time semantics (see the table documentation, section "Time fields:
  complete reference"):
    - dt          Hive partition / daily snapshot date (yyyy-MM-dd).
                  Each partition is a full rebuild of the rolling ~1y
                  combine-ratio P&L, so dt is the "as of" date and the
                  business dates live inside the partition.
    - date_value  Business time axis: the Asia/Shanghai calendar day of
                  the post-combination purchase / payment. date_type is
                  hard-coded to 'purchase_date' in this table (the
                  sibling finance_monthly_profits_1y also emits
                  'sales_date'; this one does not).
    - time        ETL wall-clock only: `unix_timestamp()` evaluated at
                  INSERT, constant per partition load. Never filter P&L
                  by it.

  Amounts are in the upstream fee currency (typically CNY); Tableau
  applies the CNY -> USD FX conversion outside Hive, so no currency
  conversion happens in this wrapper.

  Tableau models under semantic_layer/models/tableau/ own any dimension
  joins (e.g. country -> dim_region); this wrapper performs no joins.
#}

select
    cast(cmb.dt as date) as dt,

    cast(cmb.date_value as date) as business_date,
    cmb.date_value,
    cmb.date_type,

    cmb.delivery_program,
    case cmb.delivery_program
        when 'EPC' then 'EPC (Express Parcel China)'
        when 'A+' then 'A+ service'
        when 'Fusion' then 'Fusion service'
        when 'Smart' then 'Smart delivery'
        else cmb.delivery_program
    end as delivery_program_name,

    cmb.country,

    cmb.region,
    case cmb.region
        when 'European States' then 'Europe'
        when 'Americas' then 'Americas'
        when 'ROW' then 'Rest of World'
        when 'Other' then 'Other'
        else cmb.region
    end as region_name,

    cmb.is_124,
    case cmb.is_124
        when '124' then '124 channel'
        when 'non-124' then 'Non-124 channel'
        else cmb.is_124
    end as is_124_name,

    cmb.combine_ratio,
    case cmb.combine_ratio
        when '1' then '1 parcel per shipment'
        when '2' then '2 parcels per shipment'
        when '3' then '3 parcels per shipment'
        when '4' then '4 parcels per shipment'
        when '5' then '5 parcels per shipment'
        when '6+' then '6+ parcels per shipment'
        when 'Other' then 'Other / unknown'
        else cmb.combine_ratio
    end as combine_ratio_name,

    cmb.combined_orphaned_reason,
    case cmb.combined_orphaned_reason
        when '>1' then 'Multi-parcel combine'
        when 'Sensitive' then 'Sensitive goods (single parcel)'
        when 'Overtime' then 'Warehouse arrival overtime (single parcel)'
        when 'Other' then 'Other single parcel'
        else cmb.combined_orphaned_reason
    end as combined_orphaned_reason_name,

    cmb.time,
    cast(from_unixtime(cmb.time) as timestamp) as record_ts,
    cast(from_unixtime(cmb.time) as date) as record_dt,

    cmb.sales_amount,
    cmb.purchase_amount,
    cmb.pre_tracking_id_cnt,
    cmb.post_tracking_id_cnt,

    cast(cmb.dt as varchar) || '|' || coalesce(cmb.date_type, '__null__')
        || '|' || coalesce(cmb.date_value, '__null__')
        || '|' || coalesce(cmb.delivery_program, '__null__')
        || '|' || coalesce(cmb.country, '__null__')
        || '|' || coalesce(cmb.region, '__null__')
        || '|' || coalesce(cmb.is_124, '__null__')
        || '|' || coalesce(cmb.combined_orphaned_reason, '__null__')
        || '|' || coalesce(cmb.combine_ratio, '__null__') as combine_profit_cell_id

from {{ source('wishpost', 'finance_monthly_profits_by_combine_ratio_1y') }} as cmb
