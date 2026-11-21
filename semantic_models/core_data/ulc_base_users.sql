{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.ulc_base_users.
  Grain: one row per user_id × start_dt (packed 28-day activity interval).
  Source: UlcBaseUserDaily / UlcBaseUserOverwrite from fct_dau_w_bots.
#}

select
    concat(ubu.user_id, '|', ubu.start_dt) as user_interval_id,

    ubu.user_id,

    ubu.country_code,

    ubu.client,
    case ubu.client
        when 'web' then 'Desktop Web'
        when 'iosapp' then 'iOS App'
        when 'ipadapp' then 'iPad App'
        when 'androidapp' then 'Android App'
        when 'mobileweb' then 'Mobile Web'
        when 'mweb' then 'Mobile Web'
        when 'windowsapp' then 'Windows App'
        when 'windowsphoneapp' then 'Windows Phone App'
        when 'androidinstantapp' then 'Android Instant App'
        else ubu.client
    end as client_name,

    ubu.locale,

    cast(ubu.previous_start_dt as date) as previous_start_dt,
    cast(ubu.previous_end_dt as date) as previous_end_dt,
    cast(ubu.start_dt as date) as start_dt,
    cast(ubu.end_dt as date) as end_dt,
    cast(ubu.dt as date) as dt,

    case
        when ubu.previous_end_dt is not null
            then datediff(
                cast(ubu.start_dt as date),
                cast(ubu.previous_end_dt as date)
            )
    end as gap_days,

    datediff(cast(ubu.end_dt as date), cast(ubu.start_dt as date)) + 1 as interval_days,

    case
        when ubu.previous_start_dt is null then 'New'
        when datediff(
            cast(ubu.start_dt as date),
            cast(ubu.previous_end_dt as date)
        ) = 1 then 'Retained'
        else 'Resurrected'
    end as lifecycle_stage,

    case
        when ubu.previous_start_dt is null then 'Yes'
        else 'No'
    end as is_first_interval_name

from {{ source('core_data', 'ulc_base_users') }} as ubu
