import { IPageInfo } from 'ui-modules';

export interface ILogDoc {
  source: 'webhook' | 'graphql' | 'mongo' | 'auth';
  action: string;
  payload: any;
  userId?: string;
  executionTime?: {
    startDate: Date;
    endDate: Date;
    durationMs: number;
  };
  createdAt: Date;
  status?: 'failed' | 'success';
}
export type LogsMainListQueryResponse = {
  logsMainList: {
    list: any[];
    totalCount: number;
    pageInfo: IPageInfo;
  };
};

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarPopoverProps = {
  user?: any;
  size?: AvatarSize;
};
