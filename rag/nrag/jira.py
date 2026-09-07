from dataclasses import make_dataclass, field
from typing import Any

from rag.nrag.data import Document

JIRA_FIELDS = [
    ("issue_key", str, ""),
    ("issue_id", str, ""),
    ("summary", str, ""),
    ("description", str, ""),
    ("status", str, ""),
    ("priority", str, ""),
    ("assignee", str, ""),
    ("reporter", str, ""),
    ("created", str, ""),
    ("updated", str, ""),
    ("issue_type", str, ""),
    ("project", str, ""),
    ("comments", list[dict], field(default_factory=list)),
]


def get_embedded_text(self):
    embed_text = "\n\n".join(
        part
        for part in (
            f"Summary: {self.summary}" if self.summary else "",
            f"Description: {self.description}" if self.description else "",
            f"Comments: {self.comments}" if self.comments else "",
        )
        if part
    )
    return embed_text


def populate_doc_fields(self):
    embed_text = self.get_embedded_text
    self.doc_id = self.issue_id
    self.url = f"https://wishcloud.atlassian.net/browse/{self.issue_id}"
    self.title = self.issue_key
    self.doc_content = embed_text
    self.paras = dict()

def jira_metadata(self) -> dict[str, Any]:
    metadata = dict()
    for field_name, _, _ in JIRA_FIELDS:
        metadata[field_name] = getattr(self, field_name)
    return metadata


JiraDocument = make_dataclass(
    cls_name="JiraDocument",
    fields=JIRA_FIELDS,
    bases=Document,
    frozen=True,
    kw_only=True,
    slots=True,
    namespace={
        "metadata": jira_metadata,
        "get_embedded_text": get_embedded_text,
        "__post__init__": populate_doc_fields
    },
)
