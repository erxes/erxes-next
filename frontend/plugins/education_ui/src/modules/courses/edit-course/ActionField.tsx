import { CurrencyDisplay, CurrencyField, useToast } from 'erxes-ui';
import { CoreCell } from '@tanstack/react-table';
import { useCourseEdit } from '@/courses/hooks/useCourseEdit';
import { ApolloError } from '@apollo/client';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { useState } from 'react';

export const ActionField = ({ cell }: { cell: CoreCell<any, any> }) => {
  const { toast } = useToast();
  return <div></div>;
};
