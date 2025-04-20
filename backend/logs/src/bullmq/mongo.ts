import { Model } from 'mongoose';
import { LOG_STATUSES } from '../constants';
import { ILogDocument } from '../db/definitions/logs';

type CommonObject = {
  source: 'mongo';
  status: 'sucess' | 'failed';
};

const insert = async (
  Logs: any,
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
  Logs: any,
  collectionName: string,
  docId: string,
  commonObj: CommonObject,
  changeEvent,
) => {
  const prevLog = await Logs.findOne({ docId }).sort({ createdAt: -1 }).lean();

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
  Logs: any,
  collectionName: string,
  docId: string,
  commonObj: CommonObject,
) => {
  const prevLog = await Logs.findOne({ docId }).sort({ createdAt: -1 }).lean();

  Logs.insertOne({
    action: 'remove',
    docId: String(docId),
    payload: { collectionName, prevDocument: prevLog?.payload?.fullDocument },
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
  Logs: Model<ILogDocument>,
  changeEvent: any,
  contentType?: string,
) => {
  // MongoDB client setup
  const operationType = changeEvent.operationType;
  const collectionName = changeEvent.ns.coll;
  const docId = changeEvent.documentKey._id;
  const { processId } = changeEvent?.fullDocument || {};

  const action = actionMap[operationType];
  await action(
    Logs,
    collectionName,
    docId,
    { source: 'mongo', status: LOG_STATUSES.SUCCESS, processId, contentType },
    changeEvent,
    processId,
  );
};
