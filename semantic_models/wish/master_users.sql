{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.master_users.

  Physical grain: ONE ROW PER USER (`user_id`). The underlying object is a
  Hive *view* (`CREATE OR REPLACE VIEW wish.master_users PARTITIONED ON
  (dt) AS SELECT * FROM sweeper_dev.master_users_<snapshot_date>`) that the
  `IncrementalUser_Tahoe` Airflow DAG repoints at a fresh full snapshot every
  night. The snapshot itself is built as
  `(previous snapshot LEFT ANTI JOIN today's changed users) UNION ALL (today's
  changed users)`, so it always holds every user exactly once with the
  freshest available profile. No Airflow / Spark ETL is reimplemented here and
  the grain is not changed.

  `dt` IS THE USER'S REGISTRATION DATE, NOT THE SNAPSHOT DATE.
  The producer writes `dt = datetime.fromtimestamp(int(str(user.id)[:8],
  16)).strftime("%Y-%m-%d")`, i.e. it is derived from the Mongo ObjectId
  prefix, so it is immutable for a given user. `dt` is nevertheless the
  physical Hive partition of the view, so `dt` is simultaneously
    (a) the partition column used for partition pruning, and
    (b) the registration-day cohort of each user.
  Practical consequence: `GROUP BY dt` on this table is a *registration
  cohort* breakdown, not a daily-snapshot breakdown. A "users per day" cut is
  a new-user cut, and the total row count of the table is the total user base
  (every user, forever), not "users as of the last run". There is no column
  that identifies the snapshot date.

  Time columns:
    * `dt` (varchar YYYY-MM-DD) is the partition and the default metric time
      dimension. It is cast to DATE here.
    * `time` and `registration_time` are the identical unix-epoch-second
      registration timestamp (both are `int(str(user.id)[:8], 16)`). The raw
      integers are kept for joins; `registration_ts` / `registration_date`
      are derived from them.
    * `last_active_day` is a *string* holding unix epoch seconds of the
      user's last active day (PACTZ-adjusted by the producer). It is null for
      users who have never been active. `last_active_ts` /
      `last_active_date` are derived from it.
    * `birthdate` is a calculated varchar YYYY-MM-DD (born_year + birthday)
      and is cast to DATE. It is a static user attribute, not an event time.
  The project time spine is day, so only the date columns are registered as
  MetricFlow time dimensions; the `*_ts` timestamps are kept for joins and
  are not time dimensions.

  Enums keep their raw integer code and gain a human-readable `*_name`
  column built from the documented code list. `app_name` already exists in
  the source (the producer maps it from `app_type` via `UserAppType`), so it
  is passed through unchanged rather than recomputed.

  Flags are varchar 'true' / 'false' strings. The raw column is kept as a
  categorical dimension and a boolean `*_flag` column is added next to it,
  matching the house convention, so filters can be written as
  `{{ Dimension('user__likely_bot_flag') }} = true`.

  No dimension tables are joined here. Joins belong in Tableau models under
  semantic_layer/models/tableau/ that ref() this wrapper.
#}

select
    -- ------------------------------------------------------------------
    -- keys / entities
    -- ------------------------------------------------------------------
    u.user_id,
    u.visitor_id,

    -- ------------------------------------------------------------------
    -- time
    --
    -- `dt` is the Hive partition and the user's registration date (the
    -- producer derives it from the Mongo ObjectId prefix, NOT from the
    -- pipeline run date). `registration_date` is the UTC calendar day of the
    -- same instant; the two can differ by a day for users registered close
    -- to midnight because `dt` is computed in the producer's local time.
    -- ------------------------------------------------------------------
    cast(u.dt as date) as dt,
    u.registration_time,
    u.time,
    cast(from_unixtime(u.registration_time) as timestamp) as registration_ts,
    cast(from_unixtime(u.registration_time) as date) as registration_date,
    u.last_active_day,
    cast(from_unixtime(cast(u.last_active_day as bigint)) as timestamp) as last_active_ts,
    cast(from_unixtime(cast(u.last_active_day as bigint)) as date) as last_active_date,
    cast(u.birthdate as date) as birthdate,

    -- ------------------------------------------------------------------
    -- demographics
    -- ------------------------------------------------------------------
    u.born_year,
    u.birthday,
    u.gender,
    case u.gender
        when 0 then 'Unknown'
        when 1 then 'Male'
        when 2 then 'Female'
        when 3 then 'Neutral'
        else null
    end as gender_name,
    u.age_range,
    case u.age_range
        when 1 then '13-17'
        when 2 then '18-24'
        when 3 then '25-29'
        when 4 then '30-34'
        when 5 then '35-39'
        when 6 then '40-44'
        when 7 then '45-49'
        when 8 then '50-54'
        when 9 then '55-64'
        when 10 then '65+'
        else null
    end as age_range_name,
    u.education_level,
    case u.education_level
        when 0 then 'Unknown'
        when 1 then 'Junior High School'
        when 2 then 'High School'
        when 3 then 'College'
        when 4 then 'Graduate School'
        else null
    end as education_level_name,
    u.relationship_status,
    case u.relationship_status
        when 0 then 'Unknown'
        when 1 then 'Single'
        when 2 then 'In a relationship'
        when 3 then 'Engaged'
        when 4 then 'Married'
        when 5 then 'It''s complicated'
        when 6 then 'In an open relationship'
        when 7 then 'Widowed'
        when 8 then 'Separated'
        when 9 then 'Divorced'
        when 10 then 'In a civil union'
        when 11 then 'In a domestic partnership'
        else null
    end as relationship_status_name,
    u.country_code,
    u.locale,
    u.location_name,

    -- ------------------------------------------------------------------
    -- app
    -- ------------------------------------------------------------------
    u.app_type,
    u.app_name,

    -- ------------------------------------------------------------------
    -- signup
    -- ------------------------------------------------------------------
    u.signup_method,
    case u.signup_method
        when 1 then 'Facebook'
        when 2 then 'Email'
        when 3 then 'Google Plus'
        when 4 then 'Apple'
        when 5 then 'Phone Number'
        else null
    end as signup_method_name,

    -- ------------------------------------------------------------------
    -- account status
    -- ------------------------------------------------------------------
    u.user_status,
    case u.user_status
        when 1 then 'Unprocessed'
        when 3 then 'Registered'
        when 6 then 'Deleted'
        else null
    end as user_status_name,

    -- ------------------------------------------------------------------
    -- flags ('true' / 'false' string booleans in the source)
    --
    -- The raw varchar column is kept as a categorical dimension and a
    -- boolean `*_flag` column is added for filtering. Null / non-'true'
    -- source values map to false, so "exclude" filters keep the rows whose
    -- flag was never set.
    -- ------------------------------------------------------------------
    u.is_wish_star,
    case
        when lower(u.is_wish_star) = 'true' then true
        else false
    end as is_wish_star_flag,
    u.likely_bot,
    case
        when lower(u.likely_bot) = 'true' then true
        else false
    end as likely_bot_flag,
    u.is_temporary,
    case
        when lower(u.is_temporary) = 'true' then true
        else false
    end as is_temporary_flag,
    u.is_verified,
    case
        when lower(u.is_verified) = 'true' then true
        else false
    end as is_verified_flag,
    u.is_guest_user,
    case
        when lower(u.is_guest_user) = 'true' then true
        else false
    end as is_guest_user_flag,

    -- ------------------------------------------------------------------
    -- PII / identity attributes
    -- ------------------------------------------------------------------
    u.full_name,
    u.email,
    u.profile_pic,
    u.fb_uid,
    u.google_plus_uid
from {{ source('wish', 'master_users') }} as u
