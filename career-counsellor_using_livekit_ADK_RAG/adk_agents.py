from google.adk.agents import LlmAgent,ParallelAgent

GEMINI_MODEL = "gemini-2.5-flash"
MAX_OUTPUT_TOKENS = 250

# --- 1. Open Job Positions Agent ---
open_positions_agent = LlmAgent(
    name="OpenPositionsAgent",
    model=GEMINI_MODEL,
    instruction="""
You are a Job search assistant. Based on the user query do your research on web and,
list 5 open job positions.

For each position include:
- Job Title
- Company
- Location

Output as a numbered list.

Keep your response concise within 250 tokens.
""",
    output_key="open_positions"
)

# --- 2. Interview Q&A Agent ---
interview_qa_agent = LlmAgent(
    name="InterviewQAAgent",
    model=GEMINI_MODEL,
    instruction="""
You are an interview coach. For the given query and referring to {open_positions},
create 5 common interview questions with strong sample answers.

Format:
Q: <question>
A: <answer>

Keep your response concise within 250 tokens.
""",
    output_key="interview_qa"
)

# --- 3. Interview Tips & Tricks Agent ---
interview_tips_agent = LlmAgent(
    name="InterviewTipsAgent",
    model=GEMINI_MODEL,
    instruction="""
You are a career mentor. Provide practical tips & tricks to excel in interviews
for the user query. Use {open_positions} to tailor your advice. Also advise on {interview_qa}.

Cover:
- How to research the company
- What to prepare technically
- Behavioral interview strategies
- Body language & communication tips

Output as a bulleted list and keep within 250 tokens.
""",
    output_key="interview_tips"
)

# --- 4. Career Advisor Agent ---
career_advisor_agent = LlmAgent(
    name="CareerAdvisorAgent",
    model=GEMINI_MODEL,
    instruction="""
You are a professional Career Advisor. Help users clarify and strengthen their career path.

Your approach:
1. First, understand their current career situation by asking about:
   - Current role/position and years of experience
   - Industry and technology stack they work with
   - Career achievements and strengths
   - Current career goals (short-term: 1-2 years, long-term: 5+ years)

2. Based on their responses, ask follow-up questions to identify:
   - Growth opportunities aligned with their strengths
   - Skill gaps that need to be addressed
   - Industry trends relevant to their path
   - Mentorship or learning needs

3. Provide clear, actionable guidance including:
   - Recommended career path options with pros/cons
   - Skills to develop or improve
   - Timeline for achieving career goals
   - Next steps and milestones

Be conversational, empathetic, and specific. Ask one or two questions at a time.
Keep your response within 250 tokens.
""",
    output_key="career_advisor"
)

# --- Combine into Sequential LLM Pipeline ---
interview_prep_pipeline = ParallelAgent(
    name="InterviewPrepPipeline",
    sub_agents=[open_positions_agent, interview_qa_agent, interview_tips_agent, career_advisor_agent],
    description="Suggests open jobs, interview Q&A, preparation tips, and career guidance"
)

# Root agent
root_agent = interview_prep_pipeline