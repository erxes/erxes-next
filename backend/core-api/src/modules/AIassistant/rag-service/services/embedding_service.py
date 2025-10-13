import numpy as np
from openai import OpenAI
import os
import faiss

class EmbeddingService:
    def __init__ (self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    
    def create_embeddings(self, texts:list) -> np.ndarray:
        """Convert a list of texts to numerical embeddings"""
        embeddings = []
        for text in texts:
            response =self.client.embeddings.create(
                model=self.model,
                input.text
            )
            embeddings.append(response.data[0].embedding)
        return np.array(embeddings).astype("float32")
    
    def create_embedding(self, text: str) -> np.ndarray:
        """Convert a single text to an embedding"""
        response = self.client.embeddings.create(
            model=self.model,
            input=text
        )
        return np.array(response.data[0].embedding).astype("float32")

    def create_faiss_index(embeddings: np.d=ndarray):
        """Create a FAISS vector search index from embeddings"""
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)  # L2 distance metric
        index.add(embeddings)
        return index
