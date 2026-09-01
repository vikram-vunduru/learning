import type { Resource } from "./resources";

export const AGENTFORCE_VOICE_RESOURCES: Record<string, Resource[]> = {
  "av-overview": [
    { type: "docs", title: "Service Cloud Voice — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_about.htm&type=5", description: "Primary reference for all Service Cloud Voice features, setup, and configuration", level: "Beginner" },
    { type: "trailhead", title: "Service Cloud Voice — Trailhead Search", url: "https://trailhead.salesforce.com/search?keywords=service+cloud+voice", description: "Find official Salesforce modules on Service Cloud Voice and Agentforce Voice", level: "Beginner" },
    { type: "docs", title: "Agentforce Voice — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Einstein GenAI developer guide — covers Agentforce Voice architecture and APIs", level: "Intermediate" },
    { type: "youtube", title: "Service Cloud Voice Overview — Salesforce", url: "https://www.youtube.com/@Salesforce", description: "Search 'Service Cloud Voice Agentforce' for architecture demos and walkthroughs", duration: "20 min" },
  ],
  "av-l01": [
    { type: "docs", title: "Service Cloud Voice Overview", url: "https://help.salesforce.com/s/articleView?id=sf.voice_about.htm&type=5", description: "What Service Cloud Voice is, what it does, and how Agentforce extends it to AI", level: "Beginner" },
    { type: "blog", title: "Agentforce Voice — Salesforce Product Page", url: "https://www.salesforce.com/agentforce/", description: "Official Salesforce Agentforce page covering the voice experience and use cases", level: "Beginner" },
    { type: "docs", title: "Einstein Trust Layer for Voice", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "How the Trust Layer applies to voice calls — data masking, zero retention, audit logs", level: "Intermediate" },
  ],
  "av-l02": [
    { type: "docs", title: "Set Up Amazon Connect with Service Cloud Voice", url: "https://help.salesforce.com/s/articleView?id=sf.voice_amazon_connect_setup.htm&type=5", description: "Step-by-step Amazon Connect integration guide — the primary telephony partner", level: "Intermediate" },
    { type: "docs", title: "Partner Telephony Setup — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_partner_telephony.htm&type=5", description: "Partner Telephony (Genesys, NICE CXone) setup vs. Amazon Connect managed package", level: "Intermediate" },
    { type: "youtube", title: "Amazon Connect + Salesforce Integration", url: "https://www.youtube.com/@Salesforce", description: "Search 'Amazon Connect Salesforce Voice' for integration walkthrough videos", duration: "25 min" },
  ],
  "av-l03": [
    { type: "docs", title: "Create a Voice Call Center — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_call_center.htm&type=5", description: "Call Center creation, ARN configuration, and agent assignment", level: "Intermediate" },
    { type: "docs", title: "Omni-Channel for Voice — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.omnichannel_intro.htm&type=5", description: "Omni-Channel routing setup — queues, routing configurations, presence for voice", level: "Intermediate" },
  ],
  "av-l04": [
    { type: "docs", title: "Configure Agentforce for Voice — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.agentforce_voice_configure.htm&type=5", description: "How to add a Voice channel to an Agentforce agent in Agentforce Studio", level: "Intermediate" },
    { type: "trailhead", title: "Agentforce Voice Configuration — Trailhead Search", url: "https://trailhead.salesforce.com/search?keywords=agentforce+voice+configuration", description: "Find hands-on Trailhead content for configuring Agentforce Voice agents", level: "Intermediate" },
  ],
  "av-l05": [
    { type: "docs", title: "Voice Flow Elements — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_flow_elements.htm&type=5", description: "Speak, Get Input, Transfer, and other Voice-specific Flow elements", level: "Intermediate" },
    { type: "docs", title: "Agentforce Topics and Actions", url: "https://help.salesforce.com/s/articleView?id=sf.agentforce_topics.htm&type=5", description: "How to write effective Topic and Action descriptions for voice-optimized routing", level: "Intermediate" },
  ],
  "av-l06": [
    { type: "docs", title: "Real-Time Transcription — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_transcription.htm&type=5", description: "How real-time transcription works in Service Cloud Voice — setup and compliance", level: "Advanced" },
    { type: "docs", title: "Amazon Connect Contact Lens — AWS Docs", url: "https://docs.aws.amazon.com/connect/latest/adminguide/analyze-conversations.html", description: "Amazon Contact Lens for transcription, sentiment, and PII redaction at the telephony layer", level: "Advanced" },
  ],
  "av-l07": [
    { type: "docs", title: "Build a Voice Call Flow — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_flow.htm&type=5", description: "Voice Call Flow subtype, Speak/Get Input/Transfer elements, IVR replacement patterns", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Voice Flows Tutorial", url: "https://www.youtube.com/@Salesforce", description: "Search 'Salesforce Voice Flow IVR' for step-by-step flow building demos", duration: "20 min" },
  ],
  "av-l08": [
    { type: "docs", title: "Einstein Conversation Mining — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.conversation_mining.htm&type=5", description: "Conversation Mining setup, topic clustering, and integration with Agent Assist", level: "Intermediate" },
    { type: "docs", title: "Screen Pop Configuration — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_screen_pop.htm&type=5", description: "Configure screen pop rules using ANI, DNIS, and IVR-collected data", level: "Intermediate" },
  ],
  "av-l09": [
    { type: "docs", title: "Omni-Channel Routing for Voice", url: "https://help.salesforce.com/s/articleView?id=sf.omnichannel_routing_voice.htm&type=5", description: "Skill-based routing, queue overflow, capacity configuration for voice channels", level: "Intermediate" },
    { type: "docs", title: "Agent States in Omni-Channel", url: "https://help.salesforce.com/s/articleView?id=sf.omnichannel_presence_statuses.htm&type=5", description: "Available, Busy, ACW state machine — configuration and after-call work time", level: "Intermediate" },
  ],
  "av-l10": [
    { type: "docs", title: "Test Your Voice Agent — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_testing.htm&type=5", description: "Testing modes for voice agents — simulator, debug logs, Amazon Connect test calls", level: "Intermediate" },
    { type: "trailhead", title: "Agentforce Testing — Trailhead Search", url: "https://trailhead.salesforce.com/search?keywords=agentforce+voice+testing", description: "Trailhead modules on testing Agentforce agents across channels including voice", level: "Intermediate" },
  ],
  "av-l11": [
    { type: "docs", title: "VoiceCall Object Reference — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_voicecall_object.htm&type=5", description: "VoiceCall object fields, ConversationEntry child records, recording access", level: "Intermediate" },
    { type: "docs", title: "Service Cloud Voice Analytics — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_analytics.htm&type=5", description: "Containment rate, escalation rate, call resolution metrics and dashboards", level: "Intermediate" },
  ],
  "av-l12": [
    { type: "docs", title: "Outbound Calling with Agentforce Voice", url: "https://help.salesforce.com/s/articleView?id=sf.voice_outbound.htm&type=5", description: "Outbound dialing modes, predictive dialing, and autonomous outbound agent setup", level: "Advanced" },
    { type: "docs", title: "Data Cloud + Agentforce Voice", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "How to use Data Cloud unified profiles for real-time voice personalization", level: "Advanced" },
    { type: "blog", title: "Agentforce Voice Use Cases — Salesforce", url: "https://www.salesforce.com/agentforce/", description: "Real-world Agentforce Voice implementations for service, sales, and field teams", level: "Intermediate" },
  ],
  "av-lab01": [
    { type: "docs", title: "Amazon Connect Setup Guide", url: "https://help.salesforce.com/s/articleView?id=sf.voice_amazon_connect_setup.htm&type=5", description: "Step-by-step reference for Lab 1 — Amazon Connect instance, managed package, Contact Flow", level: "Intermediate" },
    { type: "docs", title: "Salesforce Voice for Amazon Connect — AppExchange", url: "https://appexchange.salesforce.com/appxListingDetail?listingId=a0N3A00000FZAHsUAP", description: "The managed package required to connect Amazon Connect to Salesforce", level: "Intermediate" },
  ],
  "av-lab02": [
    { type: "docs", title: "Build a Service Agent — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.agentforce_service_agent.htm&type=5", description: "Service Agent creation guide — Identity, Instructions, Topics, Actions, and channel config", level: "Intermediate" },
    { type: "trailhead", title: "Build with Agentforce — Trailhead Search", url: "https://trailhead.salesforce.com/search?keywords=agentforce+build+voice", description: "Find hands-on Trailhead content for building voice-enabled Agentforce agents", level: "Intermediate" },
  ],
  "av-exam": [
    { type: "docs", title: "Service Cloud Voice — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_about.htm&type=5", description: "Primary reference for all exam topics — review before taking the practice exam", level: "Beginner" },
    { type: "trailhead", title: "Agentforce Specialist Exam Guide", url: "https://trailhead.salesforce.com/credentials/agentforcespecialist", description: "Voice scenarios appear on the Agentforce Specialist exam — review official objectives", level: "Beginner" },
    { type: "udemy", title: "Service Cloud Voice Practice — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+service+cloud+voice&sort=highest-rated", description: "Find Service Cloud Voice and Agentforce Voice practice courses on Udemy", level: "Intermediate" },
  ],
  "av-cheatsheet": [
    { type: "docs", title: "Service Cloud Voice — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.voice_about.htm&type=5", description: "Official reference to verify any term or configuration detail in the cheat sheet", level: "Beginner" },
    { type: "docs", title: "Agentforce Voice Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Technical reference for architecture and API details in the cheat sheet", level: "Intermediate" },
  ],
};
