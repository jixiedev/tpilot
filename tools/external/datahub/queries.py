"""GraphQL documents used by the DataHub tools (DataHub 1.2.x compatible)."""

from __future__ import annotations

from tools.external.datahub.parsing import DEFAULT_LINEAGE_COUNT, DEFAULT_RELATIONSHIP_COUNT

_LINEAGE_NEIGHBOR_GQL = """
query GetEntityLineage($input: SearchAcrossLineageInput!) {
  searchAcrossLineage(input: $input) {
    start
    count
    total
    searchResults {
      degree
      entity {
        urn
        type
        ... on Dataset {
          name
          properties { name qualifiedName }
          platform { name }
        }
        ... on DataJob {
          jobId
          dataFlow { flowId orchestrator }
        }
        ... on DataFlow {
          flowId
          orchestrator
        }
        ... on Chart {
          chartId
          properties { name }
        }
        ... on Dashboard {
          dashboardId
          properties { name }
        }
        ... on SchemaFieldEntity {
          fieldPath
          parent { urn type }
        }
      }
      paths {
        path {
          urn
          type
          ... on SchemaFieldEntity {
            fieldPath
            parent { urn type }
          }
          ... on Dataset {
            name
            properties { name qualifiedName }
          }
          ... on QueryEntity {
            urn
          }
        }
      }
    }
  }
}
"""

_LIST_QUERIES_GQL = """
query listQueries($input: ListQueriesInput!) {
  listQueries(input: $input) {
    start
    total
    count
    queries {
      urn
      properties {
        name
        description
        source
        statement { value language }
      }
      platform { urn name }
      subjects {
        dataset { urn }
        schemaField { urn fieldPath }
      }
    }
  }
}
"""

_SCHEMA_FIELDS_GQL = """
query datasetSchemaFields($urns: [String!]!) {
  entities(urns: $urns) {
    urn
    type
    ... on Dataset {
      schemaMetadata {
        fields {
          fieldPath
          nullable
          description
          nativeDataType
          label
        }
      }
    }
  }
}
"""

# Shared GraphQL selection sets -------------------------------------------------

_OWNERSHIP_FIELDS = """
  ownership {
    owners {
      type
      owner {
        ... on CorpUser {
          urn
          username
          properties { displayName email title departmentName }
        }
        ... on CorpGroup {
          urn
          name
          properties { displayName email description }
        }
      }
    }
  }
"""

_TAGS_FIELDS = """
  tags {
    tags {
      tag {
        urn
        properties { name description }
      }
    }
  }
"""

_GLOSSARY_ON_ASSET_FIELDS = """
  glossaryTerms {
    terms {
      term {
        urn
        hierarchicalName
        properties { name description }
      }
    }
  }
"""

_DOMAIN_FIELDS = """
  domain {
    domain {
      urn
      properties { name description }
    }
  }
"""

_DEPRECATION_FIELDS = """
  deprecation { deprecated note actor decommissionTime }
"""

_LINEAGE_FIELDS = f"""
  upstream: lineage(input: {{ direction: UPSTREAM, start: 0, count: {DEFAULT_LINEAGE_COUNT} }}) {{
    total
    relationships {{
      type
      entity {{ urn type }}
    }}
  }}
  downstream: lineage(input: {{ direction: DOWNSTREAM, start: 0, count: {DEFAULT_LINEAGE_COUNT} }}) {{
    total
    relationships {{
      type
      entity {{ urn type }}
    }}
  }}
"""

_DATASET_FRAGMENT = f"""
  ... on Dataset {{
    urn
    type
    name
    lastIngested
    platform {{ urn name }}
    properties {{
      name
      description
      qualifiedName
      origin
      externalUrl
      customProperties {{ key value }}
    }}
    container {{ urn properties {{ name }} }}
    {_OWNERSHIP_FIELDS}
    {_TAGS_FIELDS}
    {_GLOSSARY_ON_ASSET_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    schemaMetadata {{
      name
      platformSchema {{
        ... on TableSchema {{ schema }}
        ... on KeyValueSchema {{ keySchema valueSchema }}
      }}
      fields {{
        fieldPath
        nullable
        description
        nativeDataType
      }}
      primaryKeys
    }}
    {_LINEAGE_FIELDS}
  }}
"""

_DATA_JOB_FRAGMENT = f"""
  ... on DataJob {{
    urn
    type
    jobId
    lastIngested
    dataFlow {{
      urn
      flowId
      orchestrator
      cluster
      properties {{ name description }}
    }}
    properties {{
      name
      description
      externalUrl
      customProperties {{ key value }}
    }}
    {_OWNERSHIP_FIELDS}
    {_TAGS_FIELDS}
    {_GLOSSARY_ON_ASSET_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    {_LINEAGE_FIELDS}
  }}
"""

