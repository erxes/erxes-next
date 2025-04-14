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

type NodeData = {
  label: string;
  nodeType: 'trigger' | 'action';
  icon?: React.ReactNode;
  description?: string;
  module?: string;
  category?: string;
  config?: Record<string, any>;
  configurable?: boolean;
  outputs?: number;
  color?: string;
};
