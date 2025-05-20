import dayjs from 'dayjs';
import { Dialog } from 'erxes-ui';
import ReactJson from 'react-json-view';
import { maskFields } from '../../utils';

const graphql = ({ payload, createdAt }: ILogDoc) => {
  const { mutationName, args, result, error } = payload;

  const res = error ? error : result;

  return (
    <>
      <Dialog.Title>Operation Summary</Dialog.Title>
      <div className="flex flex-row justify-between">
        <div className="flex-1">
          <Dialog.Description>Operations</Dialog.Description>
          <span>{mutationName}</span>
        </div>
        <div className="flex-1">
          <Dialog.Description>Timestamp</Dialog.Description>
          <div>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex-1">
          <Dialog.Description>Args</Dialog.Description>
          <ReactJson
            src={maskFields(args, ['password'])}
            collapsed={1}
            name={false}
          />
        </div>
        <div className="flex-1">
          <Dialog.Description>Result</Dialog.Description>
          <ReactJson
            src={
              typeof res === 'string' ? { res } : maskFields(res, ['password'])
            }
            collapsed={1}
            name={false}
          />
        </div>
      </div>
    </>
  );
};

export default graphql;
