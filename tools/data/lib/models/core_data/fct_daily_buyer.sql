{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.fct_daily_buyer.
  Grain: one row per (user_id, dt) — user-day buyer fact (non-LTD only).
  Source: DagDailyFctBuyer / fct_daily_buyer_shared.py.
#}

select
    concat(b.user_id, '|', b.dt) as buyer_day_id,

    b.user_id,

    b.client,
    case b.client
        when 0 then 'Web'
        when 1 then 'iPhone'
        when 2 then 'iPad'
        when 3 then 'Android'
        when 4 then 'Mobile Web'
        when 5 then 'Windows App'
        when 6 then 'Windows Phone App'
        when 7 then 'Android Instant App'
        else 'Unknown'
    end as client_name,
    case
        when b.client in (3, 7) then 'Android'
        when b.client in (1, 2) then 'iOS'
        when b.client = 0 then 'Web'
        when b.client = 4 then 'MobileWeb'
        else 'Other'
    end as client_group,
    case
        when b.client in (1, 2, 3, 5, 6, 7) then true
        else false
    end as is_mobile_app,

    b.shipping_country,

    b.gmv,
    b.revenue,
    b.txns,
    b.orders,

    b.dt as dt_str,
    cast(b.dt as date) as dt

from {{ source('core_data', 'fct_daily_buyer') }} as b
