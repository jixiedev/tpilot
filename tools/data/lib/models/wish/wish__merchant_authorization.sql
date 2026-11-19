{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.merchant_authorization.
  Grain: one row per active public-app OAuth refresh token authorization
  (merchant_id × partner_user_id). Full snapshot of currently active ERP/partner
  authorizations; revoked grants disappear on the next TD→Hive reload (not an
  SCD history). Non-partitioned Hive table written daily by the
  DailyTDTahoeExport DAG from sweeper.merchant_authorization.

  auth_date is the only business-event time column (OAuth refresh-token
  creation day, UTC). The `time` column is Treasure Data ingest metadata —
  converted here for freshness checks / joins, but deliberately NOT registered
  as a MetricFlow time dimension.
#}

select
    concat(a.merchant_id, '|', a.partner_user_id) as merchant_partner_auth_id,

    a.merchant_id,
    a.partner_user_id,
    a.partner_name,

    a.auth_date,
    cast(a.auth_date as date) as auth_dt,

    try_cast(a.time as bigint) as ingest_time_epoch,
    cast(from_unixtime(try_cast(a.time as bigint)) as timestamp) as ingest_time
from {{ source('wish', 'merchant_authorization') }} as a
