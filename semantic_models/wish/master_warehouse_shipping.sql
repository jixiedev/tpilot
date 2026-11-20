{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.master_warehouse_shipping.
  Grain: one row per (merchant_id, warehouse_id, product_id,
  variation_id, dest_country, shipping_type) shipping option within
  a `dt` partition. Built daily by Airflow DAG
  `TahoeMasterWarehouseShipping` (07:00 UTC) from MongoDB
  `warehouseshippingv2` / `merchantwarehousev2` / `commerceproduct` /
  `commercevariation`, with incremental updates from
  `sweeper_pt.warehouse_service_changes`. The wrapper materializes as
  a view in `semantic_dw`; the underlying table is partitioned by
  `dt` for partition pruning. `time` is derived from the first 8 hex
  chars of `product_id` and represents MongoDB ObjectId creation
  time (Unix seconds). `correct_shipping_type` is a derived
  Wish-Express / standard classifier.
#}

select
    concat_ws('||',
              coalesce(mws.merchant_id, ''),
              coalesce(mws.warehouse_id, ''),
              coalesce(mws.product_id, ''),
              coalesce(mws.variation_id, ''),
              coalesce(mws.dest_country, ''),
              cast(mws.shipping_type as varchar))
                                                                  as shipping_option_key,

    cast(mws.time as bigint)                                      as time,
    cast(from_unixtime(mws.time) as timestamp)                    as product_id_created_at,
    cast(from_unixtime(mws.time) as date)                         as product_id_created_day,

    cast(mws.merchant_id as varchar)                              as merchant_id,
    cast(mws.warehouse_id as varchar)                             as warehouse_id,
    cast(mws.product_id as varchar)                               as product_id,
    cast(mws.variation_id as varchar)                             as variation_id,
    cast(mws.dest_country as varchar)                             as dest_country,

    cast(mws.shipping_type as bigint)                             as shipping_type,
    case
        when mws.shipping_type = 1   then 'REGULAR'
        when mws.shipping_type = 2   then 'WISH_EXPRESS'
        when mws.shipping_type = 3   then 'WAIT_AND_SAVE'
        when mws.shipping_type = 100 then 'FBW_V1'
        when mws.shipping_type = 101 then 'FBW_V1_WLC'
        when mws.shipping_type = 200 then 'FBW_V2'
        when mws.shipping_type = 201 then 'FBW_V2_REGULAR'
        when mws.shipping_type = 202 then 'FBW_V2_EXPRESS'
        when mws.shipping_type = 203 then 'FBW_V2_CALCULATED'
        when mws.shipping_type = 300 then 'WISH_EXPRESS_2_DAY'
        when mws.shipping_type = 301 then 'WISH_EXPRESS_7_DAY'
        when mws.shipping_type = 500 then 'WISH_BLUE'
        when mws.shipping_type between 601 and 646
             then concat('MERCHANT_TTD_', cast(mws.shipping_type - 600 as varchar), '_DAY')
        else cast(mws.shipping_type as varchar)
    end                                                            as shipping_type_name,

    cast(mws.price as double)                                     as price,
    cast(mws.localized_price as double)                           as localized_price,
    cast(mws.localized_currency_code as varchar)                  as localized_currency_code,

    cast(mws.enabled as varchar)                                  as enabled,
    cast(mws.shipping_speed as varchar)                           as shipping_speed,

    cast(mws.correct_shipping_type as int)                        as correct_shipping_type,
    case
        when mws.correct_shipping_type = 1 then 'STANDARD'
        when mws.correct_shipping_type = 2 then 'WISH_EXPRESS'
        else cast(mws.correct_shipping_type as varchar)
    end                                                            as correct_shipping_type_name,

    cast(mws.dt as date)                                          as dt
from {{ source('wish', 'master_warehouse_shipping') }} as mws
