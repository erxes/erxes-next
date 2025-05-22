import * as path from 'path';

export const sanitizeKey = (key: string): string => {
  // Disallow empty keys
  if (!key) throw new Error('Key cannot be empty');

  // Disallow protocol schemes to prevent external URLs
  if (/^https?:\/\//i.test(key)) {
    throw new Error('Invalid key: protocol scheme not allowed');
  }

  // Disallow path traversal sequences
  if (key.includes('..')) {
    throw new Error('Invalid key: path traversal is not allowed');
  }

  // Allow only alphanumeric, slash, dash, underscore, and dot characters
  // Adjust this regex based on your expected key format
  if (!/^[a-zA-Z0-9/_\-.]+$/.test(key)) {
    throw new Error('Invalid key: contains disallowed characters');
  }

  // Normalize the key to remove redundant slashes or segments
  // This uses path.posix to ensure forward slash normalization regardless of OS
  const normalizedKey = path.posix.normalize(key);

  // After normalization, check again for path traversal
  if (normalizedKey.startsWith('..') || normalizedKey.includes('../')) {
    throw new Error('Invalid key: path traversal detected after normalization');
  }

  return normalizedKey;
};
