from openai import OpenAI
import os
import numpy as np
from .embedding_service import EmbeddingService


# Initialize services
embedding_service = EmbeddingService()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def query_rag_engine(question: str, org_id: str, top_k: int, index_manager):
   """Main RAG function: retrieve relevant content and generate answer"""
   # Get the organization's search index
   index_data = index_manager.get_index(org_id)
   if not index_data:
       raise ValueError(f"No index found for organization {org_id}")
  
   index = index_data["index"]
   paragraphs = index_data["paragraphs"]
  
   # Convert question to embedding
   q_embedding = embedding_service.create_embedding(question)
  
   # Search for most relevant content
   D, I = index.search(np.array([q_embedding]).astype("float32"), top_k)
  
   # Retrieve the most relevant paragraphs
   retrieved = [paragraphs[i] for i in I[0]]
   context = "\n\n".join(retrieved)
  
   # Generate answer using LLM with retrieved context
   messages = [
       {
           "role": "system",
           "content": "Та Монгол хэл дээр хариулах туслах юм. Хариултаа товч, ойлгомжтой болго."
       },
       {
           "role": "user",
           "content": f"Асуулт: {question}\n\nКонтекст:\n{context}"
       }
   ]
  
   response = client.chat.completions.create(
       model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
       messages=messages,
       temperature=0.2,
       max_tokens=1000
   )
  
   return {
       "answer": response.choices[0].message.content,
       "source_documents": retrieved,  # Return sources for verification
       "org_id": org_id
   }

