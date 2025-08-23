import * as nodemailer from 'nodemailer';
import AWS from 'aws-sdk';
import { IEmailTransportConfig } from '@/types';
import sendgridMail from '@sendgrid/mail';
import { IUserDocument } from 'erxes-api-shared/core-types';
import { sendTRPCMessage } from 'erxes-api-shared/utils';

export const createTransporter = async (config: IEmailTransportConfig) => {
  if (config.sendgrid) {
    const { apiKey } = config.sendgrid || {};

    sendgridMail.setApiKey(apiKey);
    return sendgridMail;
  }

  // if (config.ses) {
  //   const { accessKeyId, secretAccessKey, region } = config.ses;

  //   AWS.config.update({
  //     region,
  //     accessKeyId,
  //     secretAccessKey,
  //   });

  //   return nodemailer.createTransport({
  //     SES: new AWS.SES({ apiVersion: '2010-12-01' }),
  //   });
  // }

  return nodemailer.createTransport({
    service: config.service,
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });
};

export const generateFromEmail = (sender: string, fromUserEmail: string) => {
  if (sender && fromUserEmail) {
    return `${sender} <${fromUserEmail}>`;
  }

  return fromUserEmail || null;
};

export const getUserDetail = (user: IUserDocument) => {
  if (user.details) {
    return `${user.details?.firstName || ''} ${user.details?.lastName || ''}`;
  }

  return user.email;
};

export async function getUserById(userId: string) {
  return sendTRPCMessage({
    pluginName: 'core',
    method: 'query',
    module: 'users',
    action: 'findOne',
    input: { _id: userId },
  });
}
