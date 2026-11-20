{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.master_products.
  Grain: one row per product (`product_id` is the logical primary key),
  inside a `dt` daily-snapshot partition. This is the raw-ish product
  catalogue view dumped from MongoDB (`sweeper.commerceproduct` and
  friends) by Airflow DAG `incremental_product_tahoe_p1`; the ETL is NOT
  re-implemented here — this model only reshapes the physical view for
  MetricFlow.

  Conventions applied on top of the physical table:
  - `dt` (varchar YYYY-MM-DD) is cast to `date` so it can act as the
    MetricFlow time dimension for the Hive partition.
  - `time` / `start_date` / `true_brand_last_tagged` are Unix epoch
    seconds (same Mongo ObjectId generation-time source as the sibling
    `wish.dim_all_products` model). The raw integers are kept for joins
    and timestamp companions are added for display only — the project
    time spine is `day`, so they are NOT registered as MetricFlow time
    dimensions.
  - Closed enums keep the raw code and gain a human-readable `*_name`
    companion: `state`, `gender`, `true_tag_gender`, `fp_review_status`.
  - Boolean-like flags are varchar ('true' / 'false' / null) upstream and
    are passed through unchanged, so they stay usable as filters.
#}

select
    -- ------------------------------------------------------------------
    -- Keys / identifiers
    -- ------------------------------------------------------------------
    p.product_id,
    p.merchant_id,
    p.user_creator,
    p.parent_product_id,
    p.parent_sku,
    p.product_identifier,
    p.product_identifier_type,
    p.upc,

    -- ------------------------------------------------------------------
    -- Catalogue text
    -- ------------------------------------------------------------------
    p.name,
    p.brand,
    p.tags,
    p.labels,
    p.product_description,
    p.purchase_url,
    p.value,
    p.chemical_names,
    p.category_experience_eligibility,
    p.source_country,
    p.attribute_name_to_value,
    p.ordered_images,
    p.image_hash,
    p.image_phash,
    p.main_image_nudity_pred,
    p.nudity_pred_from_images,
    p.nudity_has_unreviewed_images,
    p.nudity_pred_from_text,
    p.active_extra_photos,
    p.deleted_extra_photos,
    p.entered_users_count_unique,
    p.expiry_date,

    -- ------------------------------------------------------------------
    -- True tags / brands
    -- ------------------------------------------------------------------
    p.true_tag_ids,
    p.true_tag_color_ids,
    p.auth_brand_ids,
    p.true_brand_id,
    p.tro_is_predicted,
    p.tro_violated_brand,
    p.counterfeit_brand_id,

    -- ------------------------------------------------------------------
    -- Moderation / compliance
    -- ------------------------------------------------------------------
    p.inappropriate_reasons,
    p.inappropriate_reason,
    p.inappropriate_subcategory,
    p.counterfeit_reason,
    p.counterfeit_subcategory,
    p.blocked_countries,
    p.warehouse_exclusion_countries,
    p.consignment_original_pid,

    -- ------------------------------------------------------------------
    -- Categorisation
    -- ------------------------------------------------------------------
    p.subcategory_id,
    p.subcategory_tree_id,
    p.subcategory_tree_version,
    p.newa_cls,

    -- ------------------------------------------------------------------
    -- Enums (raw code + human-readable companion)
    -- ------------------------------------------------------------------
    p.state,
    case p.state
        when '0' then 'ACTIVE'
        when '1' then 'WISH_INACTIVE'
        when '2' then 'MERCHANT_INACTIVE'
        when '3' then 'REMOVED_BY_WISH'
        when '4' then 'REMOVED_BY_MERCHANT'
        else p.state
    end as state_name,

    p.gender,
    case p.gender
        when '0' then 'UNKNOWN'
        when '1' then 'MALE'
        when '2' then 'FEMALE'
        else p.gender
    end as gender_name,

    p.true_tag_gender,
    case p.true_tag_gender
        when 0 then 'UNKNOWN'
        when 1 then 'MALE'
        when 2 then 'FEMALE'
        when 3 then 'NEUTRAL'
        else cast(p.true_tag_gender as string)
    end as true_tag_gender_name,

    p.fp_review_status,
    case p.fp_review_status
        when 1 then 'UNDER_REVIEW'
        when 2 then 'APPROVED'
        when 3 then 'BLOCKED'
        else cast(p.fp_review_status as string)
    end as fp_review_status_name,

    -- ------------------------------------------------------------------
    -- Numeric attributes
    -- ------------------------------------------------------------------
    p.num_extra_photos,
    p.purchase_count,
    p.has_commerce_product,
    p.commerce_active,
    p.inventory,
    p.average_rating,
    p.rating_count,
    p.true_brand_trust_level,
    p.warning_type,

    -- ------------------------------------------------------------------
    -- Boolean-like flags (varchar 'true' / 'false' / null upstream)
    -- ------------------------------------------------------------------
    p.is_c2c,
    p.product_removed_by_merchant,
    p.use_temp_image,
    p.is_clean,
    p.has_true_tag,
    p.can_promo,
    p.is_verified,
    p.is_verified_2,
    p.is_verified_3,
    p.is_from_top_rated_store,
    p.is_top_seller,
    p.is_trending_product,
    p.gender_is_predicted,
    p.true_tags_are_predicted,
    p.is_adult,
    p.is_counterfeit,
    p.is_adult_for_mobile,
    p.is_sex_doll,
    p.is_cannabis,
    p.is_censored,
    p.is_deleted,
    p.contains_luxury_brand,
    p.contains_censored_word,
    p.is_safe_for_android,
    p.is_safe_for_cannabis_check,
    p.is_safe_for_censored_words_check,
    p.is_ltl,
    p.is_csp_enabled,
    p.is_helios_product,
    p.is_consignment_eligible,

    -- ------------------------------------------------------------------
    -- Time
    -- ------------------------------------------------------------------
    cast(p.time as bigint) as time,
    cast(from_unixtime(p.time) as timestamp) as creation_ts,

    cast(p.start_date as bigint) as start_date,
    cast(from_unixtime(p.start_date) as date) as product_creation_date,

    cast(p.true_brand_last_tagged as bigint) as true_brand_last_tagged,
    cast(from_unixtime(p.true_brand_last_tagged) as timestamp) as true_brand_last_tagged_ts,

    cast(p.dt as date) as dt

from {{ source('wish', 'master_products') }} as p
