import { useMutation, useQuery } from '@apollo/client';
import { RAG_ASK_QUESTION, RAG_UPLOAD_FILE } from '../graphql/mutations';
import { RAG_INTERACTIONS } from '../graphql/queries';
import { RagAskResponse, RagUploadResponse } from '../types';

export const useAIAssistant = () => {
  const [uploadFileMutation] = useMutation<{ ragUploadFile: RagUploadResponse }>(RAG_UPLOAD_FILE);
  const [askQuestionMutation] = useMutation<{ ragAskQuestion: RagAskResponse }>(RAG_ASK_QUESTION);
  
  const { data: interactionsData, loading: interactionsLoading, refetch: refetchInteractions } = 
    useQuery(RAG_INTERACTIONS, {
      variables: { limit: 10 }
    });

  const uploadFile = async (file: File, orgId?: string) => {
    try {
      const result = await uploadFileMutation({
        variables: { file, orgId },
        context: { hasUpload: true }
      });
      return result.data?.ragUploadFile;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const askQuestion = async (question: string, orgId: string, topK: number = 3) => {
    try {
      const result = await askQuestionMutation({
        variables: { question, orgId, topK }
      });
      return result.data?.ragAskQuestion;
    } catch (error) {
      console.error('Ask question failed:', error);
      throw error;
    }
  };

  return {
    uploadFile,
    askQuestion,
    interactions: interactionsData?.ragInteractions || [],
    interactionsLoading,
    refetchInteractions
  };
};