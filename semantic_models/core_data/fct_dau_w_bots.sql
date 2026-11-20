{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.fct_dau_w_bots.
  Grain: one row per user_id × dt (daily active user including guest and bot traffic).
  Source: FctDauWithBotsDaily (daily ~5 AM UTC).
#}

select
    concat(dau.user_id, '|', dau.dt) as user_day_id,

    dau.user_id,
    dau.user_type,
    case dau.user_type
        when 'Registered' then 'Registered'
        when 'Guest' then 'Guest'
        when 'Unclassified' then 'Unclassified'
        when 'Bot' then 'Bot'
        else dau.user_type
    end as user_type_name,

    dau.sign_in,
    case
        when dau.sign_in = 1 then 'Signed In'
        else 'Did Not Sign In'
    end as sign_in_name,

    dau.client,
    case dau.client
        when 'androidapp' then 'Android App'
        when 'iosapp' then 'iOS App'
        when 'ipadapp' then 'iPad App'
        when 'mweb' then 'Mobile Web'
        when 'mobileweb' then 'Mobile Web'
        when 'web' then 'Desktop Web'
        else dau.client
    end as client_name,
    case
        when dau.client = 'androidapp' then 'Android'
        when dau.client in ('iosapp', 'ipadapp') then 'iOS'
        when dau.client in ('mweb', 'mobileweb') then 'MWeb'
        when dau.client = 'web' then 'Web'
        else 'Other'
    end as client_group,

    dau.country_code,
    dau.locale,
    cast(dau.dt as date) as dt,

    case
        when coalesce(dau.num_clicks, 0) + coalesce(dau.num_a2c_actions, 0) > 0 then 1
        else 0
    end as is_good_dau,
    case when coalesce(dau.num_impressions, 0) > 0 then 1 else 0 end as has_impression,
    case when coalesce(dau.num_clicks, 0) > 0 then 1 else 0 end as has_click,
    case when coalesce(dau.num_a2c_actions, 0) > 0 then 1 else 0 end as has_a2c,
    case when coalesce(dau.num_wishlists, 0) > 0 then 1 else 0 end as has_wishlist,
    case when coalesce(dau.num_cart_impressions, 0) > 0 then 1 else 0 end as has_cart_impression,

    dau.num_impressions,
    dau.num_clicks,
    dau.num_wishlists,
    dau.num_a2c_actions,
    dau.num_cart_impressions,
    dau.num_search_impressions

from {{ source('core_data', 'fct_dau_w_bots') }} as dau
