import { format } from 'date-fns';
import { Tooltip } from 'erxes-ui/components';
import { isUndefinedOrNull } from 'erxes-ui/utils';
import { formatDateISOStringToRelativeDate } from 'erxes-ui/utils/localization/formatDateISOStringToRelativeDate';
import { Except } from 'type-fest';

export const RelativeDateDisplay = ({
  value,
  ...props
}: Except<React.ComponentPropsWithoutRef<typeof Tooltip.Trigger>, 'value'> & {
  value: string;
}) => {
  if (isUndefinedOrNull(value)) {
    return null;
  }

  const relativeDate = formatDateISOStringToRelativeDate(value);

  return (
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger className="truncate" {...props}>
          {relativeDate}
        </Tooltip.Trigger>
        <Tooltip.Content>{format(value, 'MMM dd, yyyy')}</Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  );
};

RelativeDateDisplay.displayName = 'RelativeDateDisplay';
