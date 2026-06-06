from complaints.agents.tools import post_to_twitter_tool
from complaints.agents.state import AgentState
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI


llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key="YOUR_KEY")


def write_node(state: AgentState) -> dict:

    raw_complaint = state["complaint_text"]

    prompt = (
        f"You are a professional Public Relations specialist. "
        f"Rewrite the following crime complaint into a short, anonymous, "
        f"and engaging public safety warning post for social media (max 280 characters). "
        f"Do NOT include any names, emails, phone numbers, or exact addresses.\n\n"
        f"Complaint details:\n{raw_complaint}\n\n"
        f"Anonymous Draft Post:"
    )
    response = llm.invoke(prompt)

    return {"draft_post": response.content.strip()}


def auditor_node(state: AgentState) -> dict:

    draft = state["draft_post"]

    prompt = (
        f"You are a strict Data Privacy Compliance Officer. "
        f"Analyze the following drafted social media post for any Personally Identifiable Information (PII) "
        f"such as actual names, emails, phone numbers, or exact addresses.\n\n"
        f"Rules:\n"
        f"- If the post is completely safe and anonymous, write exactly: SAFE\n"
        f"- If the post contains private details, write: UNSAFE: followed by the reason why.\n\n"
        f"Draft Post to analyze:\n{draft}\n\n"
        f"Audit Result:"
    )

    response = llm.invoke(prompt)

    result = response.content.strip()

    if result.startswith("UNSAFE"):
        return {"safety_issue": True, "auditor_notes": result}
    else:
        return {
            "safety_issue": False,
            "auditor_notes": "Draft is compliant and safe to publish.",
        }


workflow = StateGraph(AgentState)

workflow.add_node("writer", write_node)
workflow.add_node("auditor", auditor_node)

workflow.set_entry_point("writer")


workflow.add_edge("writer", "auditor")
workflow.add_edge("auditor", END)

app = workflow.compile()
