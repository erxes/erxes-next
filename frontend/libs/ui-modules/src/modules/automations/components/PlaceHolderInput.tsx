import { Input } from 'erxes-ui';
import { Attributes } from './Attributes';
import { IField } from '../../segments/types';

type Props = {
  propertyType: string;
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  selectedField?: IField;
  fieldType?: string;
  onlySet?: boolean;
  ref?: any;
};

export const PlaceHolderInput = ({
  propertyType,
  value,
  onChange,
  onlySet,
  ref,
  isDisabled,
  fieldType,
  selectedField,
}: Props) => {
  const getComma = (preValue: any) => {
    if (fieldType === 'select' && preValue) {
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
        disabled={isDisabled}
        ref={ref}
      />
      <Attributes
        ref={ref}
        selectedField={selectedField}
        contentType={propertyType}
        onSelect={onSelect}
      />
    </div>
  );
};
