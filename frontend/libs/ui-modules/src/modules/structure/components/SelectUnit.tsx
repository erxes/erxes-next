import {
  cn,
  Combobox,
  Command,
  Popover,
  Skeleton,
  TextOverflowTooltip,
} from 'erxes-ui';
import React, { useState } from 'react';
import { useSelectUnitContext } from '../hooks/useSelectUnitContext';
import { IUnit } from '../types/Unit';
import { SelectUnitContext } from '../contexts/SelectUnitContext';
import { useUnitById } from '../hooks/useUnitById';
import { useUnits } from '../hooks/useUnits';

export const SelectUnit = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    value?: string;
    onValueChange: (value: string) => void;
  }
>(({ value, onValueChange, ...props }, ref) => {
  const [_open, _setOpen] = useState(false);
  return (
    <SelectUnitProvider>
      <Popover open={_open} onOpenChange={_setOpen}>
        <Combobox.Trigger
          {...props}
          ref={ref}
          className={cn('w-full flex text-left', props.className)}
        >
          {value && <SelectUnitValue value={value} />}
        </Combobox.Trigger>
        <Combobox.Content>
          <UnitList
            renderItem={(unit) => (
              <SelectUnitItem
                key={unit._id}
                unit={unit}
                onValueChange={(value) => {
                  onValueChange(value);
                  _setOpen(false);
                }}
                selected={unit._id === value}
              />
            )}
          />
        </Combobox.Content>
      </Popover>
    </SelectUnitProvider>
  );
});

export const SelectUnitItem = ({
  unit,
  onValueChange,
  selected,
}: {
  unit: IUnit;
  onValueChange: (value: string) => void;
  selected?: boolean | undefined;
}) => {
  const { setSelectedUnit, selectedUnit } = useSelectUnitContext();
  return (
    <Command.Item
      value={unit.title}
      onSelect={() => {
        setSelectedUnit(unit);
        onValueChange(unit._id);
      }}
    >
      <SelectUnitBadge unit={unit} selected={selected} />
    </Command.Item>
  );
};
export const SelectUnitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedUnit, setSelectedUnit] = useState<IUnit | undefined>(
    undefined,
  );
  return (
    <SelectUnitContext.Provider value={{ selectedUnit, setSelectedUnit }}>
      {children}
    </SelectUnitContext.Provider>
  );
};

const SelectUnitValue = ({ value }: { value?: string }) => {
  const { selectedUnit } = useSelectUnitContext();

  const { unitDetail, loading } = useUnitById({
    variables: { _id: value },
    skip: !value,
  });
  if (loading) return <Skeleton className="h-4 w-32 overflow-hidden" />;
  return (
    <Combobox.Value
      placeholder="Select Unit"
      value={unitDetail?.title || selectedUnit?.title}
    />
  );
};

export const UnitList = ({
  renderItem,
}: {
  renderItem: (unit: IUnit) => React.ReactNode;
}) => {
  const { units, loading } = useUnits();
  return (
    <Command>
      <Command.Input placeholder="Search unit" />
      <Command.List>
        <Combobox.Empty loading={loading} />
        {units?.map((unit: IUnit) => renderItem(unit))}
      </Command.List>
    </Command>
  );
};

const SelectUnitBadge = ({
  unit,
  selected,
}: {
  unit?: IUnit;
  selected?: boolean;
}) => {
  if (!unit) return null;

  const { title, code, userCount } = unit;

  return (
    <>
      <div className="flex items-center gap-2 flex-auto overflow-hidden justify-start">
        <div className="text-muted-foreground">{code}</div>
        <TextOverflowTooltip value={title} className="flex-auto" />
      </div>
      {!selected ? (
        userCount > 0 && (
          <div className="text-muted-foreground ml-auto">{userCount}</div>
        )
      ) : (
        <Combobox.Check checked={selected} />
      )}
    </>
  );
};
