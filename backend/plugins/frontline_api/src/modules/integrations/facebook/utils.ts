import * as graph from "fbgraph";
import { IModels } from '~/connectionResolvers';


export const graphRequest = {
  base(method: string, path?: any, accessToken?: any, ...otherParams) {
    // set access token
    graph.setAccessToken(accessToken);
    graph.setVersion("7.0");

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
    return this.base("get", ...args);
  },

  post(...args): any {
    return this.base("post", ...args);
  },

  delete(...args): any {
    return this.base("del", ...args);
  }
};


export const getPageList = async (
  models: IModels,
  accessToken?: string,
  kind?: string
) => {
  const response: any = await graphRequest.get(
    "/me/accounts?limit=100",
    accessToken
  );

  const pages: any[] = [];

  for (const page of response.data) {
    const integration = await models.Integrations.findOne({
      facebookPageIds: page.id,
      kind
    });

    pages.push({
      id: page.id,
      name: page.name,
      isUsed: integration ? true : false
    });
  }

  return pages;
};