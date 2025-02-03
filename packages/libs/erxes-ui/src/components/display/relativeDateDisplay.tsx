import { isUndefinedOrNull } from 'erxes-ui/utils';

import { formatDateISOStringToRelativeDate } from '../../localization/utils/formatDateISOStringToRelativeDate';

export const RelativeDateDisplay = ({ value }: { value: string }) => {
  if (isUndefinedOrNull(value)) {
    return null;
  }

  const relativeDate = formatDateISOStringToRelativeDate(value);
  return relativeDate;
};
