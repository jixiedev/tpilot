{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.master_order_tracking_infos.

  Physical grain: one row per order-tracking record, written to a daily
  `dt` partition (varchar YYYY-MM-DD). `dt` is calculated by the source ETL
  from the record creation timestamp, so it is the *creation* day of the
  tracking record, not the load day. The table is rebuilt daily through
  incremental processing with merge logic, so the same `tracking_id` can be
  re-emitted in a later partition. The wrapper therefore exposes a surrogate
  key `tracking_record_key` = `tracking_id` + `dt`, which is unique at the
  physical grain even when `tracking_id` repeats across partitions. The
  upstream Airflow / Spark ETL is NOT reimplemented here and the grain is not
  changed.

  Every physical column is re-exposed as-is; the wrapper only adds derived
  columns:
    * `tracking_record_key`  surrogate primary key (tracking_id + dt).
    * `<enum>_name`          human-readable label for the documented code
                             columns (`tracking_source`, `aftership_state`) and
                             for the documented boolean status flags.
    * `*_ts`                 unix seconds as timestamp.
    * `*_day`                unix seconds as date -- the day-grain time
                             dimensions (the project time spine is day).

  Timestamp encoding: `time`, `first_confirmed_update_time`,
  `wishpost_order_creation_time`, `confirmed_delivered_time`,
  `tracking_created_time`, `shipped_date`, `tracking_cancelled_date` and
  `first_in_transit_tracking_time` are documented as Unix epoch seconds and
  are converted with `from_unixtime`. `exp_delivery_time` is an integer
  "expected delivery timestamp" whose encoding the table documentation does
  NOT state as Unix seconds, so it is left untouched as a raw bigint.

  PII columns (`name`, `phone_number`, `signed_by`, `street_address`) are
  exposed by the underlying view but are deliberately NOT declared as
  MetricFlow dimensions in the semantic model.

  Source: wish.master_order_tracking_infos
  (documentation/llm_generated/hive/wish/master_order_tracking_infos.md).
#}

select
    -- ---- identity and key columns --------------------------------------------
    concat_ws('||', coalesce(moti.tracking_id, ''), coalesce(moti.dt, '')) as tracking_record_key,
    moti.tracking_id,
    moti.wish_standard_tracking_id,
    moti.transaction_id,
    moti.variation_id,
    moti.product_id,
    moti.user_id,
    moti.merchant_id,

    -- ---- partition and time columns -------------------------------------------
    -- `dt` is the varchar YYYY-MM-DD partition, cast to date for the
    -- day-grain time dimension. It is calculated from the record creation
    -- timestamp, so it is the creation day of the tracking record.
    cast(moti.dt as date) as dt,
    moti.time,
    moti.tracking_created_time,
    cast(from_unixtime(moti.tracking_created_time) as timestamp) as tracking_created_ts,
    moti.shipped_date,
    cast(from_unixtime(moti.shipped_date) as timestamp) as shipped_ts,
    cast(from_unixtime(moti.shipped_date) as date) as shipped_day,
    moti.confirmed_delivered_time,
    cast(from_unixtime(moti.confirmed_delivered_time) as timestamp) as confirmed_delivered_ts,
    cast(from_unixtime(moti.confirmed_delivered_time) as date) as confirmed_delivered_day,
    moti.first_confirmed_update_time,
    cast(from_unixtime(moti.first_confirmed_update_time) as timestamp) as first_confirmed_update_ts,
    moti.first_in_transit_tracking_time,
    cast(from_unixtime(moti.first_in_transit_tracking_time) as timestamp) as first_in_transit_ts,
    moti.tracking_cancelled_date,
    cast(from_unixtime(moti.tracking_cancelled_date) as timestamp) as tracking_cancelled_ts,
    moti.wishpost_order_creation_time,
    cast(from_unixtime(moti.wishpost_order_creation_time) as timestamp) as wishpost_order_creation_ts,
    -- Encoding not documented as unix seconds: kept as a raw bigint.
    moti.exp_delivery_time,

    -- ---- documented enums -----------------------------------------------------
    moti.tracking_source,
    case moti.tracking_source
        when 1 then 'AFTERSHIP'
        when 2 then 'TRACK17'
        when 3 then 'EASYPOST'
        when 4 then 'WISHPOST'
        when 6 then 'DHL'
        when 7 then 'EMS'
        when 8 then 'CHINAPOST'
        when 9 then 'GENERIC'
        when 10 then 'WOSP'
        when 11 then 'TRACKINGMORE'
        when 12 then 'WTS'
        when 99 then 'NO_OP'
        when 100 then 'USER'
        else 'UNKNOWN'
    end as tracking_source_name,
    moti.aftership_state,
    case moti.aftership_state
        when 0 then 'ORDER_PLACED'
        when 1 then 'MARKED_SHIPPED'
        when 2 then 'TRACKING_CHANGED'
        when 3 then 'SEND_TRACKING_SUCCESS'
        when 4 then 'SEND_TRACKING_FAIL'
        when 5 then 'IN_TRANSIT'
        when 6 then 'OUT_FOR_DELIVERY'
        when 7 then 'ATTEMPT_FAIL'
        when 8 then 'DELIVERED'
        when 9 then 'EXCEPTION'
        when 10 then 'EXPIRED'
        when 11 then 'PENDING'
        when 12 then 'INFO_RECEIVED'
        else 'UNKNOWN'
    end as aftership_state_name,

    -- ---- documented status flags ----------------------------------------------
    moti.is_delivered,
    case
        when moti.is_delivered is null then 'Unknown'
        when lower(moti.is_delivered) = 'true' then 'Delivered'
        when lower(moti.is_delivered) = 'false' then 'Not delivered'
        else 'Unknown'
    end as is_delivered_name,
    moti.is_confirmed,
    case
        when moti.is_confirmed is null then 'Unknown'
        when lower(moti.is_confirmed) = 'true' then 'Confirmed'
        when lower(moti.is_confirmed) = 'false' then 'Not confirmed'
        else 'Unknown'
    end as is_confirmed_name,
    moti.is_delivery_failure,
    case
        when moti.is_delivery_failure is null then 'Unknown'
        when lower(moti.is_delivery_failure) = 'true' then 'Delivery failure'
        when lower(moti.is_delivery_failure) = 'false' then 'No delivery failure'
        else 'Unknown'
    end as is_delivery_failure_name,
    moti.is_valid_tracking,
    case
        when moti.is_valid_tracking is null then 'Unknown'
        when lower(moti.is_valid_tracking) = 'true' then 'Valid tracking'
        when lower(moti.is_valid_tracking) = 'false' then 'Invalid tracking'
        else 'Unknown'
    end as is_valid_tracking_name,

    -- ---- shipping details -----------------------------------------------------
    moti.origin_country,
    moti.dest_country,
    moti.dest_country_tracking,
    moti.country,
    moti.city,
    moti.state,
    moti.zipcode,
    moti.dest_city,
    moti.dest_state,
    moti.dest_zipcode,
    moti.street_address,
    moti.pickup_location,
    moti.pickup_note,
    moti.provider,
    moti.provider_id,
    moti.service_code,
    moti.carrier_tier,
    moti.weight,
    moti.weight_unit,
    moti.shipping_cost,
    moti.wishpost_channel,
    moti.wishpost_warehouse,
    moti.wishpost_registered,
    moti.last_mile_tracking_expected,
    moti.return_to_sender,

    -- ---- PII (exposed by the view, not a MetricFlow dimension) -----------------
    moti.name,
    moti.phone_number,
    moti.signed_by,

    -- ---- derived measure ------------------------------------------------------
    -- Transit time from tracking creation to confirmed delivery, in days.
    -- Null until the package is confirmed delivered.
    case
        when moti.confirmed_delivered_time is not null
         and moti.tracking_created_time is not null
        then (moti.confirmed_delivered_time - moti.tracking_created_time) / 86400.0
    end as delivery_days

from {{ source('wish', 'master_order_tracking_infos') }} as moti
