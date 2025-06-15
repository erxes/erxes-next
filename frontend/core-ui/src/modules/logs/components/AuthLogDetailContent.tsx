import { SelectSeparator } from '@radix-ui/react-select';
import dayjs from 'dayjs';
import { Dialog, TablerIcon } from 'erxes-ui';
import { UAParser } from 'ua-parser-js';
import { ILogDoc } from '../types';

const getClientInfo = (headers: any) => {
  if (!headers) {
    return;
  }
  const defaulIp = '127.0.0.1';
  const xForwardedFor = headers['x-forwarded-for'] || '';
  const xRealIp = headers['x-real-ip'] || '';
  const cfConnectionIp = headers['cf-connecting-ip'] || '';
  const trueClientIp = headers['true-client-ip'] || '';
  const host = headers['host'] || '';

  const userAgent = headers['user-agent'] || '';
  const ip =
    xForwardedFor?.split(',')[0].trim() ||
    xRealIp ||
    cfConnectionIp ||
    trueClientIp ||
    host?.split(':')[0] || // fallback
    defaulIp;

  const ua = UAParser(userAgent);

  const browser = `${ua.browser.name || 'Unknown'} ${
    ua.browser.version || ''
  }`.trim();
  const os = `${ua.os.name || 'Unknown'} ${ua.os.version || ''}`.trim();
  const device = ua.device.type || 'Desktop';

  return {
    ip,
    device,
    browser,
    os,
  };
};

export const AuthLogDetailContent = ({ payload, createdAt }: ILogDoc) => {
  const { headers } = payload || {};

  const {
    ip = '',
    device = '',
    os = '',
    browser = '',
  } = getClientInfo(headers) || {};
  return (
    <>
      <Dialog.Title className="flex flex-row gap-2">
        <TablerIcon name={`IconShield`} className="pr-2" />
        Authentication Details
      </Dialog.Title>
      <Dialog.Description>User Information </Dialog.Description>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <TablerIcon name={`IconUser`} />
          <p className="font-bold">Email:</p>
          <span>{payload.email}</span>
        </div>
        <div className="flex flex-row gap-2">
          <TablerIcon name={`IconClockHour1`} />
          <p className="font-bold">Time:</p>
          <span>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
        <div className="flex flex-row gap-2">
          <TablerIcon name={`IconShield`} />
          <p className="font-bold">Method:</p>
          <span>{payload.method}</span>
        </div>
      </div>
      <SelectSeparator />
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-col gap-2 items-center">
          <TablerIcon name={`IconUser`} />
          <p>IP Address</p>
          <span>{ip}</span>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <TablerIcon name={`IconDeviceImac`} />
          <p>Device</p>
          <span>{device}</span>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <TablerIcon name={`IconDeviceDesktopCode`} />
          <p>Os</p>
          <span>{os}</span>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <TablerIcon name={`IconBrowser`} />
          <p>Browser</p>
          <span>{browser}</span>
        </div>
      </div>
    </>
  );
};
