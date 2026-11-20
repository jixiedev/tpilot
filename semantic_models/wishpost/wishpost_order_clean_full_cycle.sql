{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wishpost.wishpost_order_clean_full_cycle.

  Grain: one row per first-mile WishPost parcel (`tracking_id`) per `dt`
  snapshot partition. The upstream Airflow DAG
  `dag_tahoe_wosp_order_clean_full_cycle` (task `full_cycle_query`) LEFT JOINs
  `wishpost.tmp_wishpost_order_clean_with_finance` (first-mile rows) to the
  combined-program rows of the same table on `pre.combined_to = post.id`, so
  the optional last-mile shipment is exposed through the `*_post` columns.
  This wrapper does NOT reimplement the ETL - it only renames, casts and
  enriches for the semantic layer.

  `dt` is the Hive partition (Airflow `ds` + 1 day) and a full daily snapshot
  of the order book, NOT a parcel event date. All `bigint` time columns are
  Unix epoch seconds: the raw integer is kept for joins, a `*_at` timestamp
  and a `*_day` calendar date are added for the day-granularity time
  dimensions (the project time spine is day). `time` is the Spark load
  instant and must never be used as a business filter.

  Materialized as a view in `semantic_dw` (set in dbt_project.yml); the
  physical Hive table is never modified. Tableau models join here - this
  wrapper performs no joins of its own.
#}

select

    -- ------------------------------------------------------------------
    -- Surrogate primary key
    -- ------------------------------------------------------------------
    coalesce(cast(txn.dt as varchar), '__null__') || '|' || coalesce(cast(txn.tracking_id as varchar), '__null__')  as tracking_dt_id,

    -- ------------------------------------------------------------------
    -- Business identifiers
    -- ------------------------------------------------------------------
    cast(txn.tracking_id as varchar)                     as tracking_id,
    cast(txn.tracking_id_post as varchar)                as tracking_id_post,
    cast(txn.id as varchar)                              as id,
    cast(txn.id_post as varchar)                         as id_post,
    cast(txn.wishpost_user_id as varchar)                as wishpost_user_id,
    cast(txn.wishpost_user_id_post as varchar)           as wishpost_user_id_post,
    cast(txn.wish_standard_tracking_id as varchar)       as wish_standard_tracking_id,
    cast(txn.wish_standard_tracking_id_post as varchar)  as wish_standard_tracking_id_post,
    cast(txn.last_mile_tracking_id as varchar)           as last_mile_tracking_id,
    cast(txn.last_mile_carrier as varchar)               as last_mile_carrier,
    cast(txn.wish_transaction_id as varchar)             as wish_transaction_id,
    cast(txn.wish_transaction_id_post as varchar)        as wish_transaction_id_post,
    cast(txn.wish_transaction_id_list as varchar)        as wish_transaction_id_list,
    cast(txn.wish_transaction_id_list_post as varchar)   as wish_transaction_id_list_post,
    cast(txn.tax_id as varchar)                          as tax_id,
    cast(txn.tax_id_post as varchar)                     as tax_id_post,
    cast(txn.merchant_id as varchar)                     as merchant_id,
    cast(txn.wish_user_id as varchar)                    as wish_user_id,

    -- ------------------------------------------------------------------
    -- Time fields
    -- ------------------------------------------------------------------
    cast(txn.dt as date)                                                as dt,
    cast(txn.time as bigint)                                            as time,
    cast(txn.order_created_time as bigint)                              as order_created_time,
    cast(from_unixtime(txn.order_created_time) as timestamp)            as order_created_at,
    cast(from_unixtime(txn.order_created_time) as date)                 as order_created_day,
    cast(txn.order_created_time_post as bigint)                         as order_created_time_post,
    cast(from_unixtime(txn.order_created_time_post) as timestamp)       as order_created_post_at,
    cast(from_unixtime(txn.order_created_time_post) as date)            as order_created_post_day,
    cast(txn.track_created_time as bigint)                              as track_created_time,
    cast(from_unixtime(txn.track_created_time) as timestamp)            as track_created_at,
    cast(from_unixtime(txn.track_created_time) as date)                 as track_created_day,
    cast(txn.track_created_time_post as bigint)                         as track_created_time_post,
    cast(from_unixtime(txn.track_created_time_post) as timestamp)       as track_created_post_at,
    cast(from_unixtime(txn.track_created_time_post) as date)            as track_created_post_day,
    cast(txn.last_updated as bigint)                                    as last_updated,
    cast(from_unixtime(txn.last_updated) as timestamp)                  as last_updated_at,
    cast(from_unixtime(txn.last_updated) as date)                       as last_updated_day,
    cast(txn.epc_combined_time as bigint)                               as epc_combined_time,
    cast(from_unixtime(txn.epc_combined_time) as timestamp)             as epc_combined_at,
    cast(from_unixtime(txn.epc_combined_time) as date)                  as epc_combined_day,
    cast(txn.pickup_ts as bigint)                                       as pickup_ts,
    cast(from_unixtime(txn.pickup_ts) as timestamp)                     as pickup_at,
    cast(from_unixtime(txn.pickup_ts) as date)                          as pickup_day,
    cast(txn.arrive_first_mile_ts as bigint)                            as arrive_first_mile_ts,
    cast(from_unixtime(txn.arrive_first_mile_ts) as timestamp)          as arrive_first_mile_at,
    cast(from_unixtime(txn.arrive_first_mile_ts) as date)               as arrive_first_mile_day,
    cast(txn.depart_first_mile_ts as bigint)                            as depart_first_mile_ts,
    cast(from_unixtime(txn.depart_first_mile_ts) as timestamp)          as depart_first_mile_at,
    cast(from_unixtime(txn.depart_first_mile_ts) as date)               as depart_first_mile_day,
    cast(txn.arrive_hub_ts as bigint)                                   as arrive_hub_ts,
    cast(from_unixtime(txn.arrive_hub_ts) as timestamp)                 as arrive_hub_at,
    cast(from_unixtime(txn.arrive_hub_ts) as date)                      as arrive_hub_day,
    cast(txn.depart_hub_ts as bigint)                                   as depart_hub_ts,
    cast(from_unixtime(txn.depart_hub_ts) as timestamp)                 as depart_hub_at,
    cast(from_unixtime(txn.depart_hub_ts) as date)                      as depart_hub_day,
    cast(txn.arrive_warehouse_ts as bigint)                             as arrive_warehouse_ts,
    cast(from_unixtime(txn.arrive_warehouse_ts) as timestamp)           as arrive_warehouse_at,
    cast(from_unixtime(txn.arrive_warehouse_ts) as date)                as arrive_warehouse_day,
    cast(txn.depart_warehouse_ts as bigint)                             as depart_warehouse_ts,
    cast(from_unixtime(txn.depart_warehouse_ts) as timestamp)           as depart_warehouse_at,
    cast(from_unixtime(txn.depart_warehouse_ts) as date)                as depart_warehouse_day,
    cast(txn.handover_carrier_ts as bigint)                             as handover_carrier_ts,
    cast(from_unixtime(txn.handover_carrier_ts) as timestamp)           as handover_carrier_at,
    cast(from_unixtime(txn.handover_carrier_ts) as date)                as handover_carrier_day,
    cast(txn.post_waybill_ts as bigint)                                 as post_waybill_ts,
    cast(from_unixtime(txn.post_waybill_ts) as timestamp)               as post_waybill_at,
    cast(from_unixtime(txn.post_waybill_ts) as date)                    as post_waybill_day,
    cast(txn.warehouse_delivered_ts as bigint)                          as warehouse_delivered_ts,
    cast(from_unixtime(txn.warehouse_delivered_ts) as timestamp)        as warehouse_delivered_at,
    cast(from_unixtime(txn.warehouse_delivered_ts) as date)             as warehouse_delivered_day,
    cast(txn.return_from_epc_warehouse_ts as bigint)                    as return_from_epc_warehouse_ts,
    cast(from_unixtime(txn.return_from_epc_warehouse_ts) as timestamp)  as return_from_epc_warehouse_at,
    cast(from_unixtime(txn.return_from_epc_warehouse_ts) as date)       as return_from_epc_warehouse_day,
    cast(txn.returned_to_merchant_ts as bigint)                         as returned_to_merchant_ts,
    cast(from_unixtime(txn.returned_to_merchant_ts) as timestamp)       as returned_to_merchant_at,
    cast(from_unixtime(txn.returned_to_merchant_ts) as date)            as returned_to_merchant_day,
    cast(txn.arrive_carrier_adj_ts as bigint)                           as arrive_carrier_adj_ts,
    cast(from_unixtime(txn.arrive_carrier_adj_ts) as timestamp)         as arrive_carrier_adj_at,
    cast(from_unixtime(txn.arrive_carrier_adj_ts) as date)              as arrive_carrier_adj_day,
    cast(txn.depart_carrier_ts as bigint)                               as depart_carrier_ts,
    cast(from_unixtime(txn.depart_carrier_ts) as timestamp)             as depart_carrier_at,
    cast(from_unixtime(txn.depart_carrier_ts) as date)                  as depart_carrier_day,
    cast(txn.return_by_carrier_ts as bigint)                            as return_by_carrier_ts,
    cast(from_unixtime(txn.return_by_carrier_ts) as timestamp)          as return_by_carrier_at,
    cast(from_unixtime(txn.return_by_carrier_ts) as date)               as return_by_carrier_day,
    cast(txn.depart_orign_country_adj_ts as bigint)                     as depart_orign_country_adj_ts,
    cast(from_unixtime(txn.depart_orign_country_adj_ts) as timestamp)   as depart_orign_country_adj_at,
    cast(from_unixtime(txn.depart_orign_country_adj_ts) as date)        as depart_orign_country_adj_day,
    cast(txn.arrive_dest_country_adj_ts as bigint)                      as arrive_dest_country_adj_ts,
    cast(from_unixtime(txn.arrive_dest_country_adj_ts) as timestamp)    as arrive_dest_country_adj_at,
    cast(from_unixtime(txn.arrive_dest_country_adj_ts) as date)         as arrive_dest_country_adj_day,
    cast(txn.arrive_dest_carrier_adj_ts as bigint)                      as arrive_dest_carrier_adj_ts,
    cast(from_unixtime(txn.arrive_dest_carrier_adj_ts) as timestamp)    as arrive_dest_carrier_adj_at,
    cast(from_unixtime(txn.arrive_dest_carrier_adj_ts) as date)         as arrive_dest_carrier_adj_day,
    cast(txn.arrive_carrier_ts as bigint)                               as arrive_carrier_ts,
    cast(from_unixtime(txn.arrive_carrier_ts) as timestamp)             as arrive_carrier_at,
    cast(from_unixtime(txn.arrive_carrier_ts) as date)                  as arrive_carrier_day,
    cast(txn.arrive_origin_airport_ts as bigint)                        as arrive_origin_airport_ts,
    cast(from_unixtime(txn.arrive_origin_airport_ts) as timestamp)      as arrive_origin_airport_at,
    cast(from_unixtime(txn.arrive_origin_airport_ts) as date)           as arrive_origin_airport_day,
    cast(txn.depart_origin_airport_ts as bigint)                        as depart_origin_airport_ts,
    cast(from_unixtime(txn.depart_origin_airport_ts) as timestamp)      as depart_origin_airport_at,
    cast(from_unixtime(txn.depart_origin_airport_ts) as date)           as depart_origin_airport_day,
    cast(txn.arrive_dest_airport_ts as bigint)                          as arrive_dest_airport_ts,
    cast(from_unixtime(txn.arrive_dest_airport_ts) as timestamp)        as arrive_dest_airport_at,
    cast(from_unixtime(txn.arrive_dest_airport_ts) as date)             as arrive_dest_airport_day,
    cast(txn.depart_dest_customs_ts as bigint)                          as depart_dest_customs_ts,
    cast(from_unixtime(txn.depart_dest_customs_ts) as timestamp)        as depart_dest_customs_at,
    cast(from_unixtime(txn.depart_dest_customs_ts) as date)             as depart_dest_customs_day,
    cast(txn.dest_customs_failure_ts as bigint)                         as dest_customs_failure_ts,
    cast(from_unixtime(txn.dest_customs_failure_ts) as timestamp)       as dest_customs_failure_at,
    cast(from_unixtime(txn.dest_customs_failure_ts) as date)            as dest_customs_failure_day,
    cast(txn.arrive_dest_country_ts as bigint)                          as arrive_dest_country_ts,
    cast(from_unixtime(txn.arrive_dest_country_ts) as timestamp)        as arrive_dest_country_at,
    cast(from_unixtime(txn.arrive_dest_country_ts) as date)             as arrive_dest_country_day,
    cast(txn.arrive_transithub_ts as bigint)                            as arrive_transithub_ts,
    cast(from_unixtime(txn.arrive_transithub_ts) as timestamp)          as arrive_transithub_at,
    cast(from_unixtime(txn.arrive_transithub_ts) as date)               as arrive_transithub_day,
    cast(txn.depart_transithub_ts as bigint)                            as depart_transithub_ts,
    cast(from_unixtime(txn.depart_transithub_ts) as timestamp)          as depart_transithub_at,
    cast(from_unixtime(txn.depart_transithub_ts) as date)               as depart_transithub_day,
    cast(txn.out_for_delivery_ts as bigint)                             as out_for_delivery_ts,
    cast(from_unixtime(txn.out_for_delivery_ts) as timestamp)           as out_for_delivery_at,
    cast(from_unixtime(txn.out_for_delivery_ts) as date)                as out_for_delivery_day,
    cast(txn.attempt_delivery_ts as bigint)                             as attempt_delivery_ts,
    cast(from_unixtime(txn.attempt_delivery_ts) as timestamp)           as attempt_delivery_at,
    cast(from_unixtime(txn.attempt_delivery_ts) as date)                as attempt_delivery_day,
    cast(txn.delivered_ts as bigint)                                    as delivered_ts,
    cast(from_unixtime(txn.delivered_ts) as timestamp)                  as delivered_at,
    cast(from_unixtime(txn.delivered_ts) as date)                       as delivered_day,
    cast(txn.wait_customer_pickup_ts as bigint)                         as wait_customer_pickup_ts,
    cast(from_unixtime(txn.wait_customer_pickup_ts) as timestamp)       as wait_customer_pickup_at,
    cast(from_unixtime(txn.wait_customer_pickup_ts) as date)            as wait_customer_pickup_day,
    cast(txn.delivery_failed_ts as bigint)                              as delivery_failed_ts,
    cast(from_unixtime(txn.delivery_failed_ts) as timestamp)            as delivery_failed_at,
    cast(from_unixtime(txn.delivery_failed_ts) as date)                 as delivery_failed_day,
    cast(txn.arrive_carrier_adj_ts_post as bigint)                      as arrive_carrier_adj_ts_post,
    cast(from_unixtime(txn.arrive_carrier_adj_ts_post) as timestamp)    as arrive_carrier_adj_post_at,
    cast(from_unixtime(txn.arrive_carrier_adj_ts_post) as date)         as arrive_carrier_adj_post_day,
    cast(txn.released_to_merchant_time as bigint)                       as released_to_merchant_time,

    -- ------------------------------------------------------------------
    -- Order, channel and program enums
    -- ------------------------------------------------------------------
    cast(txn.state as bigint)                      as state,
    case txn.state
        when 0 then 'ERROR'
        when 1 then 'CREATED'
        when 2 then 'INVALID'
        when 3 then 'REJECTED'
        when 4 then 'CANCELLED'
        when 5 then 'REVIEWING'
        when 6 then 'ACCEPTED'
        when 7 then 'SHIPPING'
        when 8 then 'COMPLETED'
        when 9 then 'APPLYING_FOR_CANCEL'
        when 10 then 'PRE_PROCESSING'
        when 11 then 'DECLARING_CANCEL'
        when 12 then 'COLLECTION_OPTION_PENDING'
        else cast(txn.state as varchar)
    end                                        as state_name,
    cast(txn.state_post as bigint)                 as state_post,
    case txn.state_post
        when 0 then 'ERROR'
        when 1 then 'CREATED'
        when 2 then 'INVALID'
        when 3 then 'REJECTED'
        when 4 then 'CANCELLED'
        when 5 then 'REVIEWING'
        when 6 then 'ACCEPTED'
        when 7 then 'SHIPPING'
        when 8 then 'COMPLETED'
        when 9 then 'APPLYING_FOR_CANCEL'
        when 10 then 'PRE_PROCESSING'
        when 11 then 'DECLARING_CANCEL'
        when 12 then 'COLLECTION_OPTION_PENDING'
        else cast(txn.state_post as varchar)
    end                                        as state_post_name,
    cast(txn.order_channel as bigint)              as order_channel,
    case txn.order_channel
        when 1 then 'China Post'
        when 2 then 'DLP'
        when 3 then 'DLE'
        when 4 then 'EUB'
        when 5 then 'OWE'
        when 6 then 'PostNL'
        when 7 then 'MPAK'
        when 8 then 'TrakPak'
        when 9 then 'DHL Ecommerce'
        when 10 then 'Wish Priority'
        when 11 then 'SZ EUB'
        when 12 then 'IB'
        when 13 then 'UBI'
        when 14 then 'Asendia'
        when 15 then 'SC EUB'
        when 16 then 'IB Express'
        when 17 then 'IB Standard'
        when 18 then '4PX'
        when 19 then 'DHL PKD'
        when 20 then 'DHL PPS'
        when 21 then 'DHL PKG'
        when 22 then 'UPS'
        when 23 then 'WISE'
        when 24 then 'Sinotrans'
        when 33 then 'Chinapost STP'
        when 35 then 'Gati InWishP'
        when 36 then 'WishPost EPC'
        when 37 then 'YunExpress'
        when 39 then 'Gati InWishP BAT'
        when 40 then 'Gati InWish'
        when 41 then 'Gati InWish BAT'
        when 42 then 'Yanwen REG BAT'
        when 43 then 'Yanwen REG NBT'
        when 44 then 'WiseExpress'
        when 45 then 'Yanwen URG BAT'
        when 46 then 'Yanwen URG NBT'
        when 47 then 'UBI EU REG NBT'
        when 48 then 'UBI EU URG NBT'
        when 49 then 'Sunyou PKT REG'
        when 50 then 'Jiacheng REG NBT'
        when 51 then 'Chinapost EUB SH'
        when 52 then 'Chinapost EUB NONSH'
        when 53 then 'EMS Chinapost'
        when 54 then 'Sunyou PKT URG'
        when 55 then 'FLYT REG'
        when 56 then 'FLYT NRG'
        when 57 then 'Yunlu ID REG'
        when 58 then 'Yanwen Pickup'
        when 100 then 'FBW Warehouse'
        when 101 then 'FBWCN Dongguan 01'
        when 2801 then 'Special Channel'
        else 'Other'
    end                                        as order_channel_name,
    cast(txn.order_channel_post as bigint)         as order_channel_post,
    case txn.order_channel_post
        when 1 then 'China Post'
        when 2 then 'DLP'
        when 3 then 'DLE'
        when 4 then 'EUB'
        when 5 then 'OWE'
        when 6 then 'PostNL'
        when 7 then 'MPAK'
        when 8 then 'TrakPak'
        when 9 then 'DHL Ecommerce'
        when 10 then 'Wish Priority'
        when 11 then 'SZ EUB'
        when 12 then 'IB'
        when 13 then 'UBI'
        when 14 then 'Asendia'
        when 15 then 'SC EUB'
        when 16 then 'IB Express'
        when 17 then 'IB Standard'
        when 18 then '4PX'
        when 19 then 'DHL PKD'
        when 20 then 'DHL PPS'
        when 21 then 'DHL PKG'
        when 22 then 'UPS'
        when 23 then 'WISE'
        when 24 then 'Sinotrans'
        when 33 then 'Chinapost STP'
        when 35 then 'Gati InWishP'
        when 36 then 'WishPost EPC'
        when 37 then 'YunExpress'
        when 39 then 'Gati InWishP BAT'
        when 40 then 'Gati InWish'
        when 41 then 'Gati InWish BAT'
        when 42 then 'Yanwen REG BAT'
        when 43 then 'Yanwen REG NBT'
        when 44 then 'WiseExpress'
        when 45 then 'Yanwen URG BAT'
        when 46 then 'Yanwen URG NBT'
        when 47 then 'UBI EU REG NBT'
        when 48 then 'UBI EU URG NBT'
        when 49 then 'Sunyou PKT REG'
        when 50 then 'Jiacheng REG NBT'
        when 51 then 'Chinapost EUB SH'
        when 52 then 'Chinapost EUB NONSH'
        when 53 then 'EMS Chinapost'
        when 54 then 'Sunyou PKT URG'
        when 55 then 'FLYT REG'
        when 56 then 'FLYT NRG'
        when 57 then 'Yunlu ID REG'
        when 58 then 'Yanwen Pickup'
        when 100 then 'FBW Warehouse'
        when 101 then 'FBWCN Dongguan 01'
        when 2801 then 'Special Channel'
        else 'Other'
    end                                        as order_channel_post_name,
    cast(txn.parent_channel as bigint)             as parent_channel,
    case txn.parent_channel
        when 6000 then 'Chinapost Base URG'
        when 6500 then 'Chinapost Base REG'
        else cast(txn.parent_channel as varchar)
    end                                        as parent_channel_name,
    cast(txn.parent_channel_post as bigint)        as parent_channel_post,
    case txn.parent_channel_post
        when 6000 then 'Chinapost Base URG'
        when 6500 then 'Chinapost Base REG'
        else cast(txn.parent_channel_post as varchar)
    end                                        as parent_channel_post_name,
    cast(txn.pricing_channel as integer)           as pricing_channel,
    case
        when txn.pricing_channel = 0 then 'No Channel'
        when txn.pricing_channel = 2000 then 'Standard'
        when txn.pricing_channel = 3500 then 'Economy'
        when txn.pricing_channel = 5001 then 'EPC Standard'
        when txn.pricing_channel = 5002 then 'EPC Economy'
        when txn.pricing_channel between 5051 and 5056 then 'SMT Channel'
        when txn.pricing_channel between 5101 and 5103 then 'Unused'
        when txn.pricing_channel = 5501 then 'Nile Combined'
        when txn.pricing_channel = 5551 then 'Nile Combined Alt'
        when txn.pricing_channel = 10000 then 'EPC Bag Pack'
        else cast(txn.pricing_channel as varchar)
    end                                        as pricing_channel_name,
    cast(txn.pricing_channel_post as integer)      as pricing_channel_post,
    case
        when txn.pricing_channel_post = 0 then 'No Channel'
        when txn.pricing_channel_post = 2000 then 'Standard'
        when txn.pricing_channel_post = 3500 then 'Economy'
        when txn.pricing_channel_post = 5001 then 'EPC Standard'
        when txn.pricing_channel_post = 5002 then 'EPC Economy'
        when txn.pricing_channel_post between 5051 and 5056 then 'SMT Channel'
        when txn.pricing_channel_post between 5101 and 5103 then 'Unused'
        when txn.pricing_channel_post = 5501 then 'Nile Combined'
        when txn.pricing_channel_post = 5551 then 'Nile Combined Alt'
        when txn.pricing_channel_post = 10000 then 'EPC Bag Pack'
        else cast(txn.pricing_channel_post as varchar)
    end                                        as pricing_channel_post_name,
    cast(txn.pay_currency as bigint)               as pay_currency,
    case txn.pay_currency
        when 1 then 'USD'
        when 2 then 'EUR'
        when 3 then 'GBP'
        when 4 then 'CAD'
        when 5 then 'AUD'
        when 6 then 'JPY'
        when 7 then 'CNY'
        when 8 then 'ZAR'
        when 9 then 'BRL'
        when 10 then 'INR'
        else cast(txn.pay_currency as varchar)
    end                                        as pay_currency_name,
    cast(txn.pay_currency_post as bigint)          as pay_currency_post,
    case txn.pay_currency_post
        when 1 then 'USD'
        when 2 then 'EUR'
        when 3 then 'GBP'
        when 4 then 'CAD'
        when 5 then 'AUD'
        when 6 then 'JPY'
        when 7 then 'CNY'
        when 8 then 'ZAR'
        when 9 then 'BRL'
        when 10 then 'INR'
        else cast(txn.pay_currency_post as varchar)
    end                                        as pay_currency_post_name,
    cast(txn.carrier_pickup_state as bigint)       as carrier_pickup_state,
    case txn.carrier_pickup_state
        when 0 then 'CARRIER_NOT_INFORMED'
        when 1 then 'FIRST_MILE_PICKUP_FAILED'
        when 2 then 'LINE_HAUL_PICKUP_FAILED'
        when 3 then 'LAST_MILE_PICKUP_FAILED'
        when 10 then 'FIRST_MILE_INFORMED'
        when 11 then 'FIRST_MILE_PICKUP_SUCCESS'
        when 20 then 'LINE_HAUL_INFORMED'
        when 21 then 'LINE_HAUL_PICKUP_SUCCESS'
        when 30 then 'LAST_MILE_INFORMED'
        when 31 then 'LAST_MILE_PICKUP_SUCCESS'
        else cast(txn.carrier_pickup_state as varchar)
    end                                        as carrier_pickup_state_name,
    cast(txn.carrier_pickup_state_post as bigint)  as carrier_pickup_state_post,
    case txn.carrier_pickup_state_post
        when 0 then 'CARRIER_NOT_INFORMED'
        when 1 then 'FIRST_MILE_PICKUP_FAILED'
        when 2 then 'LINE_HAUL_PICKUP_FAILED'
        when 3 then 'LAST_MILE_PICKUP_FAILED'
        when 10 then 'FIRST_MILE_INFORMED'
        when 11 then 'FIRST_MILE_PICKUP_SUCCESS'
        when 20 then 'LINE_HAUL_INFORMED'
        when 21 then 'LINE_HAUL_PICKUP_SUCCESS'
        when 30 then 'LAST_MILE_INFORMED'
        when 31 then 'LAST_MILE_PICKUP_SUCCESS'
        else cast(txn.carrier_pickup_state_post as varchar)
    end                                        as carrier_pickup_state_post_name,
    cast(txn.cancel_source as bigint)              as cancel_source,
    case txn.cancel_source
        when 1 then 'MERCHANT'
        when 2 then 'CARRIER'
        when 3 then 'OTHER'
        else cast(txn.cancel_source as varchar)
    end                                        as cancel_source_name,
    cast(txn.cancel_source_post as bigint)         as cancel_source_post,
    case txn.cancel_source_post
        when 1 then 'MERCHANT'
        when 2 then 'CARRIER'
        when 3 then 'OTHER'
        else cast(txn.cancel_source_post as varchar)
    end                                        as cancel_source_post_name,
    cast(txn.cancel_reason as bigint)              as cancel_reason,
    case
        when txn.cancel_reason between 40000 and 49999 then 'USER'
        when txn.cancel_reason between 50000 and 59999 then 'CARRIER'
        when txn.cancel_reason between 60000 and 69999 then 'ADMIN'
        else cast(txn.cancel_reason as varchar)
    end                                        as cancel_reason_name,
    cast(txn.cancel_reason_post as bigint)         as cancel_reason_post,
    case
        when txn.cancel_reason_post between 40000 and 49999 then 'USER'
        when txn.cancel_reason_post between 50000 and 59999 then 'CARRIER'
        when txn.cancel_reason_post between 60000 and 69999 then 'ADMIN'
        else cast(txn.cancel_reason_post as varchar)
    end                                        as cancel_reason_post_name,
    cast(txn.sensitivity_types as varchar)         as sensitivity_types,
    case txn.sensitivity_types
        when '[0]' then 'Normal goods'
        when '[0,1]' then 'Battery goods'
        when '[0,1,2]' then 'Sensitive goods'
        else txn.sensitivity_types
    end                                        as sensitivity_types_name,
    cast(txn.warehouse as bigint)                  as warehouse,
    case txn.warehouse
        when 1 then 'WISE_SH'
        when 2 then 'WISE_NJ'
        when 3 then 'SF_DG'
        when 4 then 'WISH_SH_TEST'
        when 5 then 'WISE_SZ'
        when 6 then 'YANWEN_DG'
        when 7 then 'PXIV_SZ'
        when 8 then 'SHUNYOU_SZ'
        when 9 then 'DGPOST_DG'
        when 10 then 'WISE_SH_II'
        when 11 then 'WISE_SH_BLUE'
        when 12 then 'QUANYI_DG'
        when 13 then 'HUIQIAN_SZ'
        when 14 then 'HUIQIAN_DG_BLUE'
        when 15 then 'WISE_SZ_II'
        when 16 then 'SHUNYOU_GZ'
        when 17 then 'HUIQIAN_DG'
        when 18 then 'HUIQIAN_DG_BLUE_II'
        when 19 then 'WISE_SH_III'
        when 20 then 'YANWEN_KS_BLUE'
        when 21 then 'WISH_SH_TEST_BLUE'
        when 22 then 'QUANYI_SH_BLUE'
        when 23 then 'SHUNYOU_GZ_BLUE'
        when 24 then 'SHPOST_SH'
        when 25 then 'YANWEN_KS'
        when 26 then 'CKI_DG'
        when 27 then 'DGPOST_DG_II'
        when 28 then 'DGPOST_DG_BLUE'
        when 29 then 'YANWEN_KS_II'
        when 30 then 'WISE_SH_IV'
        when 31 then 'WISE_SH_BLUE_II'
        when 32 then 'WISE_YW'
        else cast(txn.warehouse as varchar)
    end                                        as warehouse_name,

    -- ------------------------------------------------------------------
    -- Weights
    -- ------------------------------------------------------------------
    cast(txn.actual_weight as double)           as actual_weight,
    cast(txn.actual_weight_post as double)      as actual_weight_post,
    cast(txn.weight as double)                  as weight,
    cast(txn.weight_post as double)             as weight_post,
    cast(txn.volumetric_weight as double)       as volumetric_weight,
    cast(txn.volumetric_weight_post as double)  as volumetric_weight_post,
    cast(txn.lm_total_weight as double)         as lm_total_weight,
    cast(txn.weight_proportion as double)       as weight_proportion,

    -- ------------------------------------------------------------------
    -- Commerce rollups (Wish transactions)
    -- ------------------------------------------------------------------
    cast(txn.gmv as double)                          as gmv,
    cast(txn.paid_amount as double)                  as paid_amount,
    cast(txn.refund_amount as double)                as refund_amount,
    cast(txn.logistics_refund_amount as double)      as logistics_refund_amount,
    cast(txn.discount_amount as double)              as discount_amount,
    cast(txn.order_value as double)                  as order_value,
    cast(txn.total_merchant_value as double)         as total_merchant_value,
    cast(txn.max_merchant_value as real)             as max_merchant_value,
    cast(txn.avg_merchant_value as double)           as avg_merchant_value,
    cast(txn.wish_transaction_value as double)       as wish_transaction_value,
    cast(txn.wish_transaction_value_post as double)  as wish_transaction_value_post,
    cast(txn.quantity as bigint)                     as quantity,
    cast(txn.product_count as bigint)                as product_count,
    cast(txn.product_count_post as bigint)           as product_count_post,
    cast(txn.declared_value as double)               as declared_value,
    cast(txn.declared_value_post as double)          as declared_value_post,

    -- ------------------------------------------------------------------
    -- Finance fees (sales and purchase)
    -- ------------------------------------------------------------------
    cast(txn.purchase_logistics_fee as double)         as purchase_logistics_fee,
    cast(txn.purchase_warehouse_fee as double)         as purchase_warehouse_fee,
    cast(txn.purchase_vat_fee as double)               as purchase_vat_fee,
    cast(txn.purchase_volumetric_fee as double)        as purchase_volumetric_fee,
    cast(txn.purchase_other_fee as double)             as purchase_other_fee,
    cast(txn.purchase_large_cargo_fee_post as double)  as purchase_large_cargo_fee_post,
    cast(txn.purchase_logistics_fee_post as double)    as purchase_logistics_fee_post,
    cast(txn.purchase_warehouse_fee_post as double)    as purchase_warehouse_fee_post,
    cast(txn.purchase_vat_fee_post as double)          as purchase_vat_fee_post,
    cast(txn.purchase_volumetric_fee_post as double)   as purchase_volumetric_fee_post,
    cast(txn.purchase_other_fee_post as double)        as purchase_other_fee_post,
    cast(txn.sale_logistics_fee as double)             as sale_logistics_fee,
    cast(txn.sale_overtime_fine as double)             as sale_overtime_fine,
    cast(txn.sale_other_fee as double)                 as sale_other_fee,

    -- ------------------------------------------------------------------
    -- Flags, program and country attributes
    -- ------------------------------------------------------------------
    cast(txn.is_online_payment as varchar)                 as is_online_payment,
    cast(txn.is_online_payment_post as varchar)            as is_online_payment_post,
    cast(txn.is_124_order as varchar)                      as is_124_order,
    cast(txn.is_fashion as varchar)                        as is_fashion,
    cast(txn.is_uni_inv_directship as varchar)             as is_uni_inv_directship,
    cast(txn.is_ten_day_delivery as varchar)               as is_ten_day_delivery,
    cast(txn.is_flat_rate_shipping as varchar)             as is_flat_rate_shipping,
    cast(txn.flat_rate_applied_order as bigint)            as flat_rate_applied_order,
    cast(txn.flat_rate_coefficient_numerator as bigint)    as flat_rate_coefficient_numerator,
    cast(txn.flat_rate_coefficient_denominator as bigint)  as flat_rate_coefficient_denominator,
    cast(txn.insured as varchar)                           as insured,
    cast(txn.insured_post as varchar)                      as insured_post,
    cast(txn.registered as varchar)                        as registered,
    cast(txn.registered_post as varchar)                   as registered_post,
    cast(txn.pay_pr as varchar)                            as pay_pr,
    cast(txn.pay_pr_post as varchar)                       as pay_pr_post,
    cast(txn.delivery_program as varchar)                  as delivery_program,
    cast(txn.wishpost_order_source as varchar)             as wishpost_order_source,
    cast(txn.stage as varchar)                             as stage,
    cast(txn.order_recipient_country_short_en as varchar)  as order_recipient_country_short_en,
    cast(txn.shipping_country as varchar)                  as shipping_country,
    cast(txn.lm_zone as bigint)                            as lm_zone,
    cast(txn.lm_gateway as varchar)                        as lm_gateway,
    cast(txn.cancel_description as varchar)                as cancel_description,
    cast(txn.cancel_description_post as varchar)           as cancel_description_post,
    cast(txn.has_unity_order as integer)                   as has_unity_order,
    cast(txn.cnt_m_transaction_id as bigint)               as cnt_m_transaction_id,
    cast(txn.cnt_wish_user_id as bigint)                   as cnt_wish_user_id,
    cast(txn.cnt_merchant_id as bigint)                    as cnt_merchant_id,
    cast(txn.sensitivity_type_merchant as bigint)          as sensitivity_type_merchant,
    cast(txn.is_last_mile_tracking_expected as varchar)    as is_last_mile_tracking_expected,
    cast(txn.product_name as varchar)                      as product_name,
    cast(txn.product_name_chinese as varchar)              as product_name_chinese,

    -- ------------------------------------------------------------------
    -- Addresses and geography
    -- ------------------------------------------------------------------
    cast(txn.pickup_address as varchar)         as pickup_address,
    cast(txn.pickup_address_post as varchar)    as pickup_address_post,
    cast(txn.receiver_address as varchar)       as receiver_address,
    cast(txn.receiver_address_post as varchar)  as receiver_address_post,
    cast(txn.receiver_city as varchar)          as receiver_city,
    cast(txn.receiver_city_post as varchar)     as receiver_city_post,
    cast(txn.receiver_zipcode as varchar)       as receiver_zipcode,
    cast(txn.sender_address as varchar)         as sender_address,
    cast(txn.sender_address_post as varchar)    as sender_address_post,
    cast(txn.sender_city as varchar)            as sender_city,
    cast(txn.sender_city_post as varchar)       as sender_city_post,
    cast(txn.pickup_location as varchar)        as pickup_location,
    cast(txn.lh_pickup_city as varchar)         as lh_pickup_city,
    cast(txn.lh_pickup_province as varchar)     as lh_pickup_province
from {{ source('wishpost', 'wishpost_order_clean_full_cycle') }} as txn
