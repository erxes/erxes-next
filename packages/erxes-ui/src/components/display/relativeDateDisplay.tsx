import { formatDateISOStringToRelativeDate } from '../../localization/utils/formatDateISOStringToRelativeDate';

export const RelativeDateDisplay = ({ date }: { date: string }) => {
  const relativeDate = formatDateISOStringToRelativeDate(date);
  return relativeDate;
};
