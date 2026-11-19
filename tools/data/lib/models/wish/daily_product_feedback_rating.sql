{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.daily_product_feedback_rating.
  The Airflow / Spark ETL that produces the source table is NOT reimplemented
  here; this is a column-level projection only.

  Source: `wish.daily_product_feedback_rating`, written by Airflow DAG
  `DailyFeedbackRating` (task `ProductRatingInsertTask`, schedule `0 2 * * *`).
  The DAG reads UTC hourly partitions from `sweeper.product_feedback_rating`
  and re-partitions them into ONE PACIFIC BUSINESS DAY (`dt`).
  The DAG insert SELECT is the authority for the column list below.

  Grain: ONE ROW PER LOGGED PRODUCT-RATING EVENT.
  The rating API logs one record every time a `ProductRating` document is
  created or edited, so the same rating identity can appear many times over
  time (edits, `mark_as_fake`). MongoDB logical uniqueness is
  `(transaction_id, product_id)`; this table keeps the full event history.
  Two surrogate keys are derived below:
    * `rating_event_id`  - one row per logged event (primary entity).
    * `rating_identity`  - the MongoDB logical key `(transaction_id,
      product_id)`, i.e. one row per distinct review.

  Partitioning: `dt` (varchar 'YYYY-MM-DD', PACIFIC business date) is the only
  physical partition of this table. `dt` is the default metric time.
  `dt_utc` / `hr_utc` are the UTC lineage keys copied from the upstream
  sweeper partitions - they are audit columns, not business dates.

  `time` unit - epoch SECONDS (the generated table doc says milliseconds; that
  is wrong for this table). Evidence:
    * the loading DAG derives `dt` with
      `default.time_format(time, 'yyyy-MM-dd', 'America/Los_Angeles')`, and
      Spark's `time_format` takes epoch SECONDS - a millisecond value would
      produce garbage dates for `dt`;
    * the production consumer of THIS table,
      documentation/repos/data-pipelines/src/dags/org_data-science/supply_data/
      daily_product_rating/daily_product_rating.py, compares `a.time` against
      the epoch-second constant 1549925811 (2019-02-12) and against
      `int(end_date.timestamp())`;
    * the sibling wrapper semantic_layer/models/hive/sweeper/
      product_feedback_rating.sql, over the same upstream column, uses
      epoch seconds as well.
  The raw `time` column is kept unchanged for joins and MAX_BY-style ordering.

  Columns intentionally NOT present (they exist on `sweeper.product_feedback_rating`
  only, not on this table): unknown, invalid, title, is_product_recommended_by_user,
  is_sponsored, msite_order_rating_v2_collection_flow_bucket,
  msite_order_rating_v3_collection_flow_bucket, and the sweeper `hr` partition
  (replaced by `hr_utc`).
#}

select
    -- ---------- surrogate keys ----------
    concat_ws(
        '|',
        coalesce(pfr._id, ''),
        cast(coalesce(pfr.time, -1) as varchar),
        coalesce(pfr.dt, '')
    )                                                   as rating_event_id,
    concat_ws(
        '|',
        coalesce(pfr.transaction_id, ''),
        coalesce(pfr.product_id, '')
    )                                                   as rating_identity,

    -- ---------- event clock ----------
    cast(pfr.time as bigint)                            as time,
    cast(from_unixtime(pfr.time) as timestamp)          as event_ts,
    cast(from_unixtime(pfr.time) as date)               as event_day,

    -- ---------- identities ----------
    cast(pfr._id as varchar)                            as _id,
    cast(pfr.product_id as varchar)                     as product_id,
    cast(pfr.variation_id as varchar)                   as variation_id,
    cast(pfr.transaction_id as varchar)                 as transaction_id,
    cast(pfr.user_id as varchar)                        as user_id,
    cast(pfr.merchant_id as varchar)                    as merchant_id,

    -- ---------- rating content ----------
    try_cast(pfr.rating as integer)                     as rating,
    case try_cast(pfr.rating as integer)
        when 1 then '1 star'
        when 2 then '2 stars'
        when 3 then '3 stars'
        when 4 then '4 stars'
        when 5 then '5 stars'
        else 'Unknown'
    end                                                 as rating_name,
    cast(pfr.comment as varchar)                        as comment,
    cast(pfr.user_locale as varchar)                    as user_locale,

    -- ---------- commerce client channel ----------
    cast(pfr.client as bigint)                          as client,
    case pfr.client
        when 0 then 'WEB'
        when 1 then 'IOS_APP'
        when 2 then 'IPAD_APP'
        when 3 then 'ANDROID_APP'
        when 4 then 'MOBILE_WEB'
        when 5 then 'WINDOWS_APP'
        when 6 then 'WINDOWS_PHONE_APP'
        when 7 then 'ANDROID_INSTANT_APP'
        else cast(pfr.client as varchar)
    end                                                 as client_name,

    -- ---------- flags logged as serialized boolean strings ----------
    cast(pfr.edit as varchar)                           as edit,
    case lower(cast(pfr.edit as varchar))
        when 'true' then 'True'
        when 'false' then 'False'
        else 'Unknown'
    end                                                 as edit_name,

    cast(pfr.from_native_prompt as varchar)             as from_native_prompt,
    case lower(cast(pfr.from_native_prompt as varchar))
        when 'true' then 'True'
        when 'false' then 'False'
        else 'Unknown'
    end                                                 as from_native_prompt_name,

    cast(pfr.left_comment as varchar)                   as left_comment,
    case lower(cast(pfr.left_comment as varchar))
        when 'true' then 'True'
        when 'false' then 'False'
        else 'Unknown'
    end                                                 as left_comment_name,

    cast(pfr.likely_fake as varchar)                    as likely_fake,
    case lower(cast(pfr.likely_fake as varchar))
        when 'true' then 'Likely fake'
        when 'false' then 'Not likely fake'
        else 'Unknown'
    end                                                 as likely_fake_name,

    -- ---------- hive partition (Pacific business date) ----------
    cast(pfr.dt as date)                                as dt,

    -- ---------- upstream (UTC) lineage keys ----------
    cast(pfr.dt_utc as date)                            as dt_utc,
    cast(pfr.hr_utc as integer)                         as hr_utc

from {{ source('wish', 'daily_product_feedback_rating') }} as pfr
