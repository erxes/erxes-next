import { Dialog } from 'erxes-ui';
import ReactJson from 'react-json-view';
import { ILogDoc } from '../types';
import { maskFields } from '../utils/logFormUtils';

const MongoUpdateLogDetailContent = ({
  payload,
  action,
}: {
  action: string;
  payload: any;
}) => {
  const { collectionName, fullDocument, prevDocument, updateDescription } =
    payload;

  return (
    <>
      <Dialog.Title>{(collectionName || '').toUpperCase()}</Dialog.Title>
      <Dialog.Description>{action.toUpperCase()}</Dialog.Description>

      <div>
        <Dialog.Description>{'Diff'}</Dialog.Description>

        <ReactJson src={updateDescription} collapsed={1} name={false} />
      </div>
      <div className="flex flex-row mb-4 justify-between">
        <div className="flex-1">
          <Dialog.Description>{'Before'}</Dialog.Description>
          <ReactJson
            src={maskFields(prevDocument, ['password'])}
            collapsed={1}
            name={false}
          />
        </div>
        <div className="flex-1">
          <Dialog.Description>{'After'}</Dialog.Description>

          <ReactJson
            src={maskFields(fullDocument, ['password'])}
            collapsed={1}
            name={false}
          />
        </div>
      </div>
    </>
  );
};

export const MongoLogDetailContent = ({ payload, action }: ILogDoc) => {
  const { collectionName, fullDocument } = payload || {};

  if (action === 'update') {
    return <MongoUpdateLogDetailContent payload={payload} action={action} />;
  }

  return (
    <div>
      <Dialog.Title>{(collectionName || '').toUpperCase()}</Dialog.Title>

      <Dialog.Description>{action.toUpperCase()}</Dialog.Description>

      <ReactJson
        src={maskFields(fullDocument, ['password'])}
        collapsed={1}
        name={false}
      />
    </div>
  );
};
