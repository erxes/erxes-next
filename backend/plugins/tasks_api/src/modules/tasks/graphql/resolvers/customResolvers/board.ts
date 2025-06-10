import { sendTRPCMessage } from 'erxes-api-shared/utils';
import mongoose from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { IBoardDocument } from '~/modules/tasks/@types/board';

export default {
  async pipelines(
    board: IBoardDocument,
    _args: undefined,
    { user, models }: IContext,
  ) {
    // Return cached pipelines if available
    if (board.pipelines) return board.pipelines;

    // Admin users get all pipelines
    if (user.isOwner) {
      return models.Pipelines.find({
        boardId: board._id,
        status: { $ne: 'archived' },
      }).lean();
    }

    try {
      // Fetch user details via tRPC
      const userDetail = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'users',
        action: 'findOne',
        input: { _id: user._id },
        defaultValue: {},
      });

      const userDepartmentIds = userDetail?.departmentIds || [];
      const branchIds = userDetail?.branchIds || [];

      // Fetch supervisor departments via tRPC
      const supervisorDepartments = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'departments',
        action: 'findWithChild',
        input: {
          query: { supervisorId: user._id },
          fields: { _id: 1 },
        },
        defaultValue: [],
      });

      const departmentIds = [
        ...userDepartmentIds,
        ...supervisorDepartments.map((x) => x._id),
      ];

      // Build visibility query
      const visibilityConditions: mongoose.FilterQuery<IBoardDocument>[] = [
        { visibility: 'public' },
        {
          visibility: 'private',
          $or: [{ memberIds: user._id }, { userId: user._id }],
        },
      ];

      // Add department visibility if applicable
      if (departmentIds.length > 0) {
        visibilityConditions.push({
          visibility: 'private',
          departmentIds: { $in: departmentIds },
        });
      }

      // Add branch visibility if applicable
      if (branchIds.length > 0) {
        visibilityConditions.push({
          visibility: 'private',
          branchIds: { $in: branchIds },
        });
      }

      // Final pipeline query
      return models.Pipelines.find({
        boardId: board._id,
        status: { $ne: 'archived' },
        $or: visibilityConditions,
      }).lean();
    } catch (e) {
      console.error('Failed to load pipelines:', e);
      // Fallback to public pipelines on error
      return models.Pipelines.find({
        boardId: board._id,
        status: { $ne: 'archived' },
        visibility: 'public',
      }).lean();
    }
  },
};
