export interface ICallConfig {
  _id: string;
  inboxId: string;
  phone: string;
  wsServer: string;
  operators: { userId: string; gsUsername: string; gsPassword: string }[];
  token: string;
  queues: string[];
}
export interface ICallConfigDoc extends ICallConfig {
  isAvailable: boolean;
}
