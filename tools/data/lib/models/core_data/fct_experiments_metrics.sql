{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.fct_experiments_metrics.
  Grain: one row per subject_id, experiment_name, assigned_bucket, dt,
  metric_source, and subject (partition keys).
  Source: Airflow experiment stats DAGs (daily and hourly).
#}

select
    concat(
        coalesce(fem.subject_id, ''),
        '|',
        coalesce(fem.experiment_name, ''),
        '|',
        coalesce(fem.assigned_bucket, ''),
        '|',
        coalesce(fem.dt, ''),
        '|',
        coalesce(fem.metric_source, ''),
        '|',
        coalesce(fem.subject, '')
    ) as experiment_subject_metric_id,

    fem.subject_id,
    fem.experiment_name,
    fem.assigned_bucket,
    case fem.assigned_bucket
        when 'control' then 'Control group (baseline)'
        when 'test' then 'Test group (treatment)'
        when 'show' then 'Show variant'
        when 'show-v2' then 'Show variant version 2'
        when 'hide' then 'Hide variant'
        else fem.assigned_bucket
    end as assigned_bucket_name,

    fem.subject,
    case fem.subject
        when 'USER_ID' then 'Registered user'
        when 'MERCHANT_ID' then 'Merchant'
        when 'VISITOR_ID' then 'Anonymous visitor'
        when 'STORE_ID' then 'Store'
        else fem.subject
    end as subject_name,

    fem.relative_exposed_date,
    fem.user_country,
    fem.user_age_bucket,
    fem.user_country_bucket,
    fem.user_age,
    fem.user_gender,
    case fem.user_gender
        when 'M' then 'Male'
        when 'F' then 'Female'
        when 'male' then 'Male'
        when 'female' then 'Female'
        when 'unknown' then 'Unknown'
        else coalesce(fem.user_gender, 'Unknown')
    end as user_gender_name,

    fem.metric_sum_map,
    fem.metric_sum_ltv_map,
    coalesce(fem.metric_sum_map['gmv'], 0.0) as metric_gmv_daily,
    coalesce(fem.metric_sum_ltv_map['gmv'], 0.0) as metric_gmv_ltv,
    coalesce(fem.metric_sum_ltv_map['orders'], 0.0) as metric_orders_ltv,
    coalesce(fem.metric_sum_map['session_duration'], 0.0) as metric_session_duration_daily,

    cast(fem.dt as date) as dt,
    fem.metric_source
from {{ source('core_data', 'fct_experiments_metrics') }} as fem
