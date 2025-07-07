export interface ICallConfig {
  _id: string;
  inboxId: string;
  phone: string;
  wsServer: string;
  operators: JSON;
  token: string;
  queues: string[];
}
export interface ICallConfigDoc extends ICallConfig {
  isAvailable: boolean;
}
