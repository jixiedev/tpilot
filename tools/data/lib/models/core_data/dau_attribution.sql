{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.dau_attribution.
  Grain: one row per user_id × dt (MDE daily user marketing attribution fact).
  Source: DailyDauAttribution_cde (partition lag ds-2).
#}

select
    concat(da.user_id, '|', da.dt) as user_day_id,

    da.user_id,
    da.time,
    cast(from_unixtime(da.time) as timestamp) as day_anchor_ts,

    da.client,
    case da.client
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
        when 'unknown' then 'Unknown'
        else da.client
    end as client_name,

    da.country_code,
    da.ds,
    cast(da.dt as date) as dt,

    da.flag_buyer,
    case
        when lower(da.flag_buyer) = 'yes' then 'Yes'
        else 'No'
    end as flag_buyer_name,

    da.gmv,
    da.num_txn,
    da.num_order,

    da.first_touch_1d,
    da.last_touch_1d,
    da.first_touch_3d,
    da.last_touch_3d,
    da.first_touch_7d,
    da.last_touch_7d,
    da.first_touch_14d,
    da.last_touch_14d,
    da.first_touch_30d,
    da.last_touch_30d,

    da.flag_install_ads_1d,
    da.flag_install_ads_3d,
    da.flag_install_ads_7d,
    da.flag_install_ads_14d,
    da.flag_install_ads_30d,

    da.ads_channel_first_touch_1d,
    da.ads_channel_last_touch_1d,
    da.ads_channel_first_touch_3d,
    da.ads_channel_last_touch_3d,
    da.ads_channel_first_touch_7d,
    da.ads_channel_last_touch_7d,
    da.ads_channel_first_touch_14d,
    da.ads_channel_last_touch_14d,
    da.ads_channel_first_touch_30d,
    da.ads_channel_last_touch_30d,

    da.first_touch_1d_buyer,
    da.last_touch_1d_buyer,
    da.first_touch_3d_buyer,
    da.last_touch_3d_buyer,
    da.first_touch_7d_buyer,
    da.last_touch_7d_buyer,
    da.first_touch_14d_buyer,
    da.last_touch_14d_buyer,
    da.first_touch_30d_buyer,
    da.last_touch_30d_buyer,

    da.flag_install_ads_1d_buyer,
    da.flag_install_ads_3d_buyer,
    da.flag_install_ads_7d_buyer,
    da.flag_install_ads_14d_buyer,
    da.flag_install_ads_30d_buyer,

    da.ads_channel_first_touch_1d_buyer,
    da.ads_channel_last_touch_1d_buyer,
    da.ads_channel_first_touch_3d_buyer,
    da.ads_channel_last_touch_3d_buyer,
    da.ads_channel_first_touch_7d_buyer,
    da.ads_channel_last_touch_7d_buyer,
    da.ads_channel_first_touch_14d_buyer,
    da.ads_channel_last_touch_14d_buyer,
    da.ads_channel_first_touch_30d_buyer,
    da.ads_channel_last_touch_30d_buyer,

    da.dau_attribution,
    case da.dau_attribution
        when 'performance ads' then 'Performance Ads'
        when 'brand ads' then 'Brand Ads'
        when 'Push_Noti' then 'Push Noti'
        when 'Social_Event' then 'Social Event'
        else da.dau_attribution
    end as dau_attribution_name,

    da.buyer_attribution,
    case da.buyer_attribution
        when 'performance ads' then 'Performance Ads'
        when 'brand ads' then 'Brand Ads'
        when 'Push_Noti' then 'Push Noti'
        when 'Social_Event' then 'Social Event'
        else da.buyer_attribution
    end as buyer_attribution_name

from {{ source('core_data', 'dau_attribution') }} as da
