import { IContext } from '../../../../../../connectionResolvers';
import { IStructureDocument } from '../../../@types/structure';

export default {
  async supervisor(structure: IStructureDocument, _args, { models }: IContext) {
    return models.Users.findOne({ _id: structure.supervisorId });
  },
};
