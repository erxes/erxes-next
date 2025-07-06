import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';
import { IEmailTransportConfig } from '@/types';

export const createTransporter = async (config: IEmailTransportConfig) => {
  if (config.ses) {
    const { accessKeyId, secretAccessKey, region } = config.ses;

    AWS.config.update({
      region,
      accessKeyId,
      secretAccessKey,
    });

    return nodemailer.createTransport({
      SES: new AWS.SES({ apiVersion: '2010-12-01' }),
    });
  }

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
