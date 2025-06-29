import { calculateFileDir, cfRecordUrl, toCamelCase } from '../utils';

export const findOrCreateCdr = async (
  models,
  subdomain,
  cdrParams,
  inboxId,
  conversationId,
) => {
  validateRequiredParams(cdrParams);

  const { AcctId: acctId } = cdrParams;
  const existingCdr = await findExistingCdr(models, acctId);

  if (existingCdr) {
    return await updateExistingCdr(models, existingCdr, conversationId);
  }

  const newCdr = await createNewCdr(models, cdrParams, inboxId, conversationId);
  await processRecordUrl(models, cdrParams, inboxId, subdomain, acctId);

  return newCdr;
};

const validateRequiredParams = (cdrParams) => {
  const { AcctId } = cdrParams;
  if (!AcctId) {
    throw new Error('AcctId is required');
  }
};

const findExistingCdr = async (models, acctId) => {
  return await models.Cdrs.findOne({ acctId });
};

const updateExistingCdr = async (models, cdr, conversationId) => {
  if (conversationId && cdr.conversationId !== conversationId) {
    await models.Cdrs.updateOne({ _id: cdr._id }, { $set: { conversationId } });
    cdr.conversationId = conversationId;
  }
  return cdr;
};

const createNewCdr = async (models, cdrParams, inboxId, conversationId) => {
  const camelCaseParams = toCamelCase(cdrParams);
  const { AcctId: acctId, ...filteredParams } = camelCaseParams as any;

  return await models.Cdrs.create({
    acctId,
    ...filteredParams,
    inboxIntegrationId: inboxId,
    conversationId,
    createdAt: new Date(),
  });
};

const processRecordUrl = async (
  models,
  cdrParams,
  inboxId,
  subdomain,
  acctId,
) => {
  const { recordfiles, lastapp, disposition } = cdrParams;

  if (!shouldProcessRecordUrl(recordfiles, disposition, lastapp)) {
    return;
  }

  try {
    const recordUrl = await generateRecordUrl(
      cdrParams,
      inboxId,
      models,
      subdomain,
    );

    if (recordUrl) {
      await updateCdrWithRecordUrl(models, acctId, recordUrl);
    }
  } catch (error) {
    console.error('Failed to process record URL:', error);
  }
};

const shouldProcessRecordUrl = (recordfiles, disposition, lastapp) => {
  return (
    recordfiles &&
    disposition === 'ANSWERED' &&
    (lastapp === 'Dial' || lastapp === 'Queue')
  );
};

const generateRecordUrl = async (cdrParams, inboxId, models, subdomain) => {
  const fileDir = calculateFileDir(cdrParams);

  return await cfRecordUrl(
    {
      fileDir,
      recordfiles: cdrParams.recordfiles,
      inboxIntegrationId: inboxId,
      retryCount: 1,
    },
    {},
    models,
    subdomain,
  );
};

const updateCdrWithRecordUrl = async (models, acctId, recordUrl) => {
  await models.Cdrs.updateOne({ acctId }, { $set: { recordUrl } });
};
