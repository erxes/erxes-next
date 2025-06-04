import { Dialog } from 'erxes-ui';
import ReactJson from 'react-json-view';
import { ILogDoc } from '../types';
import { maskFields } from '../utils';

const mongo = ({ payload, action }: ILogDoc) => {
  const { collectionName, fullDocument, prevDocument, updateDescription } =
    payload || {};

  const update = () => {
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

  if (action === 'update') {
    return update();
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

export default mongo;
