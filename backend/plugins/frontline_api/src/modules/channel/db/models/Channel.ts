import { FilterQuery, Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { channelSchema } from '~/modules/channel/db/definitions/channel';
import {
  ChannelMemberRoles,
  IChannel,
  IChannelDocument,
  IChannelFilter,
} from '~/modules/channel/@types/channel';
import { IChannelMember } from '~/modules/channel/@types/channel';
export interface IChannelModel extends Model<IChannelDocument> {
  getChannel(_id: string): Promise<IChannelDocument>;
  getChannels(params: IChannelFilter): Promise<IChannelDocument[]>;

  createChannel({
    channelDoc,
    memberIds,
    adminId,
  }: {
    channelDoc: IChannel;
    memberIds: string[];
    adminId: string;
  }): Promise<IChannelDocument>;
  updateChannel(_id: string, doc: IChannel, userId: string): IChannelDocument;
  updateUserChannels(channelIds: string[], userId: string): IChannelDocument[];
  removeChannel(_id: string): void;
}

export const loadChannelClass = (models: IModels) => {
  class Channel {
    /*
     * Get a Channel
     */
    public static async getChannel(_id: string) {
      const channel = await models.Channels.findOne({ _id });

      if (!channel) {
        throw new Error('Channel not found');
      }

      return channel;
    }

    public static async createChannel({
      channelDoc,
      memberIds,
      adminId,
    }: {
      channelDoc: IChannel;
      memberIds: string[];
      adminId: string;
    }): Promise<IChannelDocument> {
      if (!adminId) {
        throw new Error('userId must be supplied');
      }
      const roles: IChannelMember[] = [];

      const channel = await models.Channels.insertOne({
        ...channelDoc,
        createdAt: new Date(),
        createdBy: adminId,
      });

      roles.push(
        {
          memberId: adminId,
          channelId: channel._id,
          role: ChannelMemberRoles.ADMIN,
        },
        ...memberIds.map((memberId) => ({
          memberId,
          channelId: channel._id,
          role: ChannelMemberRoles.MEMBER,
        })),
      );

      await models.ChannelMembers.createChannelMembers(roles);

      return channel;
    }

    public static async updateChannel(
      _id: string,
      doc: IChannel,
      userId: string,
    ) {
      await models.Channels.updateOne(
        { _id },
        {
          $set: {
            ...doc,
            updatedBy: userId,
            updatedAt: new Date(),
          },
        },
        { runValidators: true },
      );

      return models.Channels.findOne({ _id });
    }

    public static async updateUserChannels(
      channelIds: string[],
      userId: string,
    ) {
      // remove from previous channels
      await models.Channels.updateMany(
        { memberIds: { $in: [userId] } },
        { $pull: { memberIds: userId } },
      );

      // add to given channels
      await models.Channels.updateMany(
        { _id: { $in: channelIds } },
        { $push: { memberIds: userId } },
      );

      return models.Channels.find({ _id: { $in: channelIds } });
    }

    public static removeChannel(_id: string) {
      return models.Channels.deleteOne({ _id });
    }

    public static async getChannels(
      params: IChannelFilter,
    ): Promise<IChannelDocument[]> {
      const query: FilterQuery<IChannelDocument> = {};

      if (params.name) {
        query.name = params.name;
      }

      if (params.description) {
        query.description = params.description;
      }

      if (params.userId) {
        const channelIds = await models.ChannelMembers.find({
          memberId: params.userId,
        }).distinct('channelId');

        query._id = { $in: channelIds };
      }

      return models.Channels.find(query).lean();
    }
  }

  channelSchema.loadClass(Channel);

  return channelSchema;
};
