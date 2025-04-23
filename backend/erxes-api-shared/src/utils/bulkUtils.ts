import { chunkArray } from '@/utils/utils';
import { Readable, Transform } from 'stream';

export const stream = async <T>(
  executeChunk: (chunk: T[]) => Promise<void>,
  transformCallback: (variables: any, root: T) => void,
  generateChildStream: () => { cursor: () => Readable },
  chunkSize: number,
): Promise<'done'> => {
  const variables: { parentIds?: T[] } = {};

  const onFinishPiping = async () => {
    if (variables.parentIds) {
      const chunks = chunkArray(variables.parentIds, chunkSize);

      for (const chunk of chunks) {
        await executeChunk(chunk);
      }
    }
  };

  const parentTransformerStream = new Transform({
    objectMode: true,
    transform(root: T, _encoding, callback) {
      transformCallback(variables, root);
      callback();
    },
  });

  const childCursor = generateChildStream().cursor();

  try {
    await new Promise<void>((resolve, reject) => {
      childCursor.pipe(parentTransformerStream);

      parentTransformerStream.on('finish', async () => {
        await onFinishPiping();
        resolve();
      });

      parentTransformerStream.on('error', reject);
    });

    return 'done';
  } catch (error) {
    parentTransformerStream.destroy();
    throw error;
  } finally {
    if (typeof childCursor.destroy === 'function') {
      childCursor.destroy();
    }
  }
};
