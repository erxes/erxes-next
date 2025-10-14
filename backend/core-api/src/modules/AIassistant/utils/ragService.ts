import axios from 'axios';

const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:8000';

export interface RagUploadResponse {
  message: string;
  org_id: string;
}

export interface RagAskResponse {
  answer: string;
  source_documents: string[];
  org_id: string;
}

export const uploadToRag = async (file: File, orgId?: string): Promise<RagUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (orgId) {
    formData.append('org_id', orgId);
  }

  try {
    const response = await axios.post(`${RAG_API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`RAG Upload Error: ${error.response?.data?.error || error.message}`);
  }
};

export const askRag = async (question: string, orgId: string, topK: number = 3): Promise<RagAskResponse> => {
  try {
    const response = await axios.post(`${RAG_API_URL}/ask`, {
      question,
      org_id: orgId,
      top_k: topK
    });
    return response.data;
  } catch (error) {
    throw new Error(`RAG Ask Error: ${error.response?.data?.detail || error.message}`);
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${RAG_API_URL}/health`);
    return response.data.status === 'healthy';
  } catch (error) {
    return false;
  }
};