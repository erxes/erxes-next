import { IContext } from 'core-api/@types';
import { IStructureDocument } from 'core-api/modules/organization/structure/@types/structure';

export default {
  async supervisor(structure: IStructureDocument, _args, { models }: IContext) {
    return models.Users.findOne({ _id: structure.supervisorId });
  },
};
