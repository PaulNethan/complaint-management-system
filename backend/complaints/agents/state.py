from typing import TypedDict


class AgentState(TypedDict):

    complaint_text: str
    draft_post: str
    safety_issue: bool
    auditor_notes: str
