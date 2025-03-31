import { IContext } from 'backend/core-api/src/@types';
import { IStructureDocument } from '../../../@types/structure';

export default {
  async supervisor(structure: IStructureDocument, _args, { models }: IContext) {
    return models.Users.findOne({ _id: structure.supervisorId });
  },
};
