import { REACT_APP_API_URL } from 'erxes-ui/utils';
import { isValidURL } from 'erxes-ui/utils/urlParser';

export const readFile = (
  value: string,
  width?: number,
  inline?: boolean
): string => {
  if (
    !value ||
    isValidURL(value) ||
    (typeof value === 'string' && value.includes('http')) ||
    (typeof value === 'string' && value.startsWith('/'))
  ) {
    return value;
  }

  let url = `${REACT_APP_API_URL}/read-file?key=${value}`;

  if (width) {
    url += `&width=${width}`;
  }

  if (inline) {
    url += `&inline=${inline}`;
  }

  return url;
};
