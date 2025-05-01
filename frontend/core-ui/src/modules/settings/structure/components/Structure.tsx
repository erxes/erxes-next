import {
  Form,
  InlineCell,
  InlineCellDisplay,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
  ScrollArea,
  Table,
  TextField,
} from 'erxes-ui';
import { useStructureDetails } from '../hooks/useStructureDetails';
import { useStructureDetailsForm } from '../hooks/useStructureDetailsForm';
import { useEffect } from 'react';

export const Structure = () => {
  const { structureDetail } = useStructureDetails();
  const {
    methods,
    methods: { control },
  } = useStructureDetailsForm();

  useEffect(() => {
    if (structureDetail) {
      methods.reset(structureDetail);
    }
  }, [structureDetail, methods]);

  return (
    <ScrollArea className="w-full min-h-svh">
      <div className="flex h-full w-full flex-col">
        <div className="mx-auto max-w-2xl w-full relative">
          <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Structure</h2>
          <RecordTable.Provider columns={[]} data={structureDetail || {}}>
            <RecordTable.Body>
              {/* <RecordTable.RowList className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                    <Table.Cell>
                      <Form.Label className="px-2">Name</Form.Label>
                    </Table.Cell>
                    <Table.Cell>
                      <RecordTablePopover>
                        <RecordTableCellTrigger>
                          {structureDetail.title}
                        </RecordTableCellTrigger>
                        <RecordTableCellContent>
                          <Input />
                        </RecordTableCellContent>
                      </RecordTablePopover>
                    </Table.Cell>
                  </RecordTable.RowList> */}
            </RecordTable.Body>
          </RecordTable.Provider>
        </div>
      </div>
    </ScrollArea>
  );
};
