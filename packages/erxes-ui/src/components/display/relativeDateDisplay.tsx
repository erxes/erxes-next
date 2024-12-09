import { isUndefinedOrNull } from 'erxes-ui/utils';
import { formatDateISOStringToRelativeDate } from '../../localization/utils/formatDateISOStringToRelativeDate';

export const RelativeDateDisplay = ({ date }: { date: string }) => {
  if (isUndefinedOrNull(date)) {
    return null;
  }

  const relativeDate = formatDateISOStringToRelativeDate(date);
  return relativeDate;
};