_DATA_FLOW_FRAGMENT = f"""
  ... on DataFlow {{
    urn
    type
    orchestrator
    flowId
    cluster
    lastIngested
    properties {{
      name
      description
      project
      externalUrl
      customProperties {{ key value }}
    }}
    {_OWNERSHIP_FIELDS}
    {_TAGS_FIELDS}
    {_GLOSSARY_ON_ASSET_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    {_LINEAGE_FIELDS}
    childJobs: relationships(
      input: {{ types: ["IsPartOf"], direction: INCOMING, start: 0, count: {DEFAULT_RELATIONSHIP_COUNT} }}
    ) {{
      total
      relationships {{
        type
        entity {{
          urn
          type
          ... on DataJob {{
            jobId
            properties {{ name description }}
          }}
        }}
      }}
    }}
  }}
"""

_GLOSSARY_TERM_FRAGMENT = f"""
  ... on GlossaryTerm {{
    urn
    type
    hierarchicalName
    properties {{
      name
      description
      termSource
      sourceRef
      sourceUrl
      customProperties {{ key value }}
    }}
    parentNodes {{
      nodes {{
        urn
        ... on GlossaryNode {{
          properties {{ name description }}
        }}
      }}
    }}
    {_OWNERSHIP_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    relatedOutgoing: relationships(
      input: {{
        types: ["IsA", "HasA", "RelatedTo", "ReplacedBy", "Values"]
        direction: OUTGOING
        start: 0
        count: {DEFAULT_RELATIONSHIP_COUNT}
      }}
    ) {{
      total
      relationships {{ type entity {{ urn type }} }}
    }}
    relatedIncoming: relationships(
      input: {{
        types: ["TermedWith", "IsA", "HasA", "RelatedTo", "ReplacedBy", "Values"]
        direction: INCOMING
        start: 0
        count: {DEFAULT_RELATIONSHIP_COUNT}
      }}
    ) {{
      total
      relationships {{ type entity {{ urn type }} }}
    }}
  }}
"""

_CHART_FRAGMENT = f"""
  ... on Chart {{
    urn
    type
    tool
    chartId
    lastIngested
    properties {{
      name
      description
      externalUrl
      customProperties {{ key value }}
    }}
    {_OWNERSHIP_FIELDS}
    {_TAGS_FIELDS}
    {_GLOSSARY_ON_ASSET_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    {_LINEAGE_FIELDS}
  }}
"""

_DASHBOARD_FRAGMENT = f"""
  ... on Dashboard {{
    urn
    type
    tool
    dashboardId
    lastIngested
    properties {{
      name
      description
      externalUrl
      customProperties {{ key value }}
    }}
    {_OWNERSHIP_FIELDS}
    {_TAGS_FIELDS}
    {_GLOSSARY_ON_ASSET_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    {_LINEAGE_FIELDS}
  }}
"""

_TAG_FRAGMENT = """
  ... on Tag {
    urn
    type
    properties { name description }
    ownership {
      owners {
        type
        owner {
          ... on CorpUser { urn username properties { displayName email } }
          ... on CorpGroup { urn name properties { displayName } }
        }
      }
    }
  }
"""

_CORP_USER_FRAGMENT = """
  ... on CorpUser {
    urn
    type
    username
    status
    properties {
      displayName
      email
      title
      departmentName
      firstName
      lastName
      fullName
      active
      manager { urn username properties { displayName email } }
    }
    editableProperties { displayName aboutMe teams title skills }
  }
"""

_CORP_GROUP_FRAGMENT = """
  ... on CorpGroup {
    urn
    type
    name
    properties { displayName email description }
    ownership {
      owners {
        type
        owner {
          ... on CorpUser { urn username properties { displayName email } }
        }
      }
    }
    relationships(
      input: { types: ["IsMemberOfGroup"], direction: INCOMING, start: 0, count: 50 }
    ) {
      total
      relationships {
        type
        entity {
          urn
          type
          ... on CorpUser { username properties { displayName email } }
        }
      }
    }
  }
"""

_HYDRATION_FRAGMENTS: dict[str, str] = {
    "DATASET": _DATASET_FRAGMENT,
    "DATA_JOB": _DATA_JOB_FRAGMENT,
    "DATA_FLOW": _DATA_FLOW_FRAGMENT,
    "GLOSSARY_TERM": _GLOSSARY_TERM_FRAGMENT,
    "CHART": _CHART_FRAGMENT,
    "DASHBOARD": _DASHBOARD_FRAGMENT,
    "TAG": _TAG_FRAGMENT,
    "CORP_USER": _CORP_USER_FRAGMENT,
    "CORP_GROUP": _CORP_GROUP_FRAGMENT,
}


_SEARCH_ENTITIES_GQL = """
    query searchEntities($input: SearchAcrossEntitiesInput!) {
      searchAcrossEntities(input: $input) {
        start
        count
        total
        searchResults {
          entity { urn type }
        }
      }
    }
    """


def hydrate_entities_gql(fragment: str) -> str:
    """Build the ``entities(urns:)`` hydration query for one entity fragment."""
    return f"""
    query hydrateEntities($urns: [String!]!) {{
      entities(urns: $urns) {{
        urn
        type
        {fragment}
      }}
    }}
    """
