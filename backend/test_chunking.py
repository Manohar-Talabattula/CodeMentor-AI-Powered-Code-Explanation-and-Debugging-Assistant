
from app.services.rag_service import split_text_into_chunks

sample_text = """
Retrieval Augmented Generation is called RAG.

RAG combines information retrieval with language generation.
It allows an LLM to answer questions using external documents.

Embeddings convert text into numerical vectors.
These vectors help identify semantically similar content.
""" * 30

chunks = split_text_into_chunks(sample_text)

print("Total chunks:", len(chunks))

for index, chunk in enumerate(chunks):
    print(f"\nChunk {index + 1}:")
    print(chunk)
