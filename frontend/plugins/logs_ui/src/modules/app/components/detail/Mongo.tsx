import { Dialog } from 'erxes-ui';
import ReactJson from 'react-json-view';
const maskFields = (data: any, keysToMask: string[]): any => {
  if (Array.isArray(data)) {
    return data.map((item) => maskFields(item, keysToMask));
  } else if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce((acc: any, [key, value]) => {
      if (keysToMask.includes(key)) {
        acc[key] = '••••••';
      } else {
        acc[key] = maskFields(value, keysToMask);
      }
      return acc;
    }, {});
  }
  return data;
};

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
