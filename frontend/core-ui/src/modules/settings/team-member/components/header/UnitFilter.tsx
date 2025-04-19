import {
  Combobox,
  Command,
  Filter,
  Skeleton,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import { SelectUnitItem, SelectUnitProvider, useUnits } from 'ui-modules';

export function UnitFilter() {
  const { units, loading, error } = useUnits();
  const [unitId, setUnitId] = useQueryState<string>('unitId');
  const { resetFilterState } = useFilterContext();

  if (loading) {
    return (
      <div className="py-4 px-2">
        <Skeleton className="w-full h-32" />
      </div>
    );
  }

  const selectedUnit = units?.find((unit) => unit._id === unitId);
  return (
    <SelectUnitProvider>
      <Filter.View filterKey={'unitId'}>
        <Command shouldFilter={false} className="bg-transparent">
          <Combobox.Empty error={error} loading={loading} />
          <Command.List className="py-0 pr-0">
            {units &&
              units.map((unit) => (
                <SelectUnitItem
                  key={unit?._id}
                  unit={unit}
                  selected={selectedUnit?._id === unit?._id}
                  onValueChange={(value) => {
                    setUnitId(value);
                    resetFilterState();
                  }}
                />
              ))}
          </Command.List>
        </Command>
      </Filter.View>
    </SelectUnitProvider>
  );
}
