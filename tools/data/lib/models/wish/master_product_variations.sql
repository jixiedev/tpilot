{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.master_product_variations.

  Grain: one row per product variation per `dt` daily snapshot partition.
  The table documentation names `_id` as the primary key, but the source is a
  *daily full snapshot* of the catalog, so `_id` is unique only inside a
  partition. The wrapper therefore exposes the surrogate key
  `variation_snapshot_id` (`concat_ws('||', _id, dt)`) and keeps `_id`
  (exposed as `variation_id`) as a join key.

  Read-only: the physical table is produced by the Airflow / Spark ETL that
  lands the MongoDB `CommerceProduct` / `CommerceVariation` collections
  (`IncrementalProductVariations_Tahoe`, `IncrementalProductVariations_Part2`).
  This wrapper is materialized as a view in schema `semantic_dw` (see
  dbt_project.yml), so it never overwrites wish.master_product_variations.

  Column handling:
    * `dt` (varchar YYYY-MM-DD) is the physical partition. It is cast to DATE
      here and is the default metric time dimension.
    * `time`, `generation_time` and `synced_time` are bigint "timestamp"
      columns. The raw integers are kept for joins and paired with `*_ts`
      timestamps and `*_date` day-grain columns. The project time spine is
      day, so only the `*_date` columns are registered as MetricFlow time
      dimensions.
    * `review_status` keeps its numeric code and gains a `review_status_name`
      label built from the documented code list (0=PENDING, 1=REJECTED,
      2=APPROVED).
    * The boolean-like flags (`enabled`, `halt_sales`, `is_fbw_item`,
      `product_removed`, `product_removed_by_merchant`, `variation_removed`,
      `is_unity`) are varchar 'true' / 'false' / null in the source. The raw
      column is kept for filtering and each flag gains a `*_name` companion
      with a human-readable label.
    * `rating_category` is the documented rating bucket from the table
      documentation's Product Rating Analysis example.
    * `merchant_source_currency` applies the documented field default: the
      documentation defines it as "USD" when the source value is null.
    * The documented ETL business logic is NOT recomputed here: `inventory` is
      already the ETL-summarized level (sum of the warehouse inventories when
      present, otherwise the raw level), `cost` / `merchant_price` already
      carry the documented "merchant value or localized fallback" rule, and
      `options` already includes the `color` / `size` keys.

  No dimension tables are joined here. Joins belong in Tableau models under
  semantic_layer/models/tableau/ that ref() this wrapper.
#}

select
    -- ------------------------------------------------------------------
    -- identity / keys
    -- ------------------------------------------------------------------
    concat_ws('||', coalesce(v._id, ''), coalesce(v.dt, '')) as variation_snapshot_id,
    v._id as variation_id,
    v.product_id,
    v.merchant_id,
    v.manufacturer_id,
    v.parent_sku,

    -- ------------------------------------------------------------------
    -- time
    -- ------------------------------------------------------------------
    cast(v.dt as date) as dt,

    cast(v.time as bigint) as time,
    cast(from_unixtime(v.time) as timestamp) as creation_ts,
    cast(from_unixtime(v.time) as date) as creation_date,

    cast(v.generation_time as bigint) as generation_time,
    cast(from_unixtime(v.generation_time) as timestamp) as generation_ts,
    cast(from_unixtime(v.generation_time) as date) as generation_date,

    cast(v.synced_time as bigint) as synced_time,
    cast(from_unixtime(v.synced_time) as timestamp) as synced_ts,
    cast(from_unixtime(v.synced_time) as date) as synced_date,

    -- ------------------------------------------------------------------
    -- catalog state flags (raw 'true' / 'false' varchar + readable label)
    -- ------------------------------------------------------------------
    v.enabled,
    case
        when v.enabled is null then 'Unknown'
        when lower(v.enabled) = 'true' then 'Enabled'
        when lower(v.enabled) = 'false' then 'Not enabled'
        else 'Unknown'
    end as enabled_name,

    v.halt_sales,
    case
        when v.halt_sales is null then 'Unknown'
        when lower(v.halt_sales) = 'true' then 'Sales halted'
        when lower(v.halt_sales) = 'false' then 'Sales not halted'
        else 'Unknown'
    end as halt_sales_name,

    v.is_fbw_item,
    case
        when v.is_fbw_item is null then 'Unknown'
        when lower(v.is_fbw_item) = 'true' then 'Fulfilled by Wish'
        when lower(v.is_fbw_item) = 'false' then 'Not fulfilled by Wish'
        else 'Unknown'
    end as is_fbw_item_name,

    v.product_removed,
    case
        when v.product_removed is null then 'Unknown'
        when lower(v.product_removed) = 'true' then 'Removed by Wish'
        when lower(v.product_removed) = 'false' then 'Not removed by Wish'
        else 'Unknown'
    end as product_removed_name,

    v.product_removed_by_merchant,
    case
        when v.product_removed_by_merchant is null then 'Unknown'
        when lower(v.product_removed_by_merchant) = 'true' then 'Removed by merchant'
        when lower(v.product_removed_by_merchant) = 'false' then 'Not removed by merchant'
        else 'Unknown'
    end as product_removed_by_merchant_name,

    v.variation_removed,
    case
        when v.variation_removed is null then 'Unknown'
        when lower(v.variation_removed) = 'true' then 'Variation removed'
        when lower(v.variation_removed) = 'false' then 'Variation not removed'
        else 'Unknown'
    end as variation_removed_name,

    v.is_unity,
    case
        when v.is_unity is null then 'Unknown'
        when lower(v.is_unity) = 'true' then 'Unity shipping enrolled'
        when lower(v.is_unity) = 'false' then 'Not enrolled in Unity shipping'
        else 'Unknown'
    end as is_unity_name,

    -- ------------------------------------------------------------------
    -- review status (code + label)
    -- ------------------------------------------------------------------
    v.review_status,
    case v.review_status
        when 0 then 'PENDING'
        when 1 then 'REJECTED'
        when 2 then 'APPROVED'
        else cast(v.review_status as string)
    end as review_status_name,

    -- ------------------------------------------------------------------
    -- pricing / cost
    -- ------------------------------------------------------------------
    coalesce(v.merchant_source_currency, 'USD') as merchant_source_currency,
    v.merchant_price,
    v.retail_price,
    v.cost,
    v.consignment_supply_cost,
    v.localized_merchant_price,
    v.localized_merchant_cost,
    v.localized_merchant_shipping,
    v.localized_merchant_shipping_cost,

    -- ------------------------------------------------------------------
    -- inventory / counts / ratings
    -- ------------------------------------------------------------------
    v.inventory,
    v.purchase_count,
    v.average_rating,
    v.rating_count,
    case
        when v.average_rating is null then 'UNKNOWN'
        when v.average_rating >= 4.0 then 'HIGH'
        when v.average_rating >= 3.0 then 'MEDIUM'
        else 'LOW'
    end as rating_category,

    -- ------------------------------------------------------------------
    -- shipping
    -- ------------------------------------------------------------------
    v.min_shipping_time,
    v.max_shipping_time,

    -- ------------------------------------------------------------------
    -- product attributes (sparse / unstructured)
    -- ------------------------------------------------------------------
    v.color,
    v.size,
    v.options,
    v.attribute_name_to_value,
    v.merchant_warehouse_inventories,
    v.wish_express_countries,
    v.force_reactivate_reasons,
    v.sequence_id

from {{ source('wish', 'master_product_variations') }} as v
