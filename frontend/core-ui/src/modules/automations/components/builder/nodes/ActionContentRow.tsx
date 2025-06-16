export const ActionContentRow = ({
  fieldName,
  content,
}: {
  fieldName: string;
  content: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between text-slate-600 text-xs w-max">
      <span className="font-mono">{fieldName}:</span>
      <span className="font-mono">{content}</span>
    </div>
  );
};
