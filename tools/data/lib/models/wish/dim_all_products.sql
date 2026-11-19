{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.dim_all_products.
  Grain: one row per product (`_id` is the logical primary key).
  This is a wide analytics-facing product dimension consolidating
  product metadata, moderation/compliance, true-tag, brand-trust,
  quality flags, and selected commerce state. Resolves to a daily
  snapshot view backed by `sweeper_dev.master_products_YYYYMMDD` in
  the captured DDL. Refreshed daily by `IncrementalProduct_Tahoe` /
  `IncrementalContestsDelta`. Many boolean-like flags are stored as
  varchar (`'true'`, `'false'`, null); human-readable `_name`
  companions are added where closed enums exist.
#}

select
    p._id,

    p.merchant_id,
    p.user_creator,
    p.parent_product_id,

    p.name,
    p.brand,
    p.tags,
    p.labels,
    p.product_description,
    p.purchase_url,
    p.product_identifier,
    p.product_identifier_type,

    p.state,
    case p.state
        when '0' then 'NEW'
        when '1' then 'ACTIVE'
        when '2' then 'EXPIRED'
        when '3' then 'DELETED'
        when '4' then 'PROCESSING'
        else p.state
    end as state_name,

    p.gender,
    p.true_tag_gender,
    case p.true_tag_gender
        when 1 then 'UNKNOWN'
        when 2 then 'MALE'
        when 3 then 'FEMALE'
        else cast(p.true_tag_gender as string)
    end as true_tag_gender_name,

    p.fp_review_status,
    case p.fp_review_status
        when 1 then 'UNDER_REVIEW'
        when 2 then 'APPROVED'
        when 3 then 'BLOCKED'
        else cast(p.fp_review_status as string)
    end as fp_review_status_name,

    p.true_brand_trust_level,
    case p.true_brand_trust_level
        when 1 then 'LOW'
        when 2 then 'MEDIUM'
        when 3 then 'HIGH'
        else cast(p.true_brand_trust_level as string)
    end as true_brand_trust_level_name,

    p.warning_type,
    case p.warning_type
        when 1 then 'CHEMICAL'
        when 2 then 'FOOD'
        when 3 then 'FURNITURE'
        when 4 then 'ON_PRODUCT_CANCER'
        when 5 then 'ON_PRODUCT_COMBINED_CANCER_REPRODUCTIVE'
        when 6 then 'ON_PRODUCT_REPRODUCTIVE'
        when 7 then 'RAW_WOOD'
        when 8 then 'DEP_PASSENGER_OFF_ROAD_VEHICLE'
        when 9 then 'DEP_RECREATIONAL_VESSEL'
        when 10 then 'DIESEL_ENGINE'
        else cast(p.warning_type as string)
    end as warning_type_name,

    p.source_country,
    p.subcategory_id,
    p.subcategory_tree_id,
    p.subcategory_tree_version,

    p.num_extra_photos,
    p.purchase_count,
    p.entered_users_count_unique,
    p.inventory,
    p.average_rating,
    p.rating_count,
    p.newa_cls,
    p.value,

    p.has_commerce_product,
    p.commerce_active,
    p.has_true_tag,
    p.can_promo,
    p.is_c2c,
    p.product_removed_by_merchant,
    p.use_temp_image,
    p.is_clean,
    p.is_ltl,
    p.is_csp_enabled,
    p.is_helios_product,
    p.is_consignment_eligible,
    p.consignment_original_pid,
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
    p.tro_is_predicted,
    p.tro_violated_brand,
    p.counterfeit_brand_id,
    p.is_safe_for_android,
    p.is_safe_for_cannabis_check,
    p.is_safe_for_censored_words_check,
    p.is_verified,
    p.is_verified_2,
    p.is_verified_3,
    p.category_experience_eligibility,
    p.upc,
    p.parent_sku,
    p.image_hash,
    p.image_phash,
    p.main_image_nudity_pred,
    p.nudity_pred_from_images,
    p.nudity_pred_from_text,
    p.nudity_has_unreviewed_images,

    p.true_brand_id,
    cast(p.true_brand_last_tagged as bigint) as true_brand_last_tagged,
    cast(from_unixtime(p.true_brand_last_tagged) as timestamp) as true_brand_last_tagged_ts,

    cast(p.time as bigint) as time,
    cast(from_unixtime(p.time) as timestamp) as creation_ts,

    cast(p.start_date as bigint) as start_date,
    cast(from_unixtime(p.start_date) as date) as product_creation_date,

    cast(p.dt as date) as dt
from {{ source('wish', 'dim_all_products') }} as p
