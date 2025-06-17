import { Checkbox, cn, Spinner, TablerIcon } from 'erxes-ui';

type ICondition = {
  type: string;
  label: string;
  icon: string;
  description: string;
};

type Props = {
  conditions: ICondition[];
  setActiveItemType: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onItemCheck: (type: string, isChecked: boolean) => void;
};

export const MessageTriggerConditionsList = ({
  conditions,
  setActiveItemType,
  loading,
  onItemCheck,
}: Props) => {
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {conditions.map(({ label, description, type, icon, isSelected }: any) => (
        <div
          key={type}
          onClick={(e) => {
            e.preventDefault();
            setActiveItemType(type);
          }}
          className={cn(
            `flex flex-row gap-4 items-center p-4 border rounded  transition-all ease-in-out duration-300`,
            {
              'hover:border-blue-500 cursor-pointer': type !== 'getStarted',
              'cursor-not-allowed': type === 'getStarted',
            },
          )}
        >
          <Checkbox
            className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            checked={isSelected}
            onCheckedChange={(checked) => onItemCheck(type, !!checked)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="rounded-full bg-blue-500 text-background p-3">
            <TablerIcon name={icon} />
          </div>
          <div>
            <p className="font-semibold text-muted-foreground text-sm">
              {label}
            </p>
            <span className="font-mono text-muted-foreground text-xs">
              {description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
