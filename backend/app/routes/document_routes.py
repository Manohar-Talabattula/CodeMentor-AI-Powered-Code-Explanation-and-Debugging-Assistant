
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException
from pypdf import PdfReader

from app.services.rag_service import (
    split_text_into_chunks,
    store_chunks
)

router = APIRouter(
    prefix="/api/documents",
    tags=["Document Upload"]
)

# Store uploaded PDFs inside the backend/uploads folder
BACKEND_DIR = Path(__file__).resolve().parents[2]
UPLOAD_DIR = BACKEND_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    try:
        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="The uploaded PDF is empty"
            )

        filename = Path(file.filename).name
        file_path = UPLOAD_DIR / filename

        # Save uploaded PDF
        with open(file_path, "wb") as pdf_file:
            pdf_file.write(contents)

        # Read PDF
        reader = PdfReader(str(file_path))

        chunks = []
        page_numbers = []

        # Extract and split text page by page
        for page_number, page in enumerate(reader.pages, start=1):

            page_text = page.extract_text() or ""

            if not page_text.strip():
                continue

            page_chunks = split_text_into_chunks(page_text)

            for chunk in page_chunks:
                chunks.append(chunk)
                page_numbers.append(page_number)

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No extractable text found in this PDF"
            )

        # Generate embeddings and store chunks with page numbers
        stored_chunks = store_chunks(
            chunks=chunks,
            filename=filename,
            page_numbers=page_numbers
        )

        return {
            "message": "PDF uploaded and processed successfully",
            "filename": filename,
            "total_pages": len(reader.pages),
            "total_chunks": len(chunks),
            "stored_chunks": stored_chunks
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF processing failed: {str(e)}"
        )

    finally:
        await file.close()
