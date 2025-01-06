import { CurrencyInput } from '../meta-inputs/components/CurrencyInput';

export function FieldInput({ type }: { type: string }) {
  if (type === 'currency') {
    return <CurrencyInput />;
  }
  return <></>;
}
