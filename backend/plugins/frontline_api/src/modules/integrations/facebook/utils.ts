import * as graph from 'fbgraph';
import { IModels } from '~/connectionResolvers';
import { IFacebookIntegrationDocument } from '@/integrations/facebook/@types/integrations';
import { debugError, debugFacebook } from '@/integrations/facebook/debuggers';


export const graphRequest = {
  base(method: string, path?: any, accessToken?: any, ...otherParams) {
    // set access token
    graph.setAccessToken(accessToken);
    graph.setVersion('7.0');

    return new Promise((resolve, reject) => {
      graph[method](path, ...otherParams, (error, response) => {
        if (error) {
          return reject(error);
        }
        return resolve(response);
      });
    });
  },
  get(...args): any {
    return this.base('get', ...args);
  },

  post(...args): any {
    return this.base('post', ...args);
  },

  delete(...args): any {
    return this.base('del', ...args);
  },
};

export const getPostDetails = async (
  pageId: string,
  pageTokens: { [key: string]: string },
  postId: string,
) => {
  let pageAccessToken;

  try {
    pageAccessToken = getPageAccessTokenFromMap(pageId, pageTokens);
  } catch (e) {
    debugError(`Error occurred while getting page access token: ${e.message}`);
    throw new Error();
  }

  try {
    const response: any = await graphRequest.get(
      `/${postId}?fields=permalink_url,message,created_time`,
      pageAccessToken,
    );

    return response;
  } catch (e) {
    debugError(`Error occurred while getting facebook post: ${e.message}`);
    return null;
  }
};
export const getPageList = async (
  models: IModels,
  accessToken?: string,
  kind?: string,
) => {
  const response: any = await graphRequest.get(
    '/me/accounts?limit=100',
    accessToken,
  );

  const pages: any[] = [];

  for (const page of response.data) {
    const integration = await models.FacebookIntegrations.findOne({
      facebookPageIds: page.id,
      kind,
    });

    pages.push({
      id: page.id,
      name: page.name,
      isUsed: integration ? true : false,
    });
  }

  return pages;
};

export const getPageAccessToken = async (
  pageId: string,
  userAccessToken: string,
) => {
  const response = await graphRequest.get(
    `${pageId}/?fields=access_token`,
    userAccessToken,
  );

  return response.access_token;
};

export const refreshPageAccessToken = async (
  models: IModels,
  pageId: string,
  integration: IFacebookIntegrationDocument,
) => {
  const account = await models.FacebookAccounts.getAccount({
    _id: integration.accountId,
  });

  const facebookPageTokensMap = integration.facebookPageTokensMap || {};

  const pageAccessToken = await getPageAccessToken(pageId, account.token);

  facebookPageTokensMap[pageId] = pageAccessToken;

  await models.FacebookIntegrations.updateOne(
    { _id: integration._id },
    { $set: { facebookPageTokensMap } },
  );

  return facebookPageTokensMap;
};

export const getPageAccessTokenFromMap = (
  pageId: string,
  pageTokens: { [key: string]: string },
): string => {
  return (pageTokens || {})[pageId];
};

export const subscribePage = async (
  models: IModels,
  pageId,
  pageToken,
): Promise<{ success: true } | any> => {
  const subscribed_fields = [
    'conversations',
    'feed',
    'messages',
    'standby',
    'messaging_handovers',
  ];

  return graphRequest.post(`${pageId}/subscribed_apps`, pageToken, {
    subscribed_fields,
  });
};

export const getPostLink = async (
  pageId: string,
  pageTokens: { [key: string]: string },
  postId: string,
) => {
  let pageAccessToken;

  try {
    pageAccessToken = getPageAccessTokenFromMap(pageId, pageTokens);
  } catch (e) {
    debugError(`Error occurred while getting page access token: ${e.message}`);
    throw new Error();
  }

  try {
    const response: any = await graphRequest.get(
      `/${postId}?fields=permalink_url`,
      pageAccessToken,
    );
    return response.permalink_url ? response.permalink_url : '';
  } catch (e) {
    debugError(`Error occurred while getting facebook post: ${e.message}`);
    return null;
  }
};

export const unsubscribePage = async (
  pageId,
  pageToken,
): Promise<{ success: true } | any> => {
  return graphRequest
    .delete(`${pageId}/subscribed_apps`, pageToken)
    .then((res) => res)
    .catch((e) => {
      debugError(e);
      throw e;
    });
};
export const getFacebookUser = async (
  models: IModels,
  pageId: string,
  pageTokens: { [key: string]: string },
  fbUserId: string,
) => {
  let pageAccessToken;

  try {
    pageAccessToken = getPageAccessTokenFromMap(pageId, pageTokens);
  } catch (e) {
    debugError(`Error occurred while getting page access token: ${e.message}`);
    return null;
  }

  const pageToken = pageAccessToken;

  try {
    const response = await graphRequest.get(`/${fbUserId}`, pageToken);

    return response;
  } catch (e) {
    if (e.message.includes('access token')) {
      await models.FacebookIntegrations.updateOne(
        { facebookPageIds: pageId },
        { $set: { healthStatus: 'page-token', error: `${e.message}` } },
      );
    }

    throw new Error(e);
  }
};


