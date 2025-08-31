import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

let s3: S3Client | null = null;

const getS3Client = () => {
  if (!s3) {
    // const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;

    // if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    //   throw new Error('R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY are required');
    // }

    s3 = new S3Client({
      region: 'auto',
      endpoint:
        'https://7c8392aff8ac4518aa06dfa4b6337ef2.r2.cloudflarestorage.com',
      credentials: {
        accessKeyId: '6c01855ea38722f12c2f1804b0d38b2b',
        secretAccessKey:
          '7aecba55b155482c5acb2ed303941a4840d2f5917834145162b29205872dff22',
      },
    });
  }
  return s3;
};
export const getFileAsStringFromCF = async (bucket: string, key: string) => {
  const s3Client = getS3Client();
  const res = await s3Client
    .send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    .catch((error) => {
      console.log(`Error fetching file: ${error.message}`);
      throw error;
    });

  if (!res.Body) {
    throw new Error('No body returned from S3 object');
  }

  const rawContent = await res.Body.transformToString();

  // Check if this is a binary file (Word, PDF, etc.)
  if (
    rawContent.includes('PK') ||
    rawContent.includes('<?xml') ||
    rawContent.includes('word/')
  ) {
    // For binary files, return a message indicating the file type
    const fileExtension = key.split('.').pop()?.toLowerCase();
    return `This is a ${
      fileExtension?.toUpperCase() || 'binary'
    } file. The content cannot be directly extracted for AI processing. Please upload a text-based document (TXT, DOCX, PDF) for better results.`;
  }

  // For text files, return the content as is
  return rawContent;
};

export async function embedTextCF(text: string) {
  const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID } = process.env;

  if (!CLOUDFLARE_API_TOKEN) {
    throw new Error('CLOUDFLARE_API_TOKEN is required for AI embedding');
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/baai/bge-large-en-v1.5`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    },
  );

  if (!resp.ok) {
    throw new Error(
      `Cloudflare AI API error: ${resp.status} ${resp.statusText}`,
    );
  }

  const { result } = await resp.json();

  if (!result) {
    throw new Error('No result returned from Cloudflare AI API');
  }

  return result.data[0];
}

export async function generateTextCF(prompt: string) {
  const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID } = process.env;

  if (!CLOUDFLARE_API_TOKEN) {
    throw new Error('CLOUDFLARE_API_TOKEN is required for AI text generation');
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    },
  );

  if (!resp.ok) {
    throw new Error(
      `Cloudflare AI API error: ${resp.status} ${resp.statusText}`,
    );
  }

  const { result } = await resp.json();

  if (!result) {
    throw new Error('No result returned from Cloudflare AI API');
  }

  return result.response;
}
