{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.ulc_power_user.
  Grain: one row per (user_id, dt) for users active on snapshot day dt.
  Source: UlcPowerUserDaily / UlcPowerUserOverwrite (MDE ULC framework).
#}

select
    concat(p.user_id, '|', p.dt) as user_day_id,

    p.user_id,

    p.power_days,

    case
        when p.power_days >= 10 then 1
        else 0
    end as is_power_user,
    case
        when p.power_days >= 10 then 'Power user'
        else 'Not power user'
    end as is_power_user_name,

    p.dt as dt_str,
    cast(p.dt as date) as dt

from {{ source('core_data', 'ulc_power_user') }} as p
