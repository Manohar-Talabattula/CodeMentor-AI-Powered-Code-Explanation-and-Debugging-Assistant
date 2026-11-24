
import time

from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import GOOGLE_API_KEY
from app.prompts.code_prompts import (
    code_explanation_prompt,
    code_debug_prompt,
    code_test_prompt,
    code_optimization_prompt
)


# Initialize Gemini
llm = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.2
)


# Extract text from Gemini response
def extract_response_text(response) -> str:

    if isinstance(response.content, str):
        return response.content

    if isinstance(response.content, list):
        return "\n".join(
            block["text"]
            for block in response.content
            if isinstance(block, dict)
            and block.get("type") == "text"
        )

    return str(response.content)


# Used for PDF question answering
def generate_answer(prompt: str, max_retries: int = 3) -> str:

    for attempt in range(max_retries):
        try:
            response = llm.invoke(prompt)
            return extract_response_text(response)

        except Exception as e:
            error_message = str(e)

            # Retry temporary service errors only
            is_temporary = (
                "503" in error_message
                or "UNAVAILABLE" in error_message
            )

            if not is_temporary or attempt == max_retries - 1:
                raise

            time.sleep(2 ** attempt)

    raise RuntimeError("Unable to generate an answer.")


# Prompts for different code analysis tasks
CODE_PROMPTS = {
    "explain": code_explanation_prompt,
    "debug": code_debug_prompt,
    "test": code_test_prompt,
    "optimize": code_optimization_prompt
}


# Main function for code analysis
def analyze_code(
    language: str,
    code: str,
    question: str,
    task: str
) -> str:

    if task not in CODE_PROMPTS:
        raise ValueError(f"Unsupported task: {task}")

    selected_prompt = CODE_PROMPTS[task]

    prompt = selected_prompt.format(
        language=language,
        code=code,
        question=question
    )

    response = llm.invoke(prompt)

    return extract_response_text(response)


# Keep the old Explain Code function
def explain_code(language: str, code: str, question: str) -> str:

    return analyze_code(
        language=language,
        code=code,
        question=question,
        task="explain"
    )
