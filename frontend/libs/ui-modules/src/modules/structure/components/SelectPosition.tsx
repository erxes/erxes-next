import React, { useState } from 'react';
import { IPosition } from '../types/Position';
import { SelectPositionContext } from '../contexts/SelectPositionContext';
import {
  cn,
  Combobox,
  Command,
  Popover,
  Skeleton,
  TextOverflowTooltip,
} from 'erxes-ui';
import { useSelectPositionContext } from '../hooks/useSelectPositionContext';
import { usePositionById } from '../hooks/usePositionById';
import { usePositions } from '../hooks/usePositions';

export const SelectPosition = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    value?: string;
    onValueChange: (value: string) => void;
  }
>((props, ref) => {
  const [_open, _setOpen] = useState(false);
  const { value, onValueChange, className } = props;
  return (
    <SelectBranchProvider>
      <Popover open={_open} onOpenChange={_setOpen}>
        <Combobox.Trigger className={cn('w-full', className)} ref={ref}>
          <SelectPositionValue value={value} />
        </Combobox.Trigger>
        <Combobox.Content>
          <PositionsList
            renderItem={(position) => (
              <SelectPositionItem
                key={position._id}
                position={position}
                onValueChange={(value) => {
                  onValueChange(value);
                  _setOpen(false);
                }}
              />
            )}
          />
        </Combobox.Content>
      </Popover>
    </SelectBranchProvider>
  );
});

export const SelectBranchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedPosition, setSelectedPosition] = useState<
    IPosition | undefined
  >(undefined);
  return (
    <SelectPositionContext.Provider
      value={{ selectedPosition, setSelectedPosition }}
    >
      {children}
    </SelectPositionContext.Provider>
  );
};

const SelectPositionValue = ({ value }: { value?: string }) => {
  const { selectedPosition } = useSelectPositionContext();
  const { positionDetail, loading } = usePositionById({
    variables: { id: value },
    skip: selectedPosition || !value,
  });
  if (loading) return <Skeleton className="h-4 w-32 overflow-hidden" />;
  return (
    <Combobox.Value
      value={selectedPosition?.title || positionDetail?.title}
      placeholder="Select Position"
    />
  );
};

const SelectPositionItem = ({
  position,
  onValueChange,
}: {
  position: IPosition;
  onValueChange: (value: string) => void;
}) => {
  const { setSelectedPosition, selectedPosition } = useSelectPositionContext();
  return (
    <Command.Item
      value={`${position.title} - ${position.code}`}
      onSelect={() => {
        setSelectedPosition(position);
        onValueChange(position._id);
      }}
    >
      <span className="text-muted-foreground">{position.code}</span>
      <TextOverflowTooltip value={position.title} />
      <Combobox.Check checked={selectedPosition?._id === position._id} />
    </Command.Item>
  );
};

export const PositionsList = ({
  renderItem,
}: {
  renderItem: (position: IPosition) => React.ReactNode;
}) => {
  const { positions, loading } = usePositions();

  return (
    <Command>
      <Command.Input placeholder="Search position" />
      <Command.List>
        <Combobox.Empty loading={loading} />
        {positions?.map((position: IPosition) => renderItem(position))}
      </Command.List>
    </Command>
  );
};
