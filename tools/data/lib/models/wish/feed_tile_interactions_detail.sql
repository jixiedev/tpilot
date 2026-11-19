{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.feed_tile_interactions_detail.

  Grain: one row per product-tile interaction detail record. The upstream
  hourly DAG (`FeedTileInteractionsCleanHourly_v0`) explodes a single raw
  `sweeper.feed_tile_interactions` record into one detail row per product
  tile, so a single logged event can produce many detail rows.

  Partitioning: `dt` (varchar YYYY-MM-DD) + `hr` (integer 0-23) in
  US/Pacific. `dt` is the default metric time dimension; `hr` is a
  categorical partition-hour dimension because the project time spine is
  day-grained only.

  The wrapper adds:
    * `feed_tile_interaction_id` - surrogate primary key. The upstream table
      enforces no key and the ETL dedups on the source `uuid`, which is not
      carried into the detail table.
    * `event_ts` / `event_day` / `request_ts` / `request_day` - wall-clock
      reads of the unix-epoch-second columns `event_time` and
      `request_time`. `time` is the *insert* clock, not the event clock, so
      it is kept as a raw epoch column only.
    * `client_name` / `boost_content_type_name` / `is_pb_name` - human
      readable labels for the documented enum codes.
    * `page_name` / `module_name` - unified page / module attribution
      (new `page_type` / `module_type` first, legacy logging as fallback),
      matching the documented page-and-module performance query.
#}

select
    -- Surrogate primary key. Built from every column the ETL retains that
    -- identifies a detail row: the partition, the log-record and event
    -- clocks, the request, the interaction, the user / session / visitor
    -- ids, the feed and page / module context, and the exploded tile
    -- attributes (product, tile position, price, boost flags and revenue).
    -- Null-safe by construction (every part is coalesced to an empty
    -- string). See the model description for the residual duplicate caveat.
    concat_ws('||',
              coalesce(cast(fti.dt as varchar), ''),
              coalesce(cast(fti.hr as varchar), ''),
              coalesce(cast(fti.time as varchar), ''),
              coalesce(cast(fti.event_time as varchar), ''),
              coalesce(fti.request_id, ''),
              coalesce(fti.action, ''),
              coalesce(fti.user_id, ''),
              coalesce(fti.session_id, ''),
              coalesce(fti.req_visitor_id, ''),
              coalesce(fti.feed_id, ''),
              coalesce(fti.feed_type, ''),
              coalesce(fti.page_id, ''),
              coalesce(fti.module_id, ''),
              coalesce(fti.product_id, ''),
              coalesce(fti.tile_position, ''),
              coalesce(fti.product_price, ''),
              coalesce(fti.is_pb, ''),
              coalesce(fti.pb_revenue, ''),
              coalesce(fti.pb_click_revenue, ''),
              coalesce(fti.boost_content_type, ''),
              coalesce(fti.collection_id, ''),
              coalesce(fti.root_impression_id, ''),
              coalesce(fti.client, '')
             )                                                 as feed_tile_interaction_id,

    -- Clocks. `time` is the server-side insert epoch and is explicitly NOT
    -- the event clock; `event_time` is the user-interaction clock and
    -- `request_time` the API-request clock. All three are unix epoch
    -- seconds (UTC).
    cast(fti.time as bigint)                                 as time,
    cast(fti.event_time as bigint)                            as event_time,
    cast(at_timezone(from_unixtime(fti.event_time), 'UTC') as timestamp)
                                                             as event_ts,
    cast(at_timezone(from_unixtime(fti.event_time), 'UTC') as date)
                                                             as event_day,
    cast(fti.request_time as bigint)                          as request_time,
    cast(at_timezone(from_unixtime(fti.request_time), 'UTC') as timestamp)
                                                             as request_ts,
    cast(at_timezone(from_unixtime(fti.request_time), 'UTC') as date)
                                                             as request_day,

    -- Partition columns. `dt` is cast to date for MetricFlow time
    -- semantics; `hr` stays an integer partition hour.
    cast(fti.dt as date)                                      as dt,
    cast(fti.hr as integer)                                   as hr,

    -- Identity / join keys
    cast(fti.user_id as varchar)                              as user_id,
    cast(fti.session_id as varchar)                           as session_id,
    cast(fti.req_visitor_id as varchar)                       as req_visitor_id,
    cast(fti.request_id as varchar)                           as request_id,
    cast(fti.product_id as varchar)                           as product_id,
    cast(fti.collection_id as varchar)                        as collection_id,
    cast(fti.root_impression_id as varchar)                   as root_impression_id,

    -- Interaction and feed context
    cast(fti.action as varchar)                               as action,
    cast(fti.feed_id as varchar)                              as feed_id,
    cast(fti.feed_type as varchar)                            as feed_type,
    cast(fti.tile_position as varchar)                        as tile_position,
    cast(fti.feed_tile_text as varchar)                       as feed_tile_text,

    -- Channel / user context
    cast(fti.client as varchar)                               as client,
    case lower(trim(cast(fti.client as varchar)))
        when 'iosapp'          then 'iOS App'
        when 'androidapp'      then 'Android App'
        when 'ipadapp'         then 'iPad App'
        when 'web'             then 'Web'
        when 'mobileweb'       then 'Mobile Web'
        when 'windowsapp'      then 'Windows App'
        when 'windowsphoneapp' then 'Windows Phone App'
        else fti.client
    end                                                       as client_name,
    cast(fti.client_version as varchar)                       as client_version,
    cast(fti.country_code as varchar)                         as country_code,

    -- Quality flags. Cast to varchar so the documented value set
    -- (true / false / null) is preserved and MetricFlow filters can
    -- compare against the string literals.
    cast(fti.likely_bot as varchar)                           as likely_bot,
    cast(fti.is_temporary_user as varchar)                    as is_temporary_user,
    cast(fti.is_browsy as varchar)                            as is_browsy,

    -- Product Boost. The source columns are varchar (double-encoded
    -- strings) and are parsed with try_cast so a malformed value yields
    -- null instead of failing the query.
    cast(fti.is_pb as varchar)                                as is_pb,
    case trim(cast(fti.is_pb as varchar))
        when '1' then 'boosted'
        when '0' then 'not_boosted'
        else fti.is_pb
    end                                                       as is_pb_name,
    try_cast(fti.pb_revenue as double)                        as pb_revenue,
    try_cast(fti.pb_click_revenue as double)                  as pb_click_revenue,
    try_cast(fti.pb_scaling_factor as double)                 as pb_scaling_factor,
    try_cast(fti.product_price as double)                     as product_price,
    cast(fti.boost_content_type as varchar)                   as boost_content_type,
    case trim(cast(fti.boost_content_type as varchar))
        when '-1' then 'NONE'
        when '0'  then 'DFF'
        when '1'  then 'TRUE_TAG'
        when '2'  then 'NEWA'
        when '3'  then 'RELATED_PRODUCTS'
        when '4'  then 'SEARCH'
        when '5'  then 'EXPLORATION'
        when '6'  then 'CAMPAIGN'
        when '10' then 'OUTLET'
        when '11' then 'EXPRESS_SEARCH'
        when '12' then 'LATEST'
        when '13' then 'PRODUCT_DETAIL_RELATED'
        when '14' then 'EXPRESS_FEED'
        when '15' then 'FB_CLICK_MAXBOOST'
        when '16' then 'IMPRESSION_MAXBOOST'
        when '17' then 'DEAL_DASH'
        when '18' then 'TAPSENSE_MAXBOOST'
        when '19' then 'SHOPPING_NEW_MAXBOOST'
        when '20' then 'SHOPPING_ENGAGE_MAXBOOST'
        when '21' then 'TAPSENSE_FEED_IMP_MAXBOOST'
        when '22' then 'SEARCH_PB_STRIP'
        when '23' then 'RELATED_WE_STRIP'
        when '24' then 'FB_NEW_MAXBOOST'
        when '25' then 'BRANDBOOST'
        when '26' then 'CATEGORY'
        when '27' then 'COLLECTION_FEED'
        when '28' then 'PRODUCT_TRAY'
        when '29' then 'QOO10'
        else fti.boost_content_type
    end                                                       as boost_content_type_name,

    -- Page / module attribution. `page_type` / `module_type` come from the
    -- `sweeper_dev.feed_tile_page_module_mapping` lookup performed by the
    -- ETL; the legacy logging columns are the fallback for older records.
    cast(fti.page_id as varchar)                              as page_id,
    cast(fti.page_field as varchar)                           as page_field,
    cast(fti.page_type as varchar)                            as page_type,
    cast(fti.page_old_logging as varchar)                     as page_old_logging,
    case
        when fti.page_type is not null then fti.page_type
        else fti.page_old_logging
    end                                                       as page_name,
    cast(fti.module_id as varchar)                            as module_id,
    cast(fti.module_field as varchar)                         as module_field,
    cast(fti.module_type as varchar)                          as module_type,
    cast(fti.module_old_logging as varchar)                   as module_old_logging,
    case
        when fti.module_type is not null then fti.module_type
        else fti.module_old_logging
    end                                                       as module_name,

    -- Browsy interactions
    cast(fti.browsy_interaction_module as varchar)            as browsy_interaction_module,
    cast(fti.browsy_interaction_index as integer)              as browsy_interaction_index,
    cast(fti.browsy_hero_product as varchar)                  as browsy_hero_product,

    -- Raw governance payload (kept for drill-down only)
    cast(fti.extra as varchar)                                as extra

from {{ source('wish', 'feed_tile_interactions_detail') }} as fti
