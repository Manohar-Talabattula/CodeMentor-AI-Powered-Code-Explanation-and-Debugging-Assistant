
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.rag_service import search_similar_chunks
from app.services.llm_service import generate_answer


router = APIRouter(
    prefix="/api/chat",
    tags=["RAG Chat"]
)


class ChatRequest(BaseModel):
    question: str
    filename: str


@router.post("/ask")
def ask_question(request: ChatRequest):

    try:
        # Retrieve relevant chunks from the selected PDF
        retrieved_chunks = search_similar_chunks(
            query=request.question,
            n_results=5,
            filename=request.filename
        )

        if not retrieved_chunks:
            raise HTTPException(
                status_code=404,
                detail="No relevant document content found."
            )

        # Prepare context for the LLM
        context = "\n\n".join(
            chunk["text"] for chunk in retrieved_chunks
        )

        prompt = f"""
You are CodeMentor, an AI document assistant.

Answer the user's question using only the provided document context.

Instructions:
1. Give a clear and accurate answer.
2. Explain technical concepts in simple language.
3. Do not invent information that is not present in the context.
4. If the answer is unavailable, clearly mention that.
5. When relevant, mention the PDF page numbers provided with the sources.

DOCUMENT CONTEXT:
{context}

USER QUESTION:
{request.question}

Provide a clear and detailed answer.
"""

        answer = generate_answer(prompt)

        return {
            "question": request.question,
            "answer": answer,
            "sources": [
                {
                    "filename": chunk["filename"],
                    "chunk_index": chunk["chunk_index"],
                    "page_number": chunk.get("page_number")
                }
                for chunk in retrieved_chunks
            ]
        }

    except HTTPException:
        raise

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
            detail=f"Question answering failed: {error_message}"
        )
