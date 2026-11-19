{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.add_to_cart_detail.
  Grain: one row per deduplicated add-to-cart log event, enriched with
  page / module attribution (`page_type`, `module_type`), a unified
  `collection_id`, and a guest `visitor_id`. Source: `sweeper.add_to_cart_data`,
  cleaned by `dag_clean_add_to_cart_data_hh`.

  Partitioning: `dt` (varchar YYYY-MM-DD) + `hr` (bigint 0-23) in
  US/Pacific. `dt` is cast to date and is the default metric time
  dimension; `hr` stays an integer partition-hour dimension because the
  project time spine is day-grained only.

  The wrapper adds:
    * `atc_detail_event_id` - surrogate primary key (the upstream table
      enforces no key; the hourly DAG only dedups on the full source
      tuple, of which several columns are dropped by the ETL).
    * `event_ts` / `event_day` - wall-clock reads of the source event
      timestamp `time` (unix epoch seconds, UTC).
    * `client_name`         - normalized channel label for the raw
      `client` code.
    * `likely_bot` / `is_deleted_user` / `product_source` - attributes
      unpacked from the `extra` JSON payload.

  Dimension joins (products, merchants, collections) belong in a Tableau
  datasource model, not in this Hive wrapper.
#}

select
    -- Surrogate primary key. Built from every event-identifying column
    -- retained by the ETL (the raw JSON payloads `page_fields`,
    -- `module_fields` and `feed_filters` are excluded to keep the key
    -- compact). See the model description for the residual duplicate
    -- caveat.
    concat_ws('||',
              coalesce(cast(atc.dt as varchar), ''),
              coalesce(cast(atc.hr as varchar), ''),
              coalesce(cast(atc.time as varchar), ''),
              coalesce(atc.product_id, ''),
              coalesce(atc.variation_id, ''),
              coalesce(atc.user_id, ''),
              coalesce(atc.visitor_id, ''),
              coalesce(cast(atc.quantity as varchar), ''),
              coalesce(cast(atc.price as varchar), ''),
              coalesce(cast(atc.shipping as varchar), ''),
              coalesce(cast(atc.shipping_cost as varchar), ''),
              coalesce(cast(atc.merchant_price as varchar), ''),
              coalesce(cast(atc.merchant_shipping as varchar), ''),
              coalesce(cast(atc.cost as varchar), ''),
              coalesce(atc.client, ''),
              coalesce(atc.root_impression_id, ''),
              coalesce(atc.page_id, ''),
              coalesce(atc.module_id, ''),
              coalesce(atc.feed_type, ''),
              coalesce(atc.feed_identifier, ''),
              coalesce(atc.tile_position, ''),
              coalesce(atc.module, ''),
              coalesce(atc.extra, '')
             )                                                 as atc_detail_event_id,

    -- Source event clock. `time` is the raw unix-epoch-second value
    -- carried through from `sweeper.add_to_cart_data.time` (UTC).
    cast(atc.time as bigint)                                 as time,
    cast(from_unixtime(atc.time) as timestamp)               as event_ts,
    cast(from_unixtime(atc.time) as date)                    as event_day,

    -- Partition columns. `dt` is cast to date for MetricFlow time
    -- semantics; `hr` stays an integer partition hour.
    cast(atc.dt as date)                                     as dt,
    cast(atc.hr as integer)                                  as hr,

    -- Identity / join keys
    cast(atc.user_id as varchar)                             as user_id,
    cast(atc.visitor_id as varchar)                          as visitor_id,
    cast(atc.product_id as varchar)                          as product_id,
    cast(atc.variation_id as varchar)                        as variation_id,
    cast(atc.collection_id as varchar)                       as collection_id,
    cast(atc.root_impression_id as varchar)                  as root_impression_id,

    -- Event amounts (USD)
    cast(atc.quantity as double)                             as quantity,
    cast(atc.price as double)                                as price,
    cast(atc.shipping as double)                             as shipping,
    cast(atc.shipping_cost as double)                        as shipping_cost,
    cast(atc.merchant_price as double)                       as merchant_price,
    cast(atc.merchant_shipping as double)                    as merchant_shipping,
    cast(atc.cost as double)                                 as cost,

    -- Client / channel. `client` is logged as a string and may carry
    -- either the integer code documented for this table
    -- (0=WEB, 1=IOS_APP, 2=IPAD_APP, 3=ANDROID_APP,
    -- 4=MOBILE_WEB, 5=WINDOWS_APP, 6=WINDOWS_PHONE_APP,
    -- 7=ANDROID_INSTANT_APP) or the equivalent channel name
    -- (web, iosapp, ipadapp, androidapp, mobileweb / mweb).
    -- `client_name` normalizes both forms to the documented code label.
    cast(atc.client as varchar)                              as client,
    case lower(trim(atc.client))
        when '0' then 'WEB'
        when '1' then 'IOS_APP'
        when '2' then 'IPAD_APP'
        when '3' then 'ANDROID_APP'
        when '4' then 'MOBILE_WEB'
        when '5' then 'WINDOWS_APP'
        when '6' then 'WINDOWS_PHONE_APP'
        when '7' then 'ANDROID_INSTANT_APP'
        when 'web' then 'WEB'
        when 'iosapp' then 'IOS_APP'
        when 'ipadapp' then 'IPAD_APP'
        when 'androidapp' then 'ANDROID_APP'
        when 'mobileweb' then 'MOBILE_WEB'
        when 'mweb' then 'MOBILE_WEB'
        else atc.client
    end                                                      as client_name,

    -- Attribution. `page_type` / `module_type` are already resolved
    -- upstream by the ETL join to
    -- `sweeper_dev.feed_tile_page_module_mapping`.
    cast(atc.page_id as varchar)                             as page_id,
    cast(atc.module_id as varchar)                           as module_id,
    cast(atc.page_type as varchar)                           as page_type,
    cast(atc.module_type as varchar)                         as module_type,
    cast(atc.feed_type as varchar)                           as feed_type,
    cast(atc.feed_identifier as varchar)                     as feed_identifier,
    cast(atc.tile_position as varchar)                       as tile_position,
    cast(atc.module as varchar)                              as module,

    -- Governance extension payload. The ETL serializes a map of
    -- likely_bot / is_deleted_user / product_source into `extra`; the
    -- three attributes are unpacked here for filtering.
    cast(atc.extra as varchar)                               as extra,
    json_extract_scalar(atc.extra, '$.likely_bot')           as likely_bot,
    json_extract_scalar(atc.extra, '$.is_deleted_user')      as is_deleted_user,
    json_extract_scalar(atc.extra, '$.product_source')       as product_source,

    -- Raw JSON payloads (kept for traceability / drill-down only)
    cast(atc.feed_filters as varchar)                        as feed_filters,
    cast(atc.page_fields as varchar)                         as page_fields,
    cast(atc.module_fields as varchar)                       as module_fields

from {{ source('wish', 'add_to_cart_detail') }} as atc
