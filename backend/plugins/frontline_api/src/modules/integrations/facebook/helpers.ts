import { IModels } from '~/connectionResolvers';
import { debugError, debugFacebook } from '@/integrations/facebook/debuggers';
import {
  getPageAccessToken,
  refreshPageAccesToken,
  subscribePage,
  unsubscribePage
} from '@/integrations/facebook/utils';
import fetch from 'node-fetch';
import {getEnv ,resetConfigsCache} from 'erxes-api-shared/utils'
export const removeIntegration = async (
  subdomain: string,
  models: IModels,
  integrationErxesApiId: string
): Promise<string> => {
  const integration = await models.FacebookIntegrations.findOne({
    erxesApiId: integrationErxesApiId
  });

  if (!integration) {
    throw new Error('Integration not found');
  }

  // Remove endpoint
  let integrationRemoveBy;

  const { _id, kind, accountId, erxesApiId } = integration;

  const account = await models.FacebookAccounts.findOne({ _id: accountId });

  const selector = { integrationId: _id };

  if (kind.includes('facebook')) {
    debugFacebook('Removing entries');

    if (!account) {
      throw new Error('Account not found');
    }

    for (const pageId of integration.facebookPageIds || []) {
      let pageTokenResponse;

      try {
        pageTokenResponse = await getPageAccessToken(pageId, account.token);
      } catch (e) {
        debugError(
          `Error ocurred while trying to get page access token with ${e.message}`
        );
      }

  
      try {
        await models.FacebookPostConversations.deleteMany({ recipientId: pageId });
        await unsubscribePage(pageId, pageTokenResponse);
      } catch (e) {
        debugError(
          `Error occured while trying to unsubscribe page pageId: ${pageId}`
        );
      }
    }

    integrationRemoveBy = { fbPageIds: integration.facebookPageIds };

    const conversationIds =
      await models.FacebookConversations.find(selector).distinct('_id');

    await models.FacebookCustomers.deleteMany({
      integrationId: integrationErxesApiId
    });

    await models.FacebookConversations.deleteMany(selector);
    await models.FacebookConversationMessages.deleteMany({
      conversationId: { $in: conversationIds }
    });

    await models.FacebookIntegrations.deleteOne({ _id });
  }

  // Remove from core =========
  const ENDPOINT_URL = getEnv({ name: 'ENDPOINT_URL' });
  const DOMAIN = getEnv({ name: 'DOMAIN', subdomain });
  
  let domain = `${DOMAIN}/gateway/pl:facebook`;

  if (process.env.NODE_ENV !== 'production') {
    domain = `${DOMAIN}/pl:facebook`;
  }

  if (ENDPOINT_URL) {
    // send domain to core endpoints
    try {
      await fetch(`${ENDPOINT_URL}/remove-endpoint`, {
        method: 'POST',
        body: JSON.stringify({
          domain,
          ...integrationRemoveBy
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  await models.FacebookIntegrations.deleteOne({ _id });

  return erxesApiId;
};

export const removeAccount = async (
  subdomain,
  models: IModels,
  _id: string
): Promise<{ erxesApiIds: string | string[] } | Error> => {
  const account = await models.FacebookAccounts.findOne({ _id });

  if (!account) {
    return new Error(`Account not found: ${_id}`);
  }

  const erxesApiIds: string[] = [];

  const integrations = await models.FacebookIntegrations.find({
    accountId: account._id
  });

    if (integrations.length > 0) {
      const results = await Promise.all(
        integrations.map(integration => 
          removeIntegration(subdomain, models, integration.erxesApiId)
        )
      );
      
      erxesApiIds.push(...results);
    }

  await models.FacebookAccounts.deleteOne({ _id });

  return { erxesApiIds };
};

export const repairIntegrations = async (
  subdomain: string,
  models: IModels,
  integrationId: string
): Promise<true | Error> => {
  const integration = await models.FacebookIntegrations.findOne({
    erxesApiId: integrationId
  });

  if (!integration) {
    throw new Error('Integration not found');
  }

  for (const pageId of integration.facebookPageIds || []) {
    const pageTokens = await refreshPageAccesToken(models, pageId, integration);

    await subscribePage(models,pageId, pageTokens[pageId]);

    await models.FacebookIntegrations.deleteMany({
      erxesApiId: { $ne: integrationId },
      facebookPageIds: pageId,
      kind: integration.kind
    });
  }

  await models.FacebookIntegrations.updateOne(
    { erxesApiId: integrationId },
    { $set: { healthStatus: 'healthy', error: '' } }
  );

  const ENDPOINT_URL = getEnv({ name: 'ENDPOINT_URL' });
  const DOMAIN = getEnv({ name: 'DOMAIN', subdomain });

  let domain = `${DOMAIN}/gateway/pl:facebook`;

  if (process.env.NODE_ENV !== 'production') {
    domain = `${DOMAIN}/pl:facebook`;
  }

  if (ENDPOINT_URL) {
    await fetch(`${ENDPOINT_URL}/update-endpoint`, {
      method: 'POST',
      body: JSON.stringify({
        domain,
        facebookPageIds: integration.facebookPageIds,
        fbPageIds: integration.facebookPageIds // Consider removing if duplicate of facebookPageIds
      }),
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return true;
};

export const removeCustomers = async (models: IModels, params) => {
  const { customerIds } = params;
  const selector = { erxesApiId: { $in: customerIds } };

  await models.FacebookCustomers.deleteMany(selector);
};

export const updateConfigs = async (
  models: IModels,
  configsMap
): Promise<void> => {
  await models.FacebookConfigs.updateConfigs(configsMap);

  await resetConfigsCache();
};

export const routeErrorHandling = (fn, callback?: any) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      if (callback) {
        return callback(res, e, next);
      }

      debugError(e.message);

      return next(e);
    }
  };
};

export const facebookGetCustomerPosts = async (
  models: IModels,
  { customerId }
) => {
  const customer = await models.FacebookCustomers.findOne({ erxesApiId: customerId });

  if (!customer) {
    return [];
  }

  const result = await models.FacebookCommentConversation.aggregate([
    { $match: { senderId: customer.userId } },
    {
      $lookup: {
        from: 'posts_conversations_facebooks',
        localField: 'postId',
        foreignField: 'postId',
        as: 'post'
      }
    },
    {
      $unwind: {
        path: '$post',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        conversationId: '$post.erxesApiId'
      }
    },
    {
      $project: { _id: 0, conversationId: 1 }
    }
  ]);

  const conversationIds = result.map((conv) => conv.conversationId);

  return conversationIds;
};

export const facebookCreateIntegration = async (
  subdomain: string,
  models: IModels,
  { accountId, integrationId, data, kind }
): Promise<{ status: 'success' }> => {
  const facebookPageIds = JSON.parse(data).pageIds;

  const account = await models.FacebookAccounts.getAccount({ _id: accountId });

  const integration = await models.FacebookIntegrations.create({
    kind,
    accountId,
    erxesApiId: integrationId,
    facebookPageIds
  });

  const ENDPOINT_URL = getEnv({ name: 'ENDPOINT_URL' });
  const DOMAIN = getEnv({ name: 'DOMAIN', subdomain });

  let domain = `${DOMAIN}/gateway/pl:facebook`;

  if (process.env.NODE_ENV !== 'production') {
    domain = `${DOMAIN}/pl:facebook`;
  }

  if (ENDPOINT_URL) {
    // send domain to core endpoints
    try {
      await fetch(`${ENDPOINT_URL}/register-endpoint`, {
        method: 'POST',
        body: JSON.stringify({
          domain,
          facebookPageIds,
          fbPageIds: facebookPageIds
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      await models.FacebookIntegrations.deleteOne({ _id: integration._id });
      throw e;
    }
  }

  const facebookPageTokensMap: { [key: string]: string } = {};

  for (const pageId of facebookPageIds) {
    try {
      const pageAccessToken = await getPageAccessToken(pageId, account.token);

      facebookPageTokensMap[pageId] = pageAccessToken;

      try {
        await subscribePage(models,pageId, pageAccessToken);
        debugFacebook(`Successfully subscribed page ${pageId}`);
      } catch (e) {
        debugError(
          `Error ocurred while trying to subscribe page ${e.message || e}`
        );
        throw e;
      }
    } catch (e) {
      debugError(
        `Error ocurred while trying to get page access token with ${
          e.message || e
        }`
      );

      throw e;
    }
  }

  integration.facebookPageTokensMap = facebookPageTokensMap;

  await integration.save();

  return { status: 'success' };
};
