from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil, os, io
import numpy as np
import pandas as pd
from docx import Document
from openai import OpenAI
import faiss
from dotenv import load_dotenv
import json
import docx 
import uuid
import asyncio
from typing import Optional, Dict, List, Any

load_dotenv()
app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# Store indices per organization/user
indices = {}

def read_docx(path: str):
    """Extract text from a .docx file as paragraphs"""
    doc = docx.Document(path)
    paras = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    return paras

def read_excel(path: str):
    """Extract text from all cells of an Excel file"""
    xls = pd.ExcelFile(path)
    texts = []
    for sheet_name in xls.sheet_names:
        df = xls.parse(sheet_name, dtype=str).fillna("")
        for row in df.values:
            row_text = " ".join([str(cell).strip() for cell in row if str(cell).strip()])
            if row_text:
                texts.append(row_text)
    return texts

def build_faiss(paragraphs):
    """Embed paragraphs and build FAISS index"""
    embeddings = []
    for para in paragraphs:
        emb = client.embeddings.create(
            model="text-embedding-3-small",
            input=para
        ).data[0].embedding
        embeddings.append(emb)

    embeddings = np.array(embeddings).astype("float32")
    dim = len(embeddings[0])
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    return index, paragraphs

def process_file(task_id: str, file: UploadFile, org_id: str):
    import time

    tasks[task_id] = {"progress": 10, "stage": "File received", "done": False}

    # Simulate parsing
    time.sleep(2)
    tasks[task_id] = {"progress": 30, "stage": "Parsing document", "done": False}

    # Simulate embeddings
    time.sleep(4)
    tasks[task_id] = {"progress": 70, "stage": "Embedding chunks", "done": False}

    # Simulate indexing
    time.sleep(3)
    tasks[task_id] = {"progress": 100, "stage": "Done", "done": True}

@app.post("/upload")
async def upload(file: UploadFile = File(...), org_id: Optional[str] = None):
    # Generate a unique ID if none provided
    if not org_id:
        org_id = str(uuid.uuid4())
    
    # save temp file
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # detect file type
    if file.filename.lower().endswith(".docx"):
        paragraphs = read_docx(file_path)
    elif file.filename.lower().endswith((".xlsx", ".xls")):
        paragraphs = read_excel(file_path)
    else:
        os.remove(file_path)
        return {"error": "Unsupported file type. Only .docx or Excel files."}

    # clean up
    os.remove(file_path)

    if not paragraphs:
        return {"error": "No text found in document"}

    # build FAISS index
    index, paragraphs = build_faiss(paragraphs)
    indices[org_id] = {"index": index, "paragraphs": paragraphs}

    return {
        "message": f"✅ Uploaded {file.filename}, {len(paragraphs)} paragraphs loaded, FAISS index built.",
        "org_id": org_id
    }

@app.post("/ask")
async def ask_question(question: str, org_id: str, top_k: int = 3):
    if org_id not in indices:
        raise HTTPException(status_code=404, detail="Organization data not found. Please upload documents first.")
    
    index_data = indices[org_id]
    index = index_data["index"]
    paragraphs = index_data["paragraphs"]

    # embed query
    q_embed = client.embeddings.create(
        model="text-embedding-3-small",
        input=question
    ).data[0].embedding

    D, I = index.search(np.array([q_embed]).astype("float32"), top_k)
    retrieved = [paragraphs[i] for i in I[0]]
    context = "\n\n".join(retrieved)

    messages = [
        {"role": "system", "content": "Та Монгол хэл дээр хариулах туслах юм."},
        {"role": "user", "content": f"Асуулт: {question}\n\nКонтекст:\n{context}"}
    ]

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0.2,
    )

    return {
        "answer": response.choices[0].message.content,
        "source_documents": retrieved,
        "org_id": org_id
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "rag-ai"}