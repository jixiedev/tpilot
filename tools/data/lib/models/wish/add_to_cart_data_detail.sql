{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.add_to_cart_data_detail.
  Grain: one row per deduplicated add-to-cart log event, enriched with
  page / module attribution (`page_type`, `module_type`), a unified
  `collection_id`, and a guest `visitor_id`. Written hourly by
  `AddToCartDataDetail_Hourly` (full `INSERT OVERWRITE` per partition)
  and by the backfill DAGs `AddToCartBackfill` / `MerchEventsDailyBackfill`.

  Partitioning: `dt` (varchar YYYY-MM-DD) + `hr` (integer 0-23) in
  US/Pacific. `dt` is the default metric time dimension; `hr` is a
  categorical partition-hour dimension because the project time spine is
  day-grained only.

  The wrapper adds:
    * `atc_event_id`  - surrogate primary key (the upstream table has no
      enforced key; the hourly DAG only dedups on the full 38-field
      source tuple, of which 10 fields are dropped by the ETL).
    * `event_ts` / `event_day` - wall-clock reads of the source event
      timestamp `time` (unix epoch seconds, UTC).
    * `client_name`   - normalized channel label for the raw `client` code.
    * `likely_bot` / `is_deleted_user` / `product_source` - attributes
      unpacked from the `extra` JSON payload.
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
             )                                                 as atc_event_id,

    -- Source event clock. `time` is the raw unix-epoch-second value
    -- carried through from `sweeper.add_to_cart_data.time`.
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
    -- either the channel name or the integer code used by downstream
    -- consumer DAGs (0=web, 1=iosapp, 2=ipadapp, 3=androidapp,
    -- 4=mobileweb). `client_name` normalizes both forms.
    cast(atc.client as varchar)                              as client,
    case lower(trim(atc.client))
        when '0' then 'web'
        when '1' then 'iosapp'
        when '2' then 'ipadapp'
        when '3' then 'androidapp'
        when '4' then 'mobileweb'
        when 'web' then 'web'
        when 'iosapp' then 'iosapp'
        when 'ipadapp' then 'ipadapp'
        when 'androidapp' then 'androidapp'
        when 'mobileweb' then 'mobileweb'
        else atc.client
    end                                                      as client_name,

    -- Attribution
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

from {{ source('wish', 'add_to_cart_data_detail') }} as atc
