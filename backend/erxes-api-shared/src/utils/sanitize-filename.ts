const Segmenter = (Intl as any).Segmenter;
const segmenter = new Segmenter(undefined, { granularity: 'grapheme' });

const truncate = (input: string, length: number): string => {
  const segItr = segmenter.segment(input);
  const segArr = Array.from(segItr, ({ segment }) => segment);
  return segArr.slice(0, length).join('');
};

// Use a non-backtracking approach to remove trailing spaces and dots
const removeTrailingSpacesAndDots = (str: string): string => {
  let end = str.length;
  while (end > 0 && (str[end - 1] === ' ' || str[end - 1] === '.')) {
    end--;
  }
  return str.substring(0, end);
};

const illegalRe = /[/?<>\\:*|"]/g;
// eslint-disable-next-line no-control-regex
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

export const sanitizeFilename = (input: string) => {
  if (typeof input !== 'string') {
    throw new Error('Input must be string');
  }

  let sanitized = input
    .replace(illegalRe, '')
    .replace(controlRe, '')
    .replace(reservedRe, '')
    .replace(windowsReservedRe, '');

  sanitized = removeTrailingSpacesAndDots(sanitized);

  return truncate(sanitized, 255);
};
