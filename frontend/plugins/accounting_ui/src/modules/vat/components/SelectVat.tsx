import React, { useState } from 'react';
import { Combobox, Command, Popover, TextOverflowTooltip } from 'erxes-ui';
import { useVatRows } from '../hooks/useVatRows';
import { useVatValue } from '../hooks/useVatValue';
import { IVat } from '../types/Vat';

export const SelectVat = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentProps<typeof Combobox.Trigger> & {
    value?: string;
    onValueChange: (value: string) => void;
  }
>(({ value, onValueChange, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedVat, setSelectedVat] = useState<IVat | undefined>(undefined);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Combobox.Trigger ref={ref} {...props}>
        <SelectVatValue vatId={value} vat={selectedVat} />
      </Combobox.Trigger>
      <Combobox.Content>
        <SelectVatList
          selectedVat={selectedVat}
          setSelectedVat={(vat) => {
            setSelectedVat(vat);
            onValueChange(vat._id);
          }}
        />
      </Combobox.Content>
    </Popover>
  );
});

export const SelectVatList = ({
  selectedVat,
  setSelectedVat,
}: {
  selectedVat: IVat | undefined;
  setSelectedVat: (vat: IVat) => void;
}) => {
  const [searchValue, setSearchValue] = useState('');
  const { vatRows, totalCount, loading, error, handleFetchMore } = useVatRows({
    variables: {
      searchValue,
    },
  });

  return (
    <Command shouldFilter={false}>
      <Command.Input
        placeholder="Search vat"
        value={searchValue}
        onValueChange={(value) => setSearchValue(value)}
      />
      <Command.List>
        <Combobox.Empty loading={loading} error={error} />
        {vatRows?.map((vat) => (
          <Command.Item
            key={vat._id}
            value={vat._id}
            onSelect={() => setSelectedVat(vat)}
          >
            <TextOverflowTooltip value={vat.name} />
            <Combobox.Check checked={selectedVat?._id === vat._id} />
          </Command.Item>
        ))}
        <Combobox.FetchMore
          totalCount={totalCount || 0}
          currentLength={vatRows?.length || 0}
          fetchMore={handleFetchMore}
        />
      </Command.List>
    </Command>
  );
};

export const SelectVatValue = ({
  vatId,
  vat,
}: {
  vatId?: string;
  vat?: IVat;
}) => {
  const { vatRowDetail, loading } = useVatValue({
    variables: {
      id: vatId,
    },
    skip: !vatId || !!vat,
  });

  if (!vat?.name || !vatRowDetail?.name) {
    return (
      <Combobox.Value
        value={vat?.name || vatRowDetail?.name}
        placeholder="Select Vat"
        loading={loading}
      />
    );
  }

  return (
    <div className="inline-flex gap-2">
      <span className="text-muted-foreground">{vat?.number}</span>
      <Combobox.Value value={vat?.name || vatRowDetail?.name} />
    </div>
  );
};
