import { CurrencyInput } from 'erxes-ui/modules/record-field/meta-inputs/components/CurrencyInput';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import { ChipFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/ChipFieldInput';
import { SelectFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/SelectFieldInput';
import { MultiSelectFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/MultiSelectFieldInput';

export function FieldInput({ type }: { type: string }) {
  if (type === 'currency') {
    return <CurrencyInput />;
  }
  if (type === 'text') {
    return <TextFieldInput />;
  }
  if (type === 'chip') {
    return <ChipFieldInput />;
  }
  if (type === 'select') {
    return <SelectFieldInput />;
  }
  if (type === 'multiselect') {
    return <MultiSelectFieldInput />;
  }
  return <></>;
}
