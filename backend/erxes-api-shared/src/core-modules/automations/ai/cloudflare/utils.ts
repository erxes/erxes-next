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
      throw error;
    });

  if (!res.Body) {
    throw new Error('No body returned from S3 object');
  }

  const rawContent = await res.Body.transformToString();

  // if (key.includes('.pdf')) {
  //   const cleaned = rawContent.replace(/^\uFEFF/, '').trim();
  //   return await parseStringPromise(cleaned, {
  //     explicitArray: false, // optional: simplify output
  //     mergeAttrs: true, // optional: flatten attributes
  //   });
  // }

  // // Check if this is a binary file (Word, PDF, etc.)
  // if (
  //   !key.includes('pdf') &&
  //   (rawContent.includes('PK') ||
  //     rawContent.includes('<?xml') ||
  //     rawContent.includes('word/'))
  // ) {
  //   // For binary files, return a message indicating the file type
  //   const fileExtension = key.split('.').pop()?.toLowerCase();
  //   return `This is a ${
  //     fileExtension?.toUpperCase() || 'binary'
  //   } file. The content cannot be directly extracted for AI processing. Please upload a text-based document (TXT, DOCX, PDF) for better results.`;
  // }

  // For text files, return the content as is
  return rawContent;
};

function chunkText(text: string, maxLength = 1000): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + maxLength));
    start += maxLength;
  }

  return chunks;
}
export async function embedTextCF(
  text: string,
  onProgress?: (info: {
    total: number;
    processed: number;
    failed: number;
    currentIndex?: number;
    message?: string;
  }) => void,
): Promise<number[]> {
  const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID } = process.env;

  if (!CLOUDFLARE_API_TOKEN) {
    throw new Error('CLOUDFLARE_API_TOKEN is required for AI embedding');
  }

  const MAX_CONCURRENCY = 4;
  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF_MS = 500;
  const REQUEST_TIMEOUT_MS = 30000;

  async function requestWithRetry(payload: { text: string }, index: number) {
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const resp = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/baai/bge-large-en-v1.5`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          },
        );
        clearTimeout(timeout);

        if (!resp.ok) {
          // 4xx other than 429 usually indicates a permanent error for this payload
          if (resp.status >= 400 && resp.status < 500 && resp.status !== 429) {
            const bodyText = await resp.text().catch(() => '');
            throw new Error(
              `Cloudflare AI API error on chunk ${index + 1}: ${resp.status} ${
                resp.statusText
              }${bodyText ? ` - ${bodyText}` : ''}`,
            );
          }

          // Retry on 429/5xx
          throw new Error(
            `Transient Cloudflare AI API error on chunk ${index + 1}: ${
              resp.status
            } ${resp.statusText}`,
          );
        }

        // Parse JSON safely
        const data = (await resp.json().catch(() => null)) as {
          result?: { data?: number[][] };
        } | null;

        if (!data || !data.result || !Array.isArray(data.result.data)) {
          throw new Error(`Invalid response structure on chunk ${index + 1}`);
        }

        const vector = data.result.data[0];
        if (!Array.isArray(vector)) {
          throw new Error(`Missing embedding vector on chunk ${index + 1}`);
        }
        return vector as number[];
      } catch (error) {
        clearTimeout(timeout);
        attempt += 1;
        if (attempt > MAX_RETRIES) {
          // Do not fail the whole run; surface detailed error
          throw error;
        }
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        const jitter = Math.floor(Math.random() * 200);
        await new Promise((resolve) => setTimeout(resolve, backoff + jitter));
      }
    }

    // Fallback (unreachable)
    return [] as number[];
  }

  const chunks = chunkText(text, 1000).filter((c) => c.trim().length > 0);

  const shouldConsoleLog = process.env.AUTOMATIONS_EMBED_LOGS === '1';
  const logProgress = (info: {
    total: number;
    processed: number;
    failed: number;
    currentIndex?: number;
    message?: string;
  }) => {
    if (onProgress) {
      onProgress(info);
      return;
    }
    if (shouldConsoleLog) {
      const percent = info.total
        ? Math.floor(((info.processed + info.failed) / info.total) * 100)
        : 0;
      const parts = [
        `embed: ${percent}% (${info.processed}/${info.total})`,
        info.failed ? `failed=${info.failed}` : '',
        typeof info.currentIndex === 'number'
          ? `chunk=${info.currentIndex + 1}`
          : '',
        info.message || '',
      ].filter(Boolean);
      // eslint-disable-next-line no-console
      console.log(parts.join(' | '));
    }
  };

  // Bounded concurrency pool
  let nextIndex = 0;
  const embeddings: number[] = [];
  const errors: { index: number; error: unknown }[] = [];
  let processed = 0;
  let failed = 0;

  logProgress({
    total: chunks.length,
    processed,
    failed,
    message: 'start',
  });

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;
      if (currentIndex >= chunks.length) return;
      nextIndex += 1;

      const chunk = chunks[currentIndex];
      try {
        const vector = await requestWithRetry({ text: chunk }, currentIndex);
        // Append preserving overall order is not required for concatenation
        embeddings.push(...vector);
        processed += 1;
        logProgress({
          total: chunks.length,
          processed,
          failed,
          currentIndex,
          message: 'ok',
        });
      } catch (err) {
        errors.push({ index: currentIndex, error: err });
        failed += 1;
        logProgress({
          total: chunks.length,
          processed,
          failed,
          currentIndex,
          message: `error: ${String((err as Error)?.message || err)}`,
        });
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(MAX_CONCURRENCY, chunks.length) },
    () => worker(),
  );
  await Promise.all(workers);

  if (errors.length > 0) {
    // Surface the first error with context while still returning partial work is not ideal;
    // prefer failing fast to keep data quality guarantees.
    const first = errors[0];
    throw new Error(
      `Failed to embed file: ${String(
        (first.error as Error)?.message || first.error,
      )}`,
    );
  }

  logProgress({
    total: chunks.length,
    processed,
    failed,
    message: 'done',
  });

  return embeddings;
}

// Returns one embedding vector per chunk (not concatenated)
export async function embedTextCFChunks(
  text: string,
  onProgress?: (info: {
    total: number;
    processed: number;
    failed: number;
    currentIndex?: number;
    message?: string;
  }) => void,
): Promise<number[]> {
  console.log({ text });
  const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID } = process.env;

  if (!CLOUDFLARE_API_TOKEN) {
    throw new Error('CLOUDFLARE_API_TOKEN is required for AI embedding');
  }

  const MAX_CONCURRENCY = 4;
  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF_MS = 500;
  const REQUEST_TIMEOUT_MS = 30000;

  async function requestWithRetry(payload: { text: string }, index: number) {
    let attempt = 0;
    while (attempt <= MAX_RETRIES) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const resp = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/baai/bge-large-en-v1.5`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          },
        );
        clearTimeout(timeout);

        if (!resp.ok) {
          if (resp.status >= 400 && resp.status < 500 && resp.status !== 429) {
            const bodyText = await resp.text().catch(() => '');
            throw new Error(
              `Cloudflare AI API error on chunk ${index + 1}: ${resp.status} ${
                resp.statusText
              }${bodyText ? ` - ${bodyText}` : ''}`,
            );
          }
          throw new Error(
            `Transient Cloudflare AI API error on chunk ${index + 1}: ${
              resp.status
            } ${resp.statusText}`,
          );
        }

        const data = (await resp.json().catch(() => null)) as {
          result?: { data?: number[][] };
        } | null;
        if (!data || !data.result || !Array.isArray(data.result.data)) {
          throw new Error(`Invalid response structure on chunk ${index + 1}`);
        }
        const vector = data.result.data[0];
        if (!Array.isArray(vector)) {
          throw new Error(`Missing embedding vector on chunk ${index + 1}`);
        }
        return vector as number[];
      } catch (error) {
        clearTimeout(timeout);
        attempt += 1;
        if (attempt > MAX_RETRIES) {
          throw error;
        }
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        const jitter = Math.floor(Math.random() * 200);
        await new Promise((resolve) => setTimeout(resolve, backoff + jitter));
      }
    }
    return [] as number[];
  }

  const chunks = chunkText(text, 1000).filter((c) => c.trim().length > 0);
  const logProgress = (info: {
    total: number;
    processed: number;
    failed: number;
    currentIndex?: number;
    message?: string;
  }) => {
    if (onProgress) {
      onProgress(info);
      return;
    }
    const percent = info.total
      ? Math.floor(((info.processed + info.failed) / info.total) * 100)
      : 0;
    const parts = [
      `embed-chunks: ${percent}% (${info.processed}/${info.total})`,
      info.failed ? `failed=${info.failed}` : '',
      typeof info.currentIndex === 'number'
        ? `chunk=${info.currentIndex + 1}`
        : '',
      info.message || '',
    ].filter(Boolean);
    // eslint-disable-next-line no-console
    console.log(parts.join(' | '));
  };

  let nextIndex = 0;
  let results: number[] = Array(chunks.length);
  const errors: { index: number; error: unknown }[] = [];
  let processed = 0;
  let failed = 0;

  logProgress({ total: chunks.length, processed, failed, message: 'start' });

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;
      if (currentIndex >= chunks.length) return;
      nextIndex += 1;
      try {
        const vector = await requestWithRetry(
          { text: chunks[currentIndex] },
          currentIndex,
        );
        results = [...results, ...vector];
        processed += 1;
        logProgress({
          total: chunks.length,
          processed,
          failed,
          currentIndex,
          message: 'ok',
        });
      } catch (err) {
        errors.push({ index: currentIndex, error: err });
        failed += 1;
        logProgress({
          total: chunks.length,
          processed,
          failed,
          currentIndex,
          message: `error: ${String((err as Error)?.message || err)}`,
        });
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(MAX_CONCURRENCY, chunks.length) },
    () => worker(),
  );
  await Promise.all(workers);

  if (errors.length > 0) {
    const first = errors[0];
    throw new Error(
      `Failed to embed chunks: ${String(
        (first.error as Error)?.message || first.error,
      )}`,
    );
  }

  logProgress({ total: chunks.length, processed, failed, message: 'done' });
  return results;
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
