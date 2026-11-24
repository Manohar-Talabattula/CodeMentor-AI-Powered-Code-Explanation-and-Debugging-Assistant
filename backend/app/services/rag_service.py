
import chromadb
from pathlib import Path
from uuid import uuid4

from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.services.embedding_service import generate_embeddings


# Create a persistent ChromaDB database
BACKEND_DIR = Path(__file__).resolve().parents[2]
CHROMA_PATH = BACKEND_DIR / "chroma_db"

client = chromadb.PersistentClient(
    path=str(CHROMA_PATH)
)

collection = client.get_or_create_collection(
    name="codementor_documents",
    metadata={"hnsw:space": "cosine"}
)


# STEP 1: Split extracted text into chunks
def split_text_into_chunks(
    text: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200
):
    if not text or not text.strip():
        return []

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""]
    )

    return text_splitter.split_text(text)


# STEP 2: Generate embeddings and store chunks with page numbers
def store_chunks(chunks, filename, page_numbers=None):

    if not chunks:
        return 0

    if page_numbers is None:
        page_numbers = [0] * len(chunks)

    if len(chunks) != len(page_numbers):
        raise ValueError(
            "Each chunk must have a corresponding page number."
        )

    # Generate vector embeddings
    embeddings = generate_embeddings(chunks)

    # Delete previous chunks for this filename
    collection.delete(
        where={"filename": filename}
    )

    # Generate unique IDs
    ids = [str(uuid4()) for _ in chunks]

    # Store filename, chunk index, and page number
    metadatas = [
        {
            "filename": filename,
            "chunk_index": index,
            "page_number": page_numbers[index]
        }
        for index in range(len(chunks))
    ]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )

    return len(chunks)


# STEP 3: Search for relevant document chunks
def search_similar_chunks(
    query: str,
    n_results: int = 3,
    filename: str = None
):

    if not query or not query.strip():
        return []

    # Get total number of stored records
    total_records = collection.count()

    if total_records == 0:
        return []

    # Generate embedding for user's question
    query_embedding = generate_embeddings([query])[0]

    # Build search arguments
    search_arguments = {
        "query_embeddings": [query_embedding],
        "n_results": min(n_results, total_records),
        "include": [
            "documents",
            "metadatas",
            "distances"
        ]
    }

    # Apply filename filter directly to the query
    if filename:
        search_arguments["where"] = {
            "filename": filename
        }

    # Retrieve similar chunks
    results = collection.query(**search_arguments)

    retrieved_chunks = []

    if not results["documents"] or not results["documents"][0]:
        return []

    # Format retrieved results
    for document, metadata, distance in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):

        retrieved_chunks.append({
            "text": document,
            "filename": metadata["filename"],
            "chunk_index": metadata["chunk_index"],
            "page_number": metadata.get("page_number"),
            "distance": distance
        })

    return retrieved_chunks
