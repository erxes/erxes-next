import { Card } from "erxes-ui";
import { PosRecordTable } from "~/modules/components/PosRecordTable";

export const PosList = () => {
  return (
    <Card className="flex-1 overflow-hidden">
      <Card.Header className="border-b">
        <h3 className="text-lg font-medium">POS List</h3>
      </Card.Header>
      <Card.Content className="p-0">
        <PosRecordTable />
      </Card.Content>
    </Card>
  );
};