{{ config(
    materialized='view'
) }}

{#
  Thin Semantic Layer wrapper over wish.erp_daily_dump.

  Grain: one row per deduplicated per-day combination of
  (dt, merchant_id, partner_id, tid, response_status, uri, code). The producer
  (DailyERPDumpTahoe DAG) reads sweeper.merchant_requests for the Airflow
  execution day, keeps only rows with a non-null _partner_id (ERP partner
  OAuth apps only) and de-duplicates with GROUP BY. Rows are therefore NOT
  one row per API request - identical repeated calls inside a day collapse
  into a single row.

  Time semantics: `dt` is the Hive partition key (YYYY-MM-DD, UTC) and is the
  only business day of the table. `stat_date` and `time` are unix epoch
  seconds of the batch start and are identical to each other and to the dt
  day - they are kept here as raw integers for epoch-window filters and
  joins, but are deliberately not registered as MetricFlow time dimensions.
  The per-request clock time is NOT on this table; query
  sweeper.merchant_requests for sub-day analysis.

  Enum labels (`partner_name`, `tid_name`, `response_status_name`,
  `code_name`) are CASE mappings of the documented catalogs
  (PARTNER_NAME_MAP / MerchEvent / HTTP status / Errors). The raw code
  columns are kept alongside them and stay the join/dimension keys. For
  authoritative partner display names prefer the
  analytics.erp_client_id_mapping_dump lookup in a Tableau model - joins
  live there, not in this Hive wrapper.
#}

select
    -- Surrogate primary key for the deduplicated natural grain of the producer.
    concat_ws(
        '|',
        d.dt,
        d.merchant_id,
        d.partner_id,
        d.tid,
        d.response_status,
        d.uri,
        d.code
    ) as erp_activity_id,

    -- Entities.
    d.merchant_id,
    d.partner_id,

    -- ERP partner display label (PARTNER_NAME_MAP catalog, 158 partner ids).
    case d.partner_id
        when '5789547490fdc64386881028' then 'Wish'
        when '5374368b9d5e3e4325b3e97f' then 'CK1'
        when '537436729d5e3e4325b3e97e' then 'Magic Cloud'
        when '53bb6791e8375d094ad7c28e' then 'Shopseen'
        when '545819d56fa88c764087766e' then 'MangoErp'
        when '546688966fa88c6ecdff03b9' then 'Huafada'
        when '5474f6f26fa88c7d9aef3483' then 'DevilMay'
        when '5487ac976fa88c4d3a2fb3d8' then 'puyuan'
        when '54ac87f2e8375d625053a38e' then 'DianXiaoMi'
        when '55388cb26fa88c37580804ff' then 'Sumy'
        when '55711c1ae8375d5c88df644e' then 'GoDataFeed'
        when '55809265e8375d627e844e97' then 'MaBang'
        when '558b6f2fe8375d17d59a42b3' then 'ChannelAdvisor'
        when '5581fd3be8375d44e1f41b0e' then 'CreditEase'
        when '5595de7be8375d08b2db8ccd' then 'Tongtool'
        when '55e00428e8375d29ee87d716' then 'LanrenERP'
        when '55e008e8e8375d385be13876' then 'iBay'
        when '55e00c1ee8375d4050b2a4a0' then 'ECCP'
        when '55f901abe8375d15ccde6fce' then 'SellerTool'
        when '55f903a7e8375d17b5594566' then 'AKERP'
        when '55f909b5e8375d195ff95437' then 'YunCang'
        when '55f91118e8375d1e34b280e3' then 'HuiSimpleTrade'
        when '56036965e8375d716f092e2f' then 'Little Boss'
        when '56039c1ce8375d7dddc82851' then 'Wang Xiao Wang'
        when '5628557b6fa88c46259b534c' then 'iRobotBox'
        when '56285752e8375d552ed343ee' then 'Branch8'
        when '5658ec14e8375d3c42dca34d' then 'ActNeed'
        when '56997268e8375d38c306859a' then 'Kuajg'
        when '569964ace8375d36a8b64af0' then 'Tongtool 2'
        when '56834f6f6fa88c0aa7edc5d1' then 'SoldEasy'
        when '56c6985ae8375d10022e6189' then 'QuantiumSolutions'
        when '572c3ed06fa88c31bedc9f4f' then 'RayCloud'
        when '57316d416fa88c159da99f41' then 'SimplyPost'
        when '5750d52ce8375d60b0b7480f' then 'PingPong'
        when '57563a32e8375d3402679dd7' then 'Web2Ship'
        when '5761e9d56fa88c690b900480' then 'GuangzhouEms'
        when '5761ee4e6fa88c70602d0be0' then '17Track'
        when '576c94cee8375d3f659780e4' then 'TceSoho'
        when '576dd832e8375d23b2fdbf78' then 'JuanPi'
        when '577c5d34e8375d70cc7ce58e' then 'Dianrong'
        when '5783ed14e8375d22138cb199' then 'DataCaciques'
        when '579be7dae8375d3075e94c30' then 'Selling Express'
        when '57b61c3ce8375d6798bb44bb' then 'YiCang'
        when '58ee6d0ebaba045f5d6824f5' then 'CommerceHub'
        when '57c5d71e6fa88c4187310146' then 'UMPayLoan'
        when '57fee82a6fa88c7ed01a0339' then 'Huodou'
        when '57bb7a40e8375d5abd8b5ef4' then 'Grandali'
        when '582a477c6fa88c11289ecbcf' then 'WMS User'
        when '583e87ff6fa88c4ef856798a' then 'SUTU ERP User'
        when '5864225a6fa88c2c109cb762' then 'AQdata'
        when '58a4fc2a38be004fc3855ea9' then 'Ningbo Joint International'
        when '5877f5826fa88c579c05ac40' then 'Alex Lai'
        when '58a373b7c105706e4f03795a' then 'the SCM Zhuhai Furun Technology'
        when '58a37172c105706e4f03790f' then 'Extreefz'
        when '58ad198108de0c6dc59d9314' then 'Taojingtong ERP'
        when '580a9e6f6fa88c1938eb6514' then 'Shenzhen Post'
        when '58d98de9d687a652b88ee69c' then 'Sangeltc'
        when '587d87636fa88c7e85826910' then 'Escm 4Pnt'
        when '58f64b668b407b6a6a4a94b5' then 'Zying Tech'
        when '58b86be212f60b590b3c8e74' then 'FairCloud Technology (HK) Limited'
        when '5a67fd666839ea3ec7532300' then 'wishchain'
        when '5a687144db0e426f28fba31a' then 'yongyingruanjian'
        when '5a73eb69a6f62e33a5b1ac49' then 'pinwocowish'
        when '5a5d8faf8cf0ed2d180e0b17' then 'flyfishs'
        when '5a534d997f9ae56843298ac8' then 'trackingyee'
        when '5a2645b3dd032914449077a4' then 'salesglobal'
        when '5a2e3821dc7a910d42fc1c64' then 'csrj_2014'
        when '5a2b94eefd9db84e6bd941b4' then 'alitoolkit'
        when '5a011f8e0f193f19596bae13' then 'hupun'
        when '59f20cda0f193f26e10622ff' then 'godatafeed_development'
        when '59eee68a518c1c115ec9b306' then 'sbosman'
        when '59eee8818cf0ed5920c16fbf' then 'hydee'
        when '59ca0d31ae228e045a116c91' then 'wish_api'
        when '5a17e79a6ea4a72ac00c26e6' then 'elinasummer'
        when '5a7a9c84c1d51829ea9dca38' then 'yimaichengpin'
        when '58c04745a66b9a5077baf3a8' then 'hlntechgz'
        when '58bdfe18a3f95946fc38b0b5' then 'jscsoftware'
        when '5a6941ac6f60235f5d932237' then 'mabangtwo'
        when '5a280ddb67e9be6cc8fbf299' then 'effectconnect'
        when '5a4c11ae95646e2a4f702b97' then 'sellerbooster'
        when '5a1d1e59c2d15e0337d3fd92' then 'channelengine_com_prod'
        when '5a2a3657028bbd66681c63cb' then 'newsalesglobal'
        when '5a1c2e7d9fbc51174a879764' then 'johnnyk'
        when '59aa1d5b69eced4c11ac18b2' then 'pingz'
        when '599676c5238270124c6b49fd' then 'zyuse'
        when '599469bb35e73b07c4e940cb' then 'circle_publicapp'
        when '5a446ca895ebed35dc54aef2' then 'esells'
        when '5ab077ea6be87315c60c521b' then 'unrobot'
        when '59af7ebab771736d4ec721fc' then 'gzfurui'
        when '596fa2147fe2412ae1b87b60' then 'eccang_publicapp'
        when '57be13de6fa88c0a438da007' then 'commercehub'
        when '59f927839fbc516e0bdebe1c' then 'sellercube'
        when '5a96ddcbddf45b3d5ea9a363' then 'lengow44'
        when '5a9cff551b98df1b107eb896' then '15839289962'
        when '5a9f490e75599a084b700c85' then 'askingdata'
        when '5a9511291843543a624ab808' then 'hqsaascom'
        when '5ab876afb9605f7c8bda2839' then 'hqsaascom1'
        when '59542e0f905fdb4f39901ad9' then '360zebra_publicapp'
        when '599e9861f628f506f3218456' then 'valsun'
        when '596fa32582a85428ab6eba5e' then 'cnfth_publicapp'
        when '5806cd7c6fa88c1d60822988' then 'shenzhenems'
        when '592f07946a74d2557398cdf8' then 'panjianghao'
        when '592f08269818b32982b6db8f' then 'jeffreyliu'
        when '59406ba8ff3e80125b6e6779' then 'platformqa'
        when '592725970e7bed2f5710bf9c' then 'topidealscm'
        when '595ea738c2508105a3994b96' then 'suntunk_publicapp'
        when '591376f04cb67602bbbbb4f8' then 'jiarunxingmao'
        when '598370c960b5b2134f4643e6' then 'selro_publicapp'
        when '598213d4439a9866cc20811d' then 'julinker_publicapp'
        when '590a2ae2864e5c333fa6f340' then 'nrongruixin'
        when '58ee84a61211f544f1ce1cb7' then 'starfactoryerp'
        when '596fa4164b913a7380ed2ebc' then 'mabangerp_publicapp'
        when '59700169439a987087ec39f8' then 'etailsolutions_publicapp'
        when '5a9db93b18d9212b666189be' then 'zentailapp'
        when '596536b6e209f77764a9b8d2' then 'topideals_publicapp'
        when '59c5a06890a0f137384b48e8' then 'tshirtgang'
        when '59ea06649fbc515b97ea5390' then 'sophy14_'
        when '59df0dd688dd76352e03c71c' then 'jongtongi'
        when '59ccd5deae228e424998ec7e' then 'aosomllc'
        when '59f287205d6f342c964e627e' then 'fuiou_xugw'
        when '59e028b69aee091fc9ae2316' then 'wishpost_internal_stage'
        when '59b35f7250df613cef3fa54b' then 'hxmis_wishapi'
        when '59b012fef628f57abb54a694' then 'marcossoftware'
        when '59a9687b69eced1ca7e0b107' then 'optiseller_wish_store'
        when '59ba4c71b77173513b8cee35' then 'ipaylinks'
        when '594d52e2d85e697b516e54a1' then 'hefeifancyqube'
        when '59c1fe39776ab949ac07fcb8' then 'wishpost_internal'
        when '599b06658ee78d7ebdc3fa12' then 'rbooth'
        when '5aa6f6f0b125ab55ce76f155' then 'edock_developer'
        when '583e867d6fa88c4ef8567989' then 'sellercloud'
        when '599b88e6eea5c56338af9ed4' then 'djmj'
        when '5825625d6fa88c1ecb1aa68b' then 'differsoft_user'
        when '58ed66058a46c15fa328b494' then 'beehiveinc'
        when '58ebd1264d8e970fa4f54fa7' then 'teaplixinc'
        when '5a14dc75448a521016f326cc' then 'jya_erp'
        when '5a15d4c85d6f34070a974f5e' then 'shiprush'
        when '5a1d180a7b584e4e466194ac' then 'csrj2014'
        when '5a1405afdd032907b6c0f7a3' then 'vipwang'
        when '5a0bdac215da07290354f0a9' then 'heysky_crm'
        when '59d52a6688dd76710f3d60e5' then 'selloio'
        when '59c89b958ee78d54e0d2106c' then 'billbee_wish'
        when '58dac0d76c7bee5375fefe9d' then 'sellercloudnj'
        when '59e0296ee650330dd9a58945' then 'wishpost_internal_testing'
        when '5944573b7fe2415bc249b7c0' then 'godatapublicapp'
        when '5aaa05c942159553de6d6f75' then 'william_wan'
        when '596fa0b6e81e8a0e1fcc5762' then 'toonies_publicapp'
        when '58bf1df4edb31f533b771ada' then 'xmwky'
        when '58daa6cf1009f952bfc836d8' then 'sztechco'
        when '5949a56a0c28106347990370' then 'juntuoloan'
        when '5987cefb23827021922e37b7' then 'eloan1'
        when '597162e50688176b0dfd9821' then 'payeco_cas'
        when '59b6c0c56fa88ce4b5fc9d18' then 'pingpong_fpayment'
        when '58c71cbdc5176611e0c5e69b' then 'umpay'
        when '58ee8354e0ac982252244d92' then 'transmarttech'
        when '5b4ee025b5c4c41ca80d5593' then 'plentymarkets'
        when '5af04d9ac96bb82d15ec8599' then 'channable'
        when '5afa973b5ccdca7b83a09750' then 'expandly'
        when '5b3b8b8e3cb63622f27fdd4a' then 'printful'
        else 'Other ERP partner'
    end as partner_name,

    -- Merchant API event id and its MerchEvent label.
    cast(d.tid as varchar) as tid,
    case
        when d.tid = '10000' then 'API_TEST_AUTH'
        when d.tid = '10001' then 'API_PRODUCT_GET_ONE'
        when d.tid = '10002' then 'API_PRODUCT_ADD_ONE'
        when d.tid = '10003' then 'API_PRODUCT_UPDATE_ONE'
        when d.tid = '10004' then 'API_PRODUCT_GET_MULTIPLE'
        when d.tid = '10050' then 'API_VARIANT_GET_ONE'
        when d.tid = '10100' then 'API_ORDER_GET_ONE'
        when d.tid = '10101' then 'API_ORDER_GET_MULTIPLE'
        when d.tid = '10102' then 'API_ORDER_GET_NEED_FULFILL'
        when d.tid = '10103' then 'API_ORDER_FULFILL_ONE'
        when d.tid = '10104' then 'API_ORDER_MODIFY_TRACKING'
        when d.tid = '10105' then 'API_ORDER_REFUND_ONE'
        when d.tid = '10150' then 'API_MERCHANT_GET'
        when d.tid = '18603' then 'API_PRODUCT_BOOST_EXTERNAL_CREATE_CAMPAIGN'
        when try_cast(d.tid as int) between 10005 and 10018
            then 'Product API (enable/disable/shipping/download/SKU)'
        when try_cast(d.tid as int) between 10051 and 10062
            then 'Variant API (get/add/update/inventory/bulk)'
        when try_cast(d.tid as int) between 10106 and 10117
            then 'Order API (download/FBW/FBS/delivery)'
        when try_cast(d.tid as int) between 10151 and 10159
            then 'Merchant API (currency/brand)'
        when try_cast(d.tid as int) between 10200 and 10204
            then 'CK1 API (SKU verified/ready/fulfill)'
        when try_cast(d.tid as int) between 10300 and 10305
            then 'Insurance API (get/reject)'
        when try_cast(d.tid as int) between 10400 and 10408
            then 'Courier / WishPost API (tracking update)'
        when try_cast(d.tid as int) between 10500 and 10505
            then 'External ticket API'
        else 'Other API event'
    end as tid_name,

    -- HTTP response status and its standard label.
    cast(d.response_status as varchar) as response_status,
    case d.response_status
        when '200' then 'OK'
        when '400' then 'Bad Request'
        when '401' then 'Unauthorized'
        when '403' then 'Forbidden'
        when '404' then 'Not Found'
        when '429' then 'Too Many Requests'
        when '500' then 'Internal Server Error'
        when '502' then 'Bad Gateway'
        when '503' then 'Service Unavailable'
        else 'Other HTTP status'
    end as response_status_name,

    -- Application-level result / error code and its Errors label.
    cast(d.code as varchar) as code,
    case
        when d.code = '0' then 'No application error'
        when d.code = '1000' then 'INVALID_PARAM'
        when d.code = '1001' then 'MISSING_PARAM'
        when d.code = '1002' then 'ORDER_PROCESSED'
        when d.code = '1003' then 'TRACKING_REUSED'
        when d.code = '1004' then 'ENTITY_NOT_FOUND'
        when d.code = '1005' then 'CANNOT_REFUND'
        when d.code = '1010' then 'TICKET_CLOSED'
        when d.code = '1014' then 'TRACKING_CONFIRMED'
        when d.code = '1015' then 'ACCESS_TOKEN_EXPIRED'
        when d.code = '1016' then 'ACCESS_TOKEN_REVOKED'
        when d.code = '1017' then 'AUTH_CODE_EXPIRED'
        when d.code = '1018' then 'AUTH_CODE_REDEEMED'
        when d.code = '1056' then 'TOO_MANY_REQUESTS'
        when d.code = '2000' then 'MERCHANT_CANNOT_ACCESS_API'
        when d.code = '2001' then 'RATE_LIMIT_EXCEEDED'
        when d.code = '4000' then 'UNAUTHORIZED'
        when d.code = '4001' then 'PROVIDER_CANNOT_ACCESS_MERCHANT'
        when d.code = '4004' then 'NOT_FOUND'
        when d.code = '4005' then 'METHOD_NOT_ALLOWED'
        when d.code = '5003' then 'OVERLOADED'
        when d.code = '6000' then 'BLOCKED'
        when d.code = '9000' then 'UNKNOWN'
        when try_cast(d.code as int) between 1006 and 1008
            then 'Promoted-product mutation guard'
        when try_cast(d.code as int) between 1011 and 1013
            then 'Image / header validation'
        when try_cast(d.code as int) between 1019 and 1045
            then 'Catalog / shipping / scope guard'
        when try_cast(d.code as int) between 1046 and 1060
            then 'Catalog / campaign price guard'
        when try_cast(d.code as int) between 22100 and 22114
            then 'FBW / FBS external error'
        else 'Other application error'
    end as code_name,

    -- API endpoint path (open vocabulary, not a closed enum).
    cast(d.uri as varchar) as uri,

    -- Reserved producer placeholders, always NULL in the current pipeline.
    cast(d.action as varchar) as action,
    cast(d._c7 as varchar) as _c7,

    -- Partition day: raw partition string plus the date used as the
    -- MetricFlow time dimension.
    d.dt,
    cast(d.dt as date) as activity_dt,

    -- Batch day stamps (unix epoch seconds, UTC). Identical to each other
    -- and to the activity day; kept for epoch-window filters and joins.
    cast(d.stat_date as bigint) as stat_date,
    cast(d.time as bigint) as time

from {{ source('wish', 'erp_daily_dump') }} as d
