import { ITagDocument } from 'erxes-core-types';
import { IModels } from '../../connectionResolvers';

// set related tags
export const setRelatedIds = async (models: IModels, tag: ITagDocument) => {
  if (tag.parentId) {
    const parentTag = await models.Tags.findOne({ _id: tag.parentId });

    if (parentTag) {
      let relatedIds: string[];

      relatedIds = tag.relatedIds || [];
      relatedIds.push(tag._id);

      relatedIds = [
        ...new Set([...relatedIds, ...(parentTag.relatedIds || [])]),
      ];

      await models.Tags.updateOne(
        { _id: parentTag._id },
        { $set: { relatedIds } },
      );

      const updated = await models.Tags.findOne({ _id: tag.parentId });

      if (updated) {
        await setRelatedIds(models, updated);
      }
    }
  }
};

// remove related tags
export const removeRelatedIds = async (models: IModels, tag: ITagDocument) => {
  const tags = await models.Tags.find({ relatedIds: { $in: tag._id } });

  if (tags.length === 0) {
    return;
  }

  const relatedIds: string[] = tag.relatedIds || [];

  relatedIds.push(tag._id);

  const doc: Array<{
    updateOne: {
      filter: { _id: string };
      update: { $set: { relatedIds: string[] } };
    };
  }> = [];

  tags.forEach(async (t) => {
    const ids = (t.relatedIds || []).filter((id) => !relatedIds.includes(id));

    doc.push({
      updateOne: {
        filter: { _id: t._id },
        update: { $set: { relatedIds: ids } },
      },
    });
  });

  await models.Tags.bulkWrite(doc);
};
