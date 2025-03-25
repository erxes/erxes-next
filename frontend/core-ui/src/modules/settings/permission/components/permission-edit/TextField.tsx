import { InlineCell, InlineCellDisplay } from 'erxes-ui';

interface TextFieldProps {
  placeholder?: string;
  value: string;
  fieldId?: string;
  _id: string;
  className?: string;
  name: string;
}

export const TextField = ({
  value,
  fieldId,
  _id,
  className,
  name,
}: TextFieldProps) => {
  return (
    <InlineCell
      name={name}
      recordId={_id}
      fieldId={fieldId}
      display={() => (
        <InlineCellDisplay value={value} id={_id} className={className}>
          <span className="truncate">{value}</span>
        </InlineCellDisplay>
      )}
    />
  );
};
