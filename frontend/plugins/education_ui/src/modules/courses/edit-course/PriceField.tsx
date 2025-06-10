import { CurrencyCode, CurrencyField, useToast } from 'erxes-ui';
import { CoreCell } from '@tanstack/react-table';
import { useCourseEdit } from '@/courses/hooks/useCourseEdit';
import { ApolloError } from '@apollo/client';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { useState } from 'react';

export const PriceField = ({ cell }: { cell: CoreCell<any, any> }) => {
  const [value, setValue] = useState(cell.getValue() as number);

  const { courseEdit } = useCourseEdit();
  const { toast } = useToast();
  return (
    <RecordTableInlineCell
      onSave={() => {
        courseEdit({
          variables: {
            id: cell.row.original._id,
            [cell.column.id]: value,
          },
          onError: (e: ApolloError) => {
            toast({
              title: 'Error',
              description: e.message,
            });
          },
        });
      }}
      getValue={() => cell.getValue()}
      value={value}
      display={() => (
        <CurrencyField.ValueInput
          value={value}
          onChange={(value) => setValue(value)}
        />
        // <CurrencyDisplay
        //   currencyValue={{
        //     currencyCode: CurrencyCode.USD,
        //     amountMicros: value * 1000000,
        //   }}
        // />
      )}
      edit={() => (
        <RecordTableInlineCellEditForm>
          <CurrencyField.ValueInput
            value={value}
            onChange={(value) => setValue(value)}
          />
        </RecordTableInlineCellEditForm>
      )}
    />
  );
};
