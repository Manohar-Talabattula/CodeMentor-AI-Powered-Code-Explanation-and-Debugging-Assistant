
from app.services.rag_service import (
    split_text_into_chunks,
    store_chunks,
    collection
)

sample_text = """
Retrieval Augmented Generation combines
information retrieval with language generation.

Embeddings convert text into numerical vectors.

ChromaDB stores embeddings and allows
semantic similarity searches.
""" * 30

# Split the text
chunks = split_text_into_chunks(sample_text)

print("Total chunks:", len(chunks))

# Generate embeddings and store them
stored_count = store_chunks(
    chunks,
    "sample_document.pdf"
)

print("Stored chunks:", stored_count)

# Check database
print("Total records in ChromaDB:", collection.count())
