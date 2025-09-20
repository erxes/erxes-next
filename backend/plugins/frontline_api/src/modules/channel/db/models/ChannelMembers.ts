import { Model } from 'mongoose';
import {
  IChannelMember,
  IChannelMemberDocument,
  ChannelMemberRoles,
} from '~/modules/channel/@types/channel';
import { channelMembers } from '~/modules/channel/db/definitions/channel';
import { IModels } from '~/connectionResolvers';

export interface IChannelMemberModel extends Model<IChannelMemberDocument> {
  getChannelMember(
    memberId: string,
    channelId: string,
  ): Promise<IChannelMemberDocument>;
  createChannelMember(
    members: IChannelMember[],
  ): Promise<IChannelMemberDocument>;
  updateChannelMember(
    _id: string,
    role: ChannelMemberRoles,
    userId: string,
  ): Promise<IChannelMemberDocument>;

  createChannelMembers(
    members: IChannelMember[],
  ): Promise<IChannelMemberDocument[]>;
  removeChannelMember(_id: string): Promise<IChannelMemberDocument>;
}

export const loadChannelMemberClass = (models: IModels) => {
  class ChannelMember {
    public static async getChannelMember(memberId: string, channelId: string) {
      return models.ChannelMembers.findOne({ memberId, channelId }).lean();
    }

    public static async createChannelMember(doc: IChannelMember) {
      return models.ChannelMembers.insertOne({ ...doc, createdBy: new Date() });
    }

    public static async updateChannelMember(
      _id: string,
      role: ChannelMemberRoles,
      userId: string,
    ) {
      const channelMember = await models.ChannelMembers.findOne({ _id });

      if (!channelMember) {
        throw new Error('Channel member not found');
      }

      if (channelMember.role === ChannelMemberRoles.ADMIN) {
        const adminsCount = await models.ChannelMembers.countDocuments({
          channelId: channelMember.channelId,
          role: ChannelMemberRoles.ADMIN,
        });

        if (adminsCount === 1) {
          throw new Error('Admin cannot be removed');
        }
      }

      return models.ChannelMembers.findOneAndUpdate(
        { _id },
        { $set: { role, updateBy: userId } },
      );
    }

    public static async createChannelMembers(members: IChannelMember[]) {
      console.log(members,'members....')
      return models.ChannelMembers.insertMany(
        members,
      );
    }

    public static async removeChannelMember(_id: string) {
      const channelMember = await models.ChannelMembers.findOne({ _id });

      if (!channelMember) {
        throw new Error('Channel member not found');
      }

      if (channelMember.role === ChannelMemberRoles.ADMIN) {
        throw new Error('Admin cannot be removed');
      }

      return models.ChannelMembers.deleteOne({ _id });
    }
  }

  channelMembers.loadClass(ChannelMember);

  return channelMembers;
};
