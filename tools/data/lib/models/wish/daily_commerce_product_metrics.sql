{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.daily_commerce_product_metrics.
  Grain: one row per (product_id, dt) per Airflow load cycle of the
  `DailyCommerceProductMetrics` DAG (daily 01:00 America/Los_Angeles,
  covering the previous business-day aggregation window).

  The wrapper adds:
    * `product_day_key` - surrogate primary key. The physical table
      declares no Hive primary key; the documented grain is one row per
      (product_id, dt).
    * `dt` is cast from the varchar `YYYY-MM-DD` partition to `date` for
      MetricFlow time semantics, and is the default metric time
      dimension.

  All metric columns are read as-is. Bot filtering, HTTP response-status
  filtering, excluded transaction states and China-IP traffic exclusion
  are already applied upstream by the Airflow DAG, so this model does not
  re-implement any of that logic.

  Dimension joins (product, merchant, category) belong in a Tableau
  datasource model that `ref()`s this wrapper - never here.
#}

select
    -- Surrogate primary key. Both parts are coalesced to an empty string,
    -- so the key is never null.
    concat_ws('||',
              coalesce(cast(m.product_id as varchar), ''),
              coalesce(cast(m.dt as varchar), '')
             )                                                 as product_day_key,

    -- Identity / join keys
    cast(m.product_id as varchar)                           as product_id,

    -- Partition column. Cast to date for MetricFlow time semantics.
    cast(m.dt as date)                                      as dt,

    -- Exposure / funnel counts (bot-filtered, non-bot traffic only)
    cast(m.product_views as bigint)                         as product_views,
    cast(m.impressions as bigint)                           as impressions,
    cast(m.cs_impressions as bigint)                        as cs_impressions,
    cast(m.cart_impressions as bigint)                      as cart_impressions,
    cast(m.exploration_impression as bigint)                as exploration_impression,
    cast(m.exploration_c_impression as bigint)              as exploration_c_impression,

    -- Click interactions
    cast(m.wishes as bigint)                                as wishes,
    cast(m.add_to_carts as bigint)                          as add_to_carts,
    cast(m.recommends as bigint)                            as recommends,

    -- WE-scoped subset of `impressions`
    cast(m.we_impressions as bigint)                        as we_impressions,

    -- Conversion. `purchases` is a summed item quantity, not an
    -- order or transaction count.
    cast(m.purchases as bigint)                             as purchases,

    -- Monetization. `gmv` is paid price + paid shipping, stored as
    -- bigint at the physical layer.
    cast(m.gmv as bigint)                                   as gmv,
    cast(m.we_gmv as bigint)                                as we_gmv

from {{ source('wish', 'daily_commerce_product_metrics') }} as m
