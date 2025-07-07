export const extractPhoneNumberFromCounterpart = (counterpart: string) => {
  if (!counterpart) return '';
  const startIndex = counterpart.indexOf(':') + 1;
  const endIndex = counterpart.indexOf('@');
  if (startIndex >= endIndex || startIndex === -1 || endIndex === -1) return '';
  return counterpart.slice(startIndex, endIndex);
};
