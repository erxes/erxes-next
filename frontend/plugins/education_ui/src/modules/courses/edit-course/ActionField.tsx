import { CurrencyCode, CurrencyInput, useToast } from 'erxes-ui';
import { CoreCell } from '@tanstack/react-table';
import { useCourseEdit } from '@/courses/hooks/useCourseEdit';
import { ApolloError } from '@apollo/client';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { CurrencyDisplay } from 'erxes-ui/components/display/CurrencyDisplay';
import { useState } from 'react';

export const ActionField = ({ cell }: { cell: CoreCell<any, any> }) => {
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
        <CurrencyDisplay
          currencyValue={{
            currencyCode: CurrencyCode.USD,
            amountMicros: value * 1000000,
          }}
        />
      )}
      edit={() => (
        <RecordTableInlineCellEditForm>
          <CurrencyInput value={value} onChange={(value) => setValue(value)} />
        </RecordTableInlineCellEditForm>
      )}
    />
  );
};
