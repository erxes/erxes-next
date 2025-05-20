import { IContext } from '~/db/connectionResolvers';
import { STATUSES } from '~/constants';
import { IAutomation, IAutomationDoc } from '~/db/definitions/automations';
import { INote } from '~/db/definitions/notes';

interface IAutomationNoteEdit extends INote {
  _id: string;
}

interface IAutomationsEdit extends IAutomation {
  _id: string;
}

const automationMutations = {
  /**
   * Creates a new automation
   */
  async automationsAdd(
    _root,
    doc: IAutomation,
    { user, models, subdomain }: IContext,
  ) {
    const automation = await models.Automations.create({
      ...doc,
      createdAt: new Date(),
      createdBy: user._id,
      updatedBy: user._id,
    });

    return models.Automations.getAutomation(automation._id);
  },

  /**
   * Updates a automation
   */
  async automationsEdit(
    _root,
    { _id, ...doc }: IAutomationsEdit,
    { user, models, subdomain }: IContext,
  ) {
    const automation = await models.Automations.getAutomation(_id);

    const updated = await models.Automations.updateOne(
      { _id },
      { $set: { ...doc, updatedAt: new Date(), updatedBy: user._id } },
    );

    return models.Automations.getAutomation(_id);
  },

  /**
   * Archive automations
   */

  async archiveAutomations(
    _root,
    { automationIds, isRestore },
    { models }: IContext,
  ) {
    await models.Automations.updateMany(
      { _id: { $in: automationIds } },
      { $set: { status: isRestore ? STATUSES.DRAFT : STATUSES.ARCHIVED } },
    );
    return automationIds;
  },

  /**
   * Save as a template
   */
  async automationsSaveAsTemplate(
    _root,
    {
      _id,
      name,
      duplicate,
    }: { _id: string; name?: string; duplicate?: boolean },
    { user, models, subdomain }: IContext,
  ) {
    const automation = await models.Automations.getAutomation(_id);

    const automationDoc: IAutomationDoc = {
      ...automation,
      createdAt: new Date(),
      createdBy: user._id,
      updatedBy: user._id,
    };

    if (name) {
      automationDoc.name = name;
    }

    if (duplicate) {
      automationDoc.name = `${automationDoc.name} duplicated`;
    } else {
      automationDoc.status = 'template';
    }

    delete automationDoc._id;

    const created = await models.Automations.create({
      ...automationDoc,
    });

    return await models.Automations.getAutomation(created._id);
  },

  /**
   * Save as a template
   */
  async automationsCreateFromTemplate(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext,
  ) {
    const automation = await models.Automations.getAutomation(_id);

    if (automation.status !== 'template') {
      throw new Error('Not template');
    }

    const automationDoc: IAutomationDoc = {
      ...automation,
      status: 'template',
      name: (automation.name += ' from template'),
      createdAt: new Date(),
      createdBy: user._id,
      updatedBy: user._id,
    };

    delete automationDoc._id;

    const created = await models.Automations.create({
      ...automationDoc,
    });

    return await models.Automations.getAutomation(created._id);
  },

  /**
   * Removes automations
   */
  async automationsRemove(
    _root,
    { automationIds }: { automationIds: string[] },
    { models }: IContext,
  ) {
    const automations = await models.Automations.find({
      _id: { $in: automationIds },
    });

    let segmentIds: string[] = [];

    for (const automation of automations) {
      const { triggers, actions } = automation;

      const triggerIds = triggers.map((trigger) => {
        return trigger.config.contentId;
      });

      const actionIds = actions.map((action) => {
        return action.config.contentId;
      });

      segmentIds = [...triggerIds, ...actionIds];
    }

    await models.Automations.deleteMany({ _id: { $in: automationIds } });
    await models.Executions.removeExecutions(automationIds);

    for (const segmentId of segmentIds || []) {
      //   sendSegmentsMessage({
      //     subdomain: '',
      //     action: 'removeSegment',
      //     data: { segmentId }
      //   });
    }

    return automationIds;
  },

  /**
   * Add note
   */
  async automationsAddNote(
    _root,
    doc: INote,
    { user, models, subdomain }: IContext,
  ) {
    const noteDoc = { ...doc, createdBy: user._id };

    const note = await models.Notes.createNote(noteDoc);

    return note;
  },

  /**
   * Edit note
   */
  async automationsEditNote(
    _root,
    { _id, ...doc }: IAutomationNoteEdit,
    { user, models, subdomain }: IContext,
  ) {
    const note = await models.Notes.findOne({ _id });

    if (!note) {
      throw new Error('Note not found');
    }

    const noteDoc = { ...doc, updatedBy: user._id };

    const updated = await models.Notes.updateNote(_id, noteDoc);

    return updated;
  },

  /**
   * Remove note
   */
  async automationsRemoveNote(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext,
  ) {
    const note = await models.Notes.getNote(_id);

    await models.Notes.deleteOne({ _id });

    return note;
  },
};

// checkPermission(automationMutations, 'automationsAdd', 'automationsAdd');
// checkPermission(automationMutations, 'automationsEdit', 'automationsEdit');
// checkPermission(automationMutations, 'automationsRemove', 'automationsRemove');

export default automationMutations;
