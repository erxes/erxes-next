import { ILog } from '../db/definitions/logs';
import { LOG_STATUSES } from '../constants';
import { Collection } from 'mongoose';

type DBS = {
  logs: Collection<ILog>;
};

type CommonObject = {
  source: 'mongo';
  status: 'sucess' | 'failed';
};

const insert = async (
  Logs: Collection<ILog>,
  collectionName: string,
  docId: string,
  commonObj: CommonObject,
  changeEvent,
) => {
  Logs.insertOne({
    action: 'create',
    docId,
    payload: { collectionName, fullDocument: changeEvent.fullDocument },
    createdAt: new Date(),
    ...commonObj,
  });
};

const update = async (
  Logs: Collection<ILog>,
  collectionName: string,
  docId: string,
  commonObj: CommonObject,
  changeEvent,
) => {
  const prevLog = await Logs.findOne(
    { docId },
    { sort: { createdAt: -1 }, limit: 1 },
  );

  Logs.insertOne({
    action: 'update',
    docId: String(docId),
    payload: {
      collectionName,
      fullDocument: changeEvent.fullDocument,
      prevDocument: prevLog?.payload?.fullDocument,
      updateDescription: changeEvent.updateDescription,
    },
    createdAt: new Date(),
    ...commonObj,
  });
};

const remove = async (
  Logs: Collection<ILog>,
  collectionName: string,
  docId: string,
  commonObj: CommonObject,
) => {
  const prevLog = await Logs.findOne(
    { docId },
    { sort: { createdAt: -1 }, limit: 1 },
  );

  Logs.insertOne({
    action: 'remove',
    docId: String(docId),
    payload: { prevDocument: prevLog?.payload?.fullDocument },
    createdAt: new Date(),
    ...commonObj,
  });
};

const actionMap = {
  insert,
  update,
  delete: remove,
};

export const handleMongoChangeEvent = async (
  Logs: Collection<ILog>,
  changeEvent: any,
) => {
  // MongoDB client setup
  const operationType = changeEvent.operationType;
  const collectionName = changeEvent.ns.coll;
  const docId = changeEvent.documentKey._id;

  const action = actionMap[operationType];
  await action(
    Logs,
    collectionName,
    docId,
    { source: 'mongo', status: LOG_STATUSES.SUCCESS },
    changeEvent,
  );
};
