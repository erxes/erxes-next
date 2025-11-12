import { uploadToRag, askRag } from '../../utils/ragService';

export const mutationResolvers = {
  // Upload a file to RAG
  async ragUploadFile(_root, { file, userId }, { user, models }) {
    const { createReadStream, filename, mimetype } = await file;

    // Convert stream to buffer for upload
    const stream = createReadStream();
    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    // Combine chunks into a single ArrayBuffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combinedArray = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combinedArray.set(chunk, offset);
      offset += chunk.length;
    }

    // Create a File object for upload
    const fileObj = new File([combinedArray.buffer], filename, { type: mimetype });

    // Upload to RAG service
    const result = await uploadToRag(fileObj, userId);

    // Save interaction in database
    const interaction = await models.RagInteractions.create({
      question: `Uploaded file: ${filename}`,
      answer: JSON.stringify(result),
      userId: user._id,
    });

    return result;
  },

  // Ask a question to RAG
  async ragAskQuestion(_root, { question, userId, topK }, { user, models }) {
    const response = await askRag(question, userId, topK);

    // Store interaction in database
    const interaction = await models.RagInteractions.create({
      question,
      answer: response.answer,
      sourceDocuments: response.source_documents || [],
      userId: user._id,
    });

    return {
      answer: response.answer,
      sourceDocuments: response.source_documents || [],
      userId: response.org_id
    };
  }
};