export const restorePost = async (
  postId: string,
  pageId: string,
  pageTokens: { [key: string]: string },
) => {
  let pageAccessToken;

  try {
    pageAccessToken = await getPageAccessTokenFromMap(pageId, pageTokens);
  } catch (e) {
    debugError(
      `Error occurred while trying to get page access token with ${e.message}`,
    );
  }

  const fields = `/${postId}?fields=caption,description,link,picture,source,message,from,created_time,comments.summary(true)`;

  try {
    return await graphRequest.get(fields, pageAccessToken);
  } catch (e) {
    throw new Error(e);
  }
};


export const sendReply = async (
  models: IModels,
  url: string,
  data: any,
  recipientId: string,
  integrationId: string,
) => {
  const integration = await models.FacebookIntegrations.getIntegration({
    erxesApiId: integrationId,
  });

  const { facebookPageTokensMap = {} } = integration;

  let pageAccessToken;

  try {
    pageAccessToken = getPageAccessTokenFromMap(
      recipientId,
      facebookPageTokensMap,
    );
  } catch (e) {
    debugError(
       `Error occurred while trying to get page access token with ${e.message}`

    );
    return e;
  }

  try {
    const response = await graphRequest.post(`${url}`, pageAccessToken, {
      ...data,
    });
    debugFacebook(`Successfully sent data to facebook ${JSON.stringify(data)}`);
    return response;
  } catch (e) {
    debugError(
      `Error ocurred while trying to send post request to facebook ${
        e.message
      } data: ${JSON.stringify(data)}`,
    );

    if (e.message.includes('access token')) {
      await models.FacebookIntegrations.updateOne(
        { _id: integration._id },
        { $set: { healthStatus: 'page-token', error: `${e.message}` } },
      );
    } else if (e.code !== 10) {
      await models.FacebookIntegrations.updateOne(
        { _id: integration._id },
        { $set: { healthStatus: 'account-token', error: `${e.message}` } },
      );
    }

    if (e.message.includes('does not exist')) {
      throw new Error('Comment has been deleted by the customer');
    }

    throw new Error(e.message);
  }
};

export const fetchPagePost = async (postId: string, accessToken: string) => {
  const fields = 'message,created_time,full_picture,picture,permalink_url';

  const response = await graphRequest.get(
    `/${postId}?fields=${fields}&access_token=${accessToken}`,
  );

  return response || null;
};

export const fetchPagePosts = async (pageId: string, accessToken: string) => {
  const fields = 'message,created_time,full_picture,picture,permalink_url';
  const response = await graphRequest.get(
    `/${pageId}/posts?fields=${fields}&access_token=${accessToken}`,
  );

  return response.data || [];
};

export const fetchPagesPosts = async (pageId: string, accessToken: string) => {
  const fields = 'message,created_time,full_picture,picture,permalink_url';
  const response = await graphRequest.get(
    `/${pageId}/posts?fields=${fields}&access_token=${accessToken}`,
  );

  return response.data || [];
};

export const fetchPagesPostsList = async (
  pageId: string,
  accessToken: string,
  limit: number,
) => {
  const fields = 'message,created_time,full_picture,picture,permalink_url';

  const response = await graphRequest.get(
    `/${pageId}/posts?fields=${fields}&access_token=${accessToken}&limit=${limit}`,
  );

  return response.data || [];
};

export const checkFacebookPages = async (models: IModels, pages: any) => {
  for (const page of pages) {
    const integration = await models.FacebookIntegrations.findOne({
      pageId: page.id,
    });

    page.isUsed = integration ? true : false;
  }

  return pages;
};

export const getFacebookUserProfilePic = async (
  pageId: string,
  pageTokens: { [key: string]: string },
  fbId: string,
  subdomain: string,
): Promise<string | null> => {
  let pageAccessToken: string;

  try {
    pageAccessToken = getPageAccessTokenFromMap(pageId, pageTokens);
  } catch (e) {
    debugError(`Error occurred while getting page access token: ${e.message}`);
    throw new Error();
  }

  try {
    const response: any = await graphRequest.get(
      `/${fbId}/picture?height=600`,
      pageAccessToken,
    );

    // const { UPLOAD_SERVICE_TYPE } = await getFileUploadConfigs(subdomain);

    // if (UPLOAD_SERVICE_TYPE === "AWS") {
    //   const awsResponse = await uploadMedia(
    //     subdomain,
    //     response.location,
    //     false
    //   );

    //   return awsResponse as string; // Ensure the return type is string
    // }

    // Return the profile picture URL directly if not uploading to AWS
    return response.location as string; // Type assertion to ensure it's a string
  } catch (e) {
    debugError(
      `Error occurred while getting facebook user profile pic: ${e.message}`,
    );
    return null;
  }
};



export const checkIsAdsOpenThread = (entry: any[] = []) => {
  const messaging = entry[0]?.messaging || [];

  const referral = (messaging || [])[0]?.message?.referral;

  if (!referral) {
    return false;
  }

  const isSourceAds = referral?.source === 'ADS';
  const isTypeOpenThread = referral?.type === 'OPEN_THREAD';
  const hasAdsContextData = !referral?.ads_context_data;

  return isSourceAds && isTypeOpenThread && hasAdsContextData;
};
