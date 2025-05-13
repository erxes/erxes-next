import React, { useState } from 'react';
import { Combobox, Command, Popover, TextOverflowTooltip } from 'erxes-ui';
import { useVatRows } from '../hooks/useVatRows';
import { useVatValue } from '../hooks/useVatValue';
import { IVatRow } from '../types/VatRow';

export const SelectVat = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentProps<typeof Combobox.Trigger> & {
    value?: string;
    onValueChange: (value: string) => void;
  }
>(({ value, onValueChange, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedVat, setSelectedVat] = useState<IVatRow | undefined>(undefined);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Combobox.Trigger ref={ref} {...props}>
        <SelectVatValue vatRowId={value} vatRow={selectedVat} />
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
  selectedVat: IVatRow | undefined;
  setSelectedVat: (vatRow: IVatRow) => void;
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
  vatRowId,
  vatRow,
}: {
  vatRowId?: string;
  vatRow?: IVatRow;
}) => {
  const { vatRowDetail, loading } = useVatValue({
    variables: {
      id: vatRowId,
    },
    skip: !vatRowId || !!vatRow,
  });

  if (!vatRow?.name || !vatRowDetail?.name) {
    return (
      <Combobox.Value
        value={vatRow?.name || vatRowDetail?.name}
        placeholder="Select Vat"
        loading={loading}
      />
    );
  }

  return (
    <div className="inline-flex gap-2">
      <span className="text-muted-foreground">{vatRow?.number}</span>
      <Combobox.Value value={vatRow?.name || vatRowDetail?.name} />
    </div>
  );
};
