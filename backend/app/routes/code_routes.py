
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.llm_service import analyze_code

router = APIRouter(
    prefix="/api/code",
    tags=["Code Assistant"]
)


class CodeRequest(BaseModel):
    language: str = Field(min_length=1)
    code: str = Field(min_length=1)
    question: str = ""
    task: Literal["explain", "debug", "test", "optimize"] = "explain"


@router.post("/analyze")
def analyze_code_endpoint(request: CodeRequest):
    try:
        answer = analyze_code(
            language=request.language,
            code=request.code,
            question=request.question,
            task=request.task
        )

        return {
            "task": request.task,
            "answer": answer
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        error_message = str(e)

        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            raise HTTPException(
                status_code=429,
                detail="Gemini API quota exceeded. Please try again later."
            )

        if "503" in error_message or "UNAVAILABLE" in error_message:
            raise HTTPException(
                status_code=503,
                detail="Gemini is temporarily unavailable. Please try again shortly."
            )

        raise HTTPException(
            status_code=500,
            detail=f"Code analysis failed: {error_message}"
        )


# Preserve the existing Explain endpoint
@router.post("/explain")
def explain_code_endpoint(request: CodeRequest):
    try:
        answer = analyze_code(
            language=request.language,
            code=request.code,
            question=request.question,
            task="explain"
        )

        return {"answer": answer}

    except Exception as e:
        error_message = str(e)

        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            raise HTTPException(
                status_code=429,
                detail="Gemini API quota exceeded. Please try again later."
            )

        if "503" in error_message or "UNAVAILABLE" in error_message:
            raise HTTPException(
                status_code=503,
                detail="Gemini is temporarily unavailable. Please try again shortly."
            )

        raise HTTPException(
            status_code=500,
            detail=f"Code explanation failed: {error_message}"
        )
