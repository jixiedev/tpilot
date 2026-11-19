{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.fct_dau.
  Grain: one row per user_id × dt (daily active user engagement fact).
  Source: DailyCorePipelines / MRFDailyCore (sweeper_pt.requests).
#}

select
    concat(d.user_id, '|', d.dt) as user_day_id,

    d.user_id,
    d.time,
    cast(from_unixtime(d.time) as timestamp) as last_activity_ts,

    d.client,
    case d.client
        when 'web' then 'Desktop Web'
        when 'iosapp' then 'iOS App'
        when 'ipadapp' then 'iPad App'
        when 'androidapp' then 'Android App'
        when 'mobileweb' then 'Mobile Web'
        when 'windowsapp' then 'Windows App'
        when 'windowsphoneapp' then 'Windows Phone App'
        when 'androidinstantapp' then 'Android Instant App'
        when 'amazonapp' then 'Amazon App'
        when 'wishapp' then 'Wish App'
        else d.client
    end as client_name,

    d.country_code,
    d.locale,

    d.dau_date,
    cast(d.dau_date as date) as dau_activity_date,
    d.ds,
    cast(d.dt as date) as dt,

    d.num_impressions,
    d.num_clicks,
    d.num_wishlists,
    d.num_a2c_actions,
    d.num_cart_impressions,
    d.num_search_impressions,

    case when coalesce(d.num_clicks, 0) > 0 then 1 else 0 end as has_click,
    case when coalesce(d.num_impressions, 0) > 0 then 1 else 0 end as has_impression,
    case when coalesce(d.num_wishlists, 0) > 0 then 1 else 0 end as has_wishlist,
    case when coalesce(d.num_a2c_actions, 0) > 0 then 1 else 0 end as has_a2c,
    case when coalesce(d.num_cart_impressions, 0) > 0 then 1 else 0 end as has_cart_impression,
    case
        when coalesce(d.num_cart_impressions, 0) > 0
            and coalesce(d.num_a2c_actions, 0) > 0
        then 1
        else 0
    end as has_cart_visit_and_a2c

from {{ source('core_data', 'fct_dau') }} as d
