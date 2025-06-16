import { Button, Dialog } from 'erxes-ui';
import ReactJson from 'react-json-view';
import auth from './AuthLogDetailContent';
import graphql from './GraphqlLogDetailContent';
import mongo from './MongoLogDetailContent';
import { ILogDoc } from '../types';
import { IconEye } from '@tabler/icons-react';

type Props = {
  doc: ILogDoc;
};

const handleDetail = (doc: ILogDoc) => {
  const { source, payload } = doc;

  if (source === 'mongo') {
    return mongo(doc);
  }

  if (source === 'graphql') {
    return graphql(doc);
  }

  if (source === 'auth') {
    return auth(doc);
  }
  return <ReactJson src={payload} collapsed={1} />;
};

export function LogDetailDialog({ doc }: Props) {
  return (
    <Dialog>
      <Dialog.Trigger>
        <div className="flex w-full justify-center">
          <Button variant="ghost" size="icon">
            {/* <TablerIcon name="IconEye" className="text-muted-foreground" /> */}
            <IconEye />
          </Button>
        </div>
      </Dialog.Trigger>
      <Dialog.Content className="max-w-[1200px]">
        <Dialog.Header></Dialog.Header>
        {handleDetail(doc)}
      </Dialog.Content>
    </Dialog>
  );
}
