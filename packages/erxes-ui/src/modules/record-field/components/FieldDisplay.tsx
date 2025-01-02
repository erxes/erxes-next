import HandlerDisplay from 'erxes-ui/modules/record-field/meta-types/components/HandlerDisplay';
import { DateDisplay } from 'erxes-ui/modules/record-field/meta-types/components/DateDisplay';
import RecordFieldCurrencyDisplay from 'erxes-ui/modules/record-field/meta-types/components/CurrencyDisplay';
import { ChipFieldDisplay } from 'erxes-ui/modules/record-field/meta-types/components/ChipFieldDisplay';
import { MultiSelectFieldDisplay } from 'erxes-ui/modules/record-field/meta-types/components/MultiSelectFieldDisplay';

export const FieldDisplay = ({ type }: { type: string }) => {
  if (type === 'handle') {
    return <HandlerDisplay />;
  }
  if (type === 'date') {
    return <DateDisplay />;
  }

  if (type === 'currency') {
    return <RecordFieldCurrencyDisplay />;
  }

  if (type === 'chip') {
    return <ChipFieldDisplay />;
  }

  if (type === 'multiselect') {
    return <MultiSelectFieldDisplay />;
  }

  return null;
};
