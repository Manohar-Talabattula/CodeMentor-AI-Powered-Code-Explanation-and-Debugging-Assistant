
from app.services.rag_service import search_similar_chunks

question = "What are embeddings and why are they useful?"

results = search_similar_chunks(
    query=question,
    n_results=3
)

print("\nUser Question:", question)
print("\nRetrieved Results:")

for index, result in enumerate(results, start=1):
    print(f"\nResult {index}")
    print("Filename:", result["filename"])
    print("Chunk:", result["chunk_index"])
    print("Distance:", result["distance"])
    print("Text:", result["text"])
