export const ManagePropertiesNodeContent = ({ config }: any) => {
  const { module, rules = [] } = config || {};
  return (
    <>
      <div className="flex text-slate-600 text-xs ">
        <span className="font-mono">Content Type: </span>
        <span className="font-mono capitalize">{`${
          (module || '').split(':')[1]
        }`}</span>
      </div>
      {rules
        .filter(({ field, value }: any) => field && value)
        .map(({ field, value }: any, index: number) => (
          <div
            key={index}
            className="flex justify-between text-slate-600 text-xs w-max"
          >
            <span className="font-mono">{field}:</span>
            <span className="font-mono">{value}</span>
          </div>
        ))}
    </>
  );
};
