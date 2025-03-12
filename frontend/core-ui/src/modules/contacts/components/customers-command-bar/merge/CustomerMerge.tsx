import { useState } from 'react';
import { MergeSheet } from './MergeSheet';
import { ICustomer } from '@/contacts/types/customerType';
import { MergingFieldContainer } from './MergingFieldContainer';
import { MergeMap, FieldType } from './MergeMap';
import { ChoiceboxGroup } from 'erxes-ui/components';
interface MergeProps {
  disabled?: boolean;
  customers: ICustomer[];
}

interface FieldMapping {
  displayName: string;
  position: number;
  type: FieldType;
}

export const CustomerMerge = ({ disabled = false, customers }: MergeProps) => {
  if (disabled) return <MergeSheet disabled />;
  const fieldMappings: Record<string, FieldMapping> = {};
  MergeMap.forEach((item, index) => {
    const key = Object.keys(item)[0];
    const config = item[key];

    fieldMappings[key] = {
      displayName: config.displayName || key,
      position: index,
      type: config.type,
    };
  });
  const cleanedCustomers = customers.map((customer) => {
    return Object.fromEntries(
      Object.entries(customer).filter(([key, value]) => {
        const hasValue = value !== '' && value !== null && value !== undefined;
        const isValidObject =
          typeof value !== 'object' ||
          (Array.isArray(value) && value.length > 0) ||
          (value !== null && Object.keys(value).length > 0);
        return key in fieldMappings && hasValue && isValidObject;
      }),
    );
  });

  const sortEntriesByMergeMap = (entries: [string, any, any][]) => {
    return [...entries].sort((a, b) => {
      const posA = fieldMappings[a[0]]?.position ?? Number.MAX_SAFE_INTEGER;
      const posB = fieldMappings[b[0]]?.position ?? Number.MAX_SAFE_INTEGER;
      return posA - posB;
    });
  };

  const firstCustomerEntries = Object.entries(cleanedCustomers[0] || []);
  const secondCustomerEntries = Object.entries(cleanedCustomers[1] || []);

  const mergeCustomerEntries = (
    firstEntries: [string, any][],
    secondEntries: [string, any][],
  ) => {
    const mergedEntries: [string, any, any][] = [];
    firstEntries.forEach(([key, value]) => {
      const secondValue =
        secondEntries.find(([secondKey]) => secondKey === key)?.[1] ?? null;
      mergedEntries.push([
        key,
        value,
        secondValue !== undefined ? secondValue : value,
      ]);
    });
    secondEntries.forEach(([key, value]) => {
      if (!firstEntries.some(([firstKey]) => firstKey === key)) {
        const firstValue = firstEntries.find(([k]) => k === key)?.[1] ?? null;
        mergedEntries.push([key, firstValue, value]);
      }
    });

    return mergedEntries;
  };

  const mergedCustomerEntries = sortEntriesByMergeMap(
    mergeCustomerEntries(firstCustomerEntries, secondCustomerEntries),
  );

  const createEntryKey = (key: string, value: any): string => {
    return `${key}-${
      typeof value === 'object' ? JSON.stringify(value) : value
    }`;
  };

  const [value, setValue] = useState(() => {
    const initialValues: Record<string, any> = {};
    mergedCustomerEntries.forEach(([key, value1, value2]) => {
      if (value1 && !value2) {
        initialValues[key] = value1;
      } else if (!value1 && value2) {
        initialValues[key] = value2;
      } else {
        initialValues[key] = '';
      }
    });
    return initialValues;
  });

  const handleValueChange = (newValue: any, key: string) => {
    if (value[key] === newValue) {
      setValue({ ...value, [key]: '' });
    } else {
      setValue({ ...value, [key]: newValue });
    }
  };

  return (
    <MergeSheet className="p-6 flex gap-2 h-full">
      <div className="flex-[2] h-full flex flex-col gap-2 ">
        <div className="flex justify-between gap-2 mb-1 ">
          <span className="text-sm font-semibold text-muted-foreground w-full">
            {customers[0]?.primaryEmail}
          </span>
          <span className="text-sm font-semibold text-muted-foreground w-full">
            {customers[1]?.primaryEmail}
          </span>
        </div>
        {mergedCustomerEntries.map(([key, value1, value2]) => {
          if (fieldMappings[key].type === 'links' && value1 !== null && value2 !== null) {
            console.log(Object.entries(value1), Object.entries(value2));
          }
          return (
            <ChoiceboxGroup
              value={value[key]}
              onValueChange={(newValue) => handleValueChange(newValue, key)}
              direction="row"
              className="gap-3"
            >
              {value1 !== '' ? (
                fieldMappings[key].type === 'links' && value1 !== null ? (
                  Object.entries(value1).map(([k, v]) => (
                    <MergingFieldContainer
                      key={createEntryKey(k, v)}
                      fieldName={k.charAt(0).toUpperCase() + k.slice(1)}
                      fieldValue={v}
                      type={'string'}
                    />
                  ))
                ) : (
                  <MergingFieldContainer
                    key={createEntryKey(key, value1)}
                    fieldName={fieldMappings[key].displayName}
                    fieldValue={value1}
                    type={fieldMappings[key].type}
                  />
                )
              ) : (
                <span className="w-full" />
              )}
              {value2 !== '' ? (
                fieldMappings[key].type === 'links' && value2 !== null ? (
                  Object.entries(value2).map(([k, v]) => (
                    <MergingFieldContainer
                      key={createEntryKey(k, v)}
                      fieldName={k.charAt(0).toUpperCase() + k.slice(1)}
                      fieldValue={v}
                      type={'string'}
                    />
                  ))
                ) : (
                  <MergingFieldContainer
                    key={createEntryKey(key, value2)}
                    fieldName={fieldMappings[key].displayName}
                    fieldValue={value2}
                    type={fieldMappings[key].type}
                  />
                )
              ) : (
                <span className="w-full" />
              )}
            </ChoiceboxGroup>
          );
        })}
      </div>
      <div className="flex-[1.2] h-full ml-5 flex flex-col gap-2">
        <span className="text-sm font-semibold text-primary mb-1">Merge</span>
        <div className="overflow-y-auto h-[90%] ">
          <div className="flex flex-col gap-2 ">
            {Object.entries(value).map(([key, value]) =>
              value !== '' ? (
                <ChoiceboxGroup className="flex flex-col gap-2" value={value}>
                  <MergingFieldContainer
                    key={createEntryKey(key, value)}
                    fieldName={fieldMappings[key].displayName}
                    fieldValue={value}
                    type={fieldMappings[key].type}
                    disabled
                  />
                </ChoiceboxGroup>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </MergeSheet>
  );
};
