import { Button, Dialog, TablerIcon } from 'erxes-ui';
import ReactJson from 'react-json-view';
import auth from './detail/Auth';
import graphql from './detail/Graphql';
import mongo from './detail/Mongo';

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

export default function Payload({ doc }: Props) {
  return (
    <Dialog>
      <Dialog.Trigger>
        <div className="flex w-full justify-center">
          <Button variant="ghost" size="icon">
            <TablerIcon name="IconEye" className="text-muted-foreground" />
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
