const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

const truncate = (input: string, length: number): string => {
  const segItr = segmenter.segment(input);
  const segArr = Array.from(segItr, ({ segment }) => segment);
  return segArr.slice(0, length).join('');
};

const illegalRe = /[/?<>\\:*|"]/g;
// eslint-disable-next-line no-control-regex
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[. ]+$/;

export const sanitizeFilename = (input: string) => {
  if (typeof input !== 'string') {
    throw new Error('Input must be string');
  }
  const sanitized = input
    .replace(illegalRe, '')
    .replace(controlRe, '')
    .replace(reservedRe, '')
    .replace(windowsReservedRe, '')
    .replace(windowsTrailingRe, '');
  return truncate(sanitized, 255);
};
