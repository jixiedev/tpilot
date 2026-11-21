{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.ulc_active_buyers.
  Grain: one row per (user_id, dt) — active buyer lifecycle snapshot day.
  Source: UlcActiveBuyerDaily / UlcActiveBuyerOverwrite (MDE ULC framework).
#}

select
    concat(b.user_id, '|', b.dt) as buyer_day_id,

    b.user_id,

    b.lifecycle,

    b.loyal_flag,
    case
        when b.loyal_flag = 1 then 'Loyal'
        else 'Not loyal'
    end as loyal_flag_name,

    b.loyal_cycles,

    b.power_flag,
    case
        when b.power_flag = 1 then 'Power buyer'
        else 'Not power buyer'
    end as power_flag_name,

    b.power_days,

    b.dt as dt_str,
    cast(b.dt as date) as dt

from {{ source('core_data', 'ulc_active_buyers') }} as b
