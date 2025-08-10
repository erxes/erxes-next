export const DelayNodeContent = ({ config }: any) => {
  const { value, type } = config || {};
  return (
    <div className="flex justify-between text-slate-600 text-xs">
      <span className="font-mono">Wait for:</span>
      <span className="font-mono">{`${value} ${type}s`}</span>
    </div>
  );
};
