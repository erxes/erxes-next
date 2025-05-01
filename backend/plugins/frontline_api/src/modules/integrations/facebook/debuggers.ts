import * as debug from 'debug';

export const debugInitFacebook = debug('erxes-facebook:init');
export const debugDbFacebook = debug('erxes-facebook:db');

export const debugBaseFacebook = debug('erxes-facebook:base');
export const debugFacebook = debug('erxes-facebook:facebook');

export const debugExternalRequestsFacebook = debug('erxes-facebook:external-requests');

export const debugErrorFacebook = debug('erxes-facebook:error');

export const debugRequest = (debugInstance, req) =>
  debugInstance(`
        Receiving ${req.path} request from ${req.headers.origin}
        body: ${JSON.stringify(req.body || {})}
        queryParams: ${JSON.stringify(req.query)}
    `);

export const debugResponse = (debugInstance, req, data = 'success') =>
  debugInstance(
    `Responding ${req.path} request to ${req.headers.origin} with ${data}`
  );
