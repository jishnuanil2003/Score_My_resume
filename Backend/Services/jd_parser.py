from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
import dotenv
import re
import json

dotenv.load_dotenv()


def parse_jd(jd_text):

    llm = ChatGroq(
        model="qwen/qwen3-32b"
    )

    pt = PromptTemplate.from_template(
        """
You are a JSON generator.

Extract:
- role
- skills
- experience
- education
- important_keywords

Return ONLY valid JSON.
Do not explain.
Do not add markdown.
Do not add thinking steps.
Do not add <think>.
Do not add preamble text.

Expected format:

{{
    "role": "AI/ML Engineer",
    "skills": ["Python", "TensorFlow"],
    "experience": {{
        "min_years": 10,
        "max_years": 18
    }},
    "education": [],
    "important_keywords": ["LLM", "RAG", "FastAPI"]
}}

JOB DESCRIPTION:
=================
{job_description}
"""
    )

    chain = pt | llm

    response = chain.invoke({
        "job_description": jd_text
    })

    # Remove think/tool blocks if present
    cleaned = re.sub(
        r"<.*?>.*?</.*?>",
        "",
        response.content,
        flags=re.DOTALL
    ).strip()

    # Convert JSON string to Python dictionary
    output = json.loads(cleaned)

    return output