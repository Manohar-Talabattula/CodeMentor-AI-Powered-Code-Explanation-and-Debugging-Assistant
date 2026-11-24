
from app.services.rag_service import search_similar_chunks

filename = "Bayesian_MK_3D_UNet_Report.pdf"

question = "Explain the architecture of Bayesian MK-UNet"

results = search_similar_chunks(
    query=question,
    n_results=5,
    filename=filename
)

print("\n========== DOCUMENT RETRIEVAL TEST ==========")

print("Selected document:", filename)
print("Retrieved chunks:", len(results))

for chunk in results:
    print("\nFilename:", chunk["filename"])
    print("Chunk index:", chunk["chunk_index"])
    print("Distance:", chunk["distance"])
    print("Content:", chunk["text"][:300])
    print("-" * 60)

print("\n========== TEST COMPLETED ==========")
