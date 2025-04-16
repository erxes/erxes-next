export interface IChannel {
  _id: string;
  name: string;
}

export interface IChannelContext {
  selectedChannels: IChannel[] | undefined;
  setSelectedChannels: (channels: IChannel[]) => void;
}
