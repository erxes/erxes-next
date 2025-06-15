import { IconEye } from '@tabler/icons-react';
import { Button, Dialog } from 'erxes-ui';
import { useState } from 'react';
import ReactJson from 'react-json-view';
import { ILogDoc } from '../types';
import { lazy } from 'react';

type Props = {
  doc: ILogDoc;
};

const MongoContent = lazy(() =>
  import('./MongoLogDetailContent').then((module) => ({
    default: module.MongoLogDetailContent,
  })),
);

const GraphqlContent = lazy(() =>
  import('./GraphqlLogDetailContent').then((module) => ({
    default: module.GraphqlLogDetailContent,
  })),
);

const AuthContent = lazy(() =>
  import('./AuthLogDetailContent').then((module) => ({
    default: module.AuthLogDetailContent,
  })),
);

const LogDetailContent = ({ doc }: { doc: ILogDoc }) => {
  const { source, payload } = doc;

  if (source === 'mongo') {
    return <MongoContent {...doc} />;
  }

  if (source === 'graphql') {
    return <GraphqlContent {...doc} />;
  }

  if (source === 'auth') {
    return <AuthContent {...doc} />;
  }
  return <ReactJson src={payload} collapsed={1} />;
};

export function LogDetailDialog({ doc }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon">
          <IconEye />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="max-w-[1200px]">
        {open && <LogDetailContent doc={doc} />}
      </Dialog.Content>
    </Dialog>
  );
}
