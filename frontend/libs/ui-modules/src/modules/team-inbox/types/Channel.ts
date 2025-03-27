export interface IChannel {
  _id: string;
  name: string;
}

export interface IChannelContext {
  selectedChannels: string[] | undefined;
  setSelectedChannels: (channels: string[]) => void;
}
