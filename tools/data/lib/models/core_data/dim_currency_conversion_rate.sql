{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over core_data.dim_currency_conversion_rate.
  Grain: one row per (conversion_table_id, currency_code) — one FX rate within
  a Mongo CurrencyConversionRate snapshot. Rates are USD → currency_code
  multipliers (local→USD: amount / conversion_rate). dt is Pacific calendar
  day of ObjectId generation; table is not Hive-partitioned but dt is the
  primary date filter. Join facts on conversion_table_id + trimmed currency_code.
#}

select
    concat(fx.conversion_table_id, '|', trim(fx.currency_code)) as currency_conversion_rate_id,

    fx.conversion_table_id,
    fx.rate_type,
    case fx.rate_type
        when 1 then 'SPOT'
        when 2 then 'DAILY'
        when 3 then 'HEDGE'
        when 4 then 'SPOT_MIXED'
        when 5 then 'DAILY_MIXED'
        else cast(fx.rate_type as varchar)
    end as rate_type_name,

    fx.conversion_rate,
    cast(fx.conversion_rate as double) as conversion_rate_numeric,
    1.0 / cast(fx.conversion_rate as double) as ex_rate,

    trim(fx.currency_code) as currency_code,

    cast(fx.dt as date) as dt,

    cast(
        conv(substr(fx.conversion_table_id, 1, 8), 16, 10) as bigint
    ) as conversion_table_created_unix,
    cast(
        from_utc_timestamp(
            from_unixtime(
                cast(conv(substr(fx.conversion_table_id, 1, 8), 16, 10) as bigint)
            ),
            'America/Los_Angeles'
        ) as timestamp
    ) as conversion_table_created_ts
from {{ source('core_data', 'dim_currency_conversion_rate') }} as fx
