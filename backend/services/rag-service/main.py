# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
import os
import uuid
import json
import traceback
import io
import numpy as np
import pandas as pd
import docx
import faiss
import redis
import boto3
from botocore.config import Config
from openai import OpenAI
from dotenv import load_dotenv

# Load env
load_dotenv()

# --------- Config ----------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET = os.getenv("R2_BUCKET_NAME")

MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", 200 * 1024 * 1024))  # 200MB default

# --------- App ----------
app = FastAPI()

# CORS — allow local dev origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- OpenAI client ----------
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is required in environment")
client = OpenAI(api_key=OPENAI_API_KEY)

# --------- Redis client ----------
redis_kwargs = {"host": REDIS_HOST, "port": REDIS_PORT, "db": REDIS_DB}
if REDIS_PASSWORD:
    redis_kwargs["password"] = REDIS_PASSWORD
redis_client = redis.Redis(**redis_kwargs, decode_responses=False)

# --------- R2 Client ----------
r2_client = None
if R2_ACCOUNT_ID and R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY and R2_BUCKET:
    try:
        r2_client = boto3.client(
            "s3",
            endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4"),
            region_name="auto",
        )
        print("✅ R2 client initialized")
    except Exception as e:
        r2_client = None
        print("⚠️ Failed to initialize R2 client:", e)
else:
    print("⚠️ R2 not configured - continuing with Redis only")

# --------- Middleware: limit upload size ----------
@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    content_length = request.headers.get("Content-Length")
    if content_length:
        try:
            if int(content_length) > MAX_UPLOAD_SIZE:
                return JSONResponse(
                    status_code=413,
                    content={"detail": f"Upload too large. Max {MAX_UPLOAD_SIZE} bytes."},
                )
        except ValueError:
            pass
    return await call_next(request)

# --------- Helpers ----------
def read_docx_from_bytes(b: bytes) -> List[str]:
    bio = io.BytesIO(b)
    doc = docx.Document(bio)
    paragraphs = [p.text.strip() for p in doc.paragraphs if p.text and p.text.strip()]
    return paragraphs

def read_excel_from_bytes(b: bytes) -> List[str]:
    bio = io.BytesIO(b)
    xls = pd.ExcelFile(bio)
    texts = []
    for sheet in xls.sheet_names:
        df = xls.parse(sheet, dtype=str).fillna("")
        for row in df.values:
            row_text = " ".join([str(cell).strip() for cell in row if str(cell).strip()])
            if row_text:
                texts.append(row_text)
    return texts

# --------- FAISS helpers ----------
def save_index_and_docs_to_redis(user_id: str, index, documents: List[str]):
    serialized = faiss.serialize_index(index)
    idx_bytes = serialized.tobytes() if isinstance(serialized, np.ndarray) else bytes(serialized)
    redis_client.set(f"rag:{user_id}:index", idx_bytes)
    redis_client.set(f"rag:{user_id}:documents", json.dumps(documents, ensure_ascii=False).encode("utf-8"))

def load_index_and_docs_from_redis(user_id: str):
    idx_data = redis_client.get(f"rag:{user_id}:index")
    docs_data = redis_client.get(f"rag:{user_id}:documents")
    if not idx_data or not docs_data:
        return None
    index = faiss.deserialize_index(np.frombuffer(idx_data, dtype="uint8"))
    documents = json.loads(docs_data.decode("utf-8"))
    return {"index": index, "documents": documents}

def backup_index_and_docs_to_r2(user_id: str, index, documents: List[str]):
    if not r2_client:
        return
    serialized = faiss.serialize_index(index)
    idx_bytes = serialized.tobytes() if isinstance(serialized, np.ndarray) else bytes(serialized)
    r2_client.upload_fileobj(io.BytesIO(idx_bytes), R2_BUCKET, f"{user_id}/index.faiss")
    r2_client.upload_fileobj(io.BytesIO(json.dumps(documents, ensure_ascii=False).encode("utf-8")), R2_BUCKET, f"{user_id}/docs.json")

def restore_from_r2_to_redis(user_id: str):
    if not r2_client:
        return None
    try:
        idx_bio = io.BytesIO()
        r2_client.download_fileobj(R2_BUCKET, f"{user_id}/index.faiss", idx_bio)
        index = faiss.deserialize_index(np.frombuffer(idx_bio.getvalue(), dtype="uint8"))
        docs_bio = io.BytesIO()
        r2_client.download_fileobj(R2_BUCKET, f"{user_id}/docs.json", docs_bio)
        documents = json.loads(docs_bio.getvalue().decode("utf-8"))
        save_index_and_docs_to_redis(user_id, index, documents)
        return {"index": index, "documents": documents}
    except Exception:
        return None

# --------- Upload Endpoint ----------
@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...), user_id: Optional[str] = "default_user"):
    existing = load_index_and_docs_from_redis(user_id)
    index = existing["index"] if existing else None
    documents = existing["documents"] if existing else []

    all_texts = []
    for upload in files:
        content = await upload.read()
        filename = upload.filename.lower()
        if filename.endswith(".docx"):
            texts = read_docx_from_bytes(content)
        elif filename.endswith((".xls", ".xlsx")):
            texts = read_excel_from_bytes(content)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {upload.filename}")
        all_texts.extend(texts)

        if r2_client:
            r2_key = f"{user_id}/files/{uuid.uuid4().hex}_{upload.filename}"
            r2_client.upload_fileobj(io.BytesIO(content), R2_BUCKET, r2_key)

    if not all_texts:
        raise HTTPException(status_code=400, detail="No text extracted.")

    embeddings = [client.embeddings.create(model="text-embedding-3-small", input=t).data[0].embedding for t in all_texts]
    new_vecs = np.array(embeddings, dtype="float32")

    if index is None:
        index = faiss.IndexFlatL2(new_vecs.shape[1])
    index.add(new_vecs)
    documents.extend(all_texts)

    save_index_and_docs_to_redis(user_id, index, documents)
    backup_index_and_docs_to_r2(user_id, index, documents)

    return {"message": f"Uploaded {len(files)} files. Total stored texts: {len(documents)}"}

# --------- Ask Endpoint ----------
@app.post("/ask")
async def ask_question(question: str, user_id: str = "default_user", top_k: int = 3):
    data = load_index_and_docs_from_redis(user_id) or restore_from_r2_to_redis(user_id)
    if not data:
        return JSONResponse(status_code=404, content={"message": "No data found for this user."})

    index = data["index"]
    documents = data["documents"]

    q_emb = client.embeddings.create(model="text-embedding-3-small", input=question).data[0].embedding
    D, I = index.search(np.array([q_emb], dtype="float32"), top_k)
    context = "\n\n".join([documents[i] for i in I[0] if i < len(documents)])

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Та Монгол хэл дээр хариулна уу."},
            {"role": "user", "content": f"Асуулт: {question}\n\nКонтекст:\n{context}"}
        ],
        temperature=0.2,
    )

    return {"answer": response.choices[0].message.content, "documents": context}

# --------- Health ----------
@app.get("/health")
async def health_check():
    return {"status": "healthy", "redis": redis_client.ping(), "r2": bool(r2_client)}

# --------- Root ----------
@app.get("/")
async def root():
    return {"ok": True}
