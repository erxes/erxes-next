import { Input } from 'erxes-ui';
import { Attributes } from './Attributes';

type Props = {
  propertyType: string;
  value: string;
  onChange: (value: string) => void;
  selectedOperator: any;
  selectedField: any;
  onlySet?: boolean;
};

export const PlaceHolderInput = ({
  propertyType,
  value,
  onChange,
  selectedOperator,
  selectedField,
  onlySet,
}: Props) => {
  const { value: operatorValue = '', noInput } = selectedOperator || {};
  const { type } = selectedField || {};

  const getComma = (preValue: any) => {
    if (type === 'select' && preValue) {
      return ', ';
    }

    if (preValue) {
      return ' ';
    }

    return '';
  };

  const onSelect = (attribute: string) => {
    if (onlySet) {
      value = `{{ ${attribute} }}`;
    } else {
      value = `${value || ''}${getComma(value)}{{ ${attribute} }}`;
    }
    onChange(value);
  };

  return (
    <div className="flex flex-row items-end gap-2">
      <Input
        value={value}
        placeholder="Value"
        onChange={(e) => onChange(e.target.value)}
        disabled={!operatorValue}
      />
      <Attributes
        selectedField={selectedField}
        selectedOperator={selectedOperator}
        contentType={propertyType}
        onSelect={onSelect}
      />
    </div>
  );
};
