{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.ulc_active_users.
  Grain: one row per (user_id, dt) — active user lifecycle snapshot day.
  Source: UlcActiveUserDaily / UlcActiveUserOverwrite (MDE ULC framework).
#}

select
    concat(u.user_id, '|', u.dt) as user_day_id,

    u.user_id,

    u.lifecycle,

    u.loyal_flag,
    case
        when u.loyal_flag = 1 then 'Loyal'
        else 'Not loyal'
    end as loyal_flag_name,

    u.loyal_cycles,

    u.power_flag,
    case
        when u.power_flag = 1 then 'Power user'
        else 'Not power user'
    end as power_flag_name,

    u.power_days,

    u.dt as dt_str,
    cast(u.dt as date) as dt

from {{ source('core_data', 'ulc_active_users') }} as u
