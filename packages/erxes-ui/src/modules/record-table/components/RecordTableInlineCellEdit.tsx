export const RecordTableInlineCellEdit = ({
  value,
  type,
  onValueChange,
}: {
  value: string;
  type: string;
  onValueChange: (value: string) => void;
}) => {
  return <div>{value}</div>;
};
