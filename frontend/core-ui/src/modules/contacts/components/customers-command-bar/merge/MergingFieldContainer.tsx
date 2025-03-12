import { FieldType } from './MergeMap';
import { GENDER_CODE } from './constants';
import { ChoiceboxGroup } from 'erxes-ui/components';

interface MergingFieldContainerProps {
  fieldName: any;
  fieldValue: any;
  type?: FieldType;
  disabled?: boolean;
}

export const MergingFieldContainer = ({
  fieldName,
  fieldValue,
  type = 'string',
  disabled = false,
}: MergingFieldContainerProps) => {
  if (type === 'links') return null;

  return (
    <ChoiceboxGroup.Item
      className="w-full p-3 gap-[6px] h-min justify-center flex-col items-start flex min-h-14 rounded-sm"
      title={fieldName}
      value={fieldValue as string}
      disabled={disabled}
    >
      {/* <span className="text-xs font-semibold text-muted-foreground">
        {fieldName}
      </span> */}
      {type === 'string' && <StringField fieldValue={fieldValue} />}
      {type === 'Array' && <ArrayField fieldValue={fieldValue} />}
      {type === 'sex' && <SexField fieldValue={fieldValue} />}
      {type === 'owner' && <Ownerfield fieldValue={fieldValue} />}
    </ChoiceboxGroup.Item>
  );
};

const StringField = ({ fieldValue }: { fieldValue: string }) => {
  return <span className="font-semibold text-sm">{fieldValue}</span>;
};
const ArrayField = ({ fieldValue }: { fieldValue: string[] }) => {
  return (
    <div className="flex flex-col gap-1">
      {fieldValue.map((value: string, index: number) => (
        <span
          key={`${fieldValue}-${index}`}
          className="font-semibold text-sm text-left"
        >
          {value}
        </span>
      ))}
    </div>
  );
};
const SexField = ({ fieldValue = 0 }: { fieldValue: 0 | 1 | 2 | 9 }) => {
  return (
    <span className="font-semibold text-sm">{GENDER_CODE[fieldValue]}</span>
  );
};

const Ownerfield = ({
  fieldValue,
}: {
  fieldValue: { _id: string; username: string };
}) => {
  return <span className="font-semibold text-sm">{fieldValue?.username}</span>;
};
