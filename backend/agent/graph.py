from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.tools import tool
from sqlalchemy.orm import Session
from models import Interaction
from schemas import InteractionCreate
import os
from dotenv import load_dotenv
from typing import TypedDict, Annotated, List
import operator
import json

load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3
)

# ============================================
# 5 LANGGRAPH TOOLS
# ============================================

db_session = None

@tool
def log_interaction(
    hcp_name: str,
    interaction_type: str,
    date: str,
    topics_discussed: str,
    sentiment: str = "neutral",
    outcomes: str = "",
    follow_up_actions: str = "",
    attendees: str = "",
    materials_shared: str = "",
    samples_distributed: str = ""
) -> str:
    """Log a new interaction with an HCP (Healthcare Professional/Doctor).
    Use this when user wants to save or record a meeting with a doctor."""
    try:
        interaction = Interaction(
            hcp_name=hcp_name,
            interaction_type=interaction_type,
            date=date,
            topics_discussed=topics_discussed,
            sentiment=sentiment,
            outcomes=outcomes,
            follow_up_actions=follow_up_actions,
            attendees=attendees,
            materials_shared=materials_shared,
            samples_distributed=samples_distributed
        )
        db_session.add(interaction)
        db_session.commit()
        db_session.refresh(interaction)
        return f"✅ Interaction logged successfully! ID: {interaction.id}, HCP: {hcp_name}, Type: {interaction_type}, Date: {date}"
    except Exception as e:
        return f"❌ Error logging interaction: {str(e)}"

@tool
def edit_interaction(
    interaction_id: int,
    field_name: str,
    new_value: str
) -> str:
    """Edit/update an existing logged interaction by its ID.
    Use this when user wants to modify or correct a previously logged interaction."""
    try:
        interaction = db_session.query(Interaction).filter(
            Interaction.id == interaction_id
        ).first()
        if not interaction:
            return f"❌ Interaction with ID {interaction_id} not found"
        setattr(interaction, field_name, new_value)
        db_session.commit()
        return f"✅ Interaction {interaction_id} updated! Field '{field_name}' changed to '{new_value}'"
    except Exception as e:
        return f"❌ Error editing interaction: {str(e)}"

@tool
def get_hcp_history(hcp_name: str) -> str:
    """Get all past interactions with a specific HCP/Doctor.
    Use this when user asks about history or previous meetings with a doctor."""
    try:
        interactions = db_session.query(Interaction).filter(
            Interaction.hcp_name.ilike(f"%{hcp_name}%")
        ).all()
        if not interactions:
            return f"No interactions found for {hcp_name}"
        result = f"📋 Found {len(interactions)} interaction(s) with {hcp_name}:\n"
        for i in interactions:
            result += f"\n• ID:{i.id} | {i.interaction_type} on {i.date} | Sentiment: {i.sentiment} | Topics: {i.topics_discussed}"
        return result
    except Exception as e:
        return f"❌ Error: {str(e)}"

@tool
def suggest_followups(hcp_name: str, topics_discussed: str, sentiment: str) -> str:
    """Suggest AI-powered follow-up actions based on the interaction details.
    Use this when user wants recommendations for next steps after a doctor meeting."""
    suggestions = []
    if sentiment == "negative":
        suggestions.append(f"📞 Schedule urgent follow-up call with {hcp_name} within 3 days")
        suggestions.append("📄 Prepare detailed product efficacy data to address concerns")
    elif sentiment == "positive":
        suggestions.append(f"📅 Schedule product demo with {hcp_name} next week")
        suggestions.append("🎁 Send thank you note with product samples")
    else:
        suggestions.append(f"📧 Send follow-up email to {hcp_name} with product brochure")
        suggestions.append("📅 Schedule follow-up meeting in 2 weeks")

    if "efficacy" in topics_discussed.lower():
        suggestions.append("📊 Share latest clinical trial results")
    if "side effects" in topics_discussed.lower():
        suggestions.append("📋 Share detailed safety profile document")
    if "competitor" in topics_discussed.lower():
        suggestions.append("📈 Prepare competitive analysis report")

    return "💡 AI Suggested Follow-ups:\n" + "\n".join(suggestions)

@tool
def analyze_sentiment(conversation_text: str) -> str:
    """Analyze the sentiment of an HCP interaction from conversation notes.
    Use this to determine if doctor reaction was positive, neutral or negative."""
    positive_words = ["interested", "impressed", "agreed", "positive", "good", "great", "excellent", "will prescribe", "liked"]
    negative_words = ["concerned", "skeptical", "rejected", "negative", "bad", "not interested", "refused", "competitor"]

    text_lower = conversation_text.lower()
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)

    if pos_count > neg_count:
        sentiment = "positive"
        emoji = "😊"
    elif neg_count > pos_count:
        sentiment = "negative"
        emoji = "😟"
    else:
        sentiment = "neutral"
        emoji = "😐"

    return f"{emoji} Sentiment Analysis Result: {sentiment.upper()}\n(Positive signals: {pos_count}, Negative signals: {neg_count})"

# ============================================
# LANGGRAPH STATE & GRAPH
# ============================================

class AgentState(TypedDict):
    messages: Annotated[List, operator.add]

tools = [log_interaction, edit_interaction, get_hcp_history, suggest_followups, analyze_sentiment]
llm_with_tools = llm.bind_tools(tools)

def agent_node(state: AgentState):
    system_prompt = """You are an AI assistant for a pharmaceutical CRM system. 
    You help field representatives log and manage their interactions with Healthcare Professionals (HCPs/Doctors).
    
    You have access to these tools:
    1. log_interaction - Save a new doctor meeting/interaction
    2. edit_interaction - Modify an existing interaction
    3. get_hcp_history - View past interactions with a doctor
    4. suggest_followups - Get AI suggestions for next steps
    5. analyze_sentiment - Analyze doctor's reaction/sentiment
    
    Always be helpful, professional and concise. Extract relevant information from user messages."""

    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState):
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

tool_node = ToolNode(tools)

graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", should_continue)
graph.add_edge("tools", "agent")

app_graph = graph.compile()

async def run_agent(message: str, conversation_history: list, db: Session) -> str:
    global db_session
    db_session = db

    messages = []
    for msg in conversation_history:
        if msg.get("role") == "user":
            messages.append(HumanMessage(content=msg["content"]))

    messages.append(HumanMessage(content=message))

    result = await app_graph.ainvoke({"messages": messages})

    last_message = result["messages"][-1]
    return last_message.content