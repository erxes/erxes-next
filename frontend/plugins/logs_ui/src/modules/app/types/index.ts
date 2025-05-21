interface ILogDoc {
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
type QueryResponse = {
  logsMainList: {
    list: any[];
    totalCount: number;
  };
};

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

type AvatarPopoverProps = {
  user?: any;
  size?: AvatarSize;
};
