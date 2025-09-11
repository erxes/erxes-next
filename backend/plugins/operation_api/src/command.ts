import * as dotenv from 'dotenv';

dotenv.config();

import { Db, MongoClient, ObjectId } from 'mongodb';

const { MONGO_URL = 'mongodb://localhost:27017/erxes?directConnection=true' } =
  process.env;

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);

let db: Db;
let COLLECTIONS: Record<string, any>;

const updateDocuments = async (
  collection: any,
  filter: Record<string, any>,
  updateFn: (doc: any) => Record<string, any>,
) => {
  const documents = await collection.find(filter);
  for await (const doc of documents) {
    const update = updateFn(doc);
    if (Object.keys(update).length) {
      await collection.updateOne({ _id: doc._id }, { $set: update });
    }
  }
};

const updateMany = async ({
  relations,
  relationFields,
  stringId,
  objectId,
}: {
  relations: string[];
  relationFields: Record<string, string>;
  stringId: string;
  objectId: ObjectId;
}) => {
  for (const relation of relations) {
    const relationField = relationFields[relation];
    const collection = COLLECTIONS[relation];

    switch (relation) {
      case 'projects':
        await updateDocuments(collection, { teamIds: stringId }, (doc) => ({
          teamIds: doc.teamIds.map((id: any) =>
            id === stringId ? objectId : id,
          ),
        }));
        break;

      case 'notes':
        await collection.updateMany(
          { itemId: stringId },
          { $set: { contentId: objectId }, $unset: { itemId: '' } },
        );
        break;

      case 'activities':
        if (relationField === 'metadata') {
          await updateDocuments(
            collection,
            {
              $or: [
                { 'metadata.newValue': stringId },
                { 'metadata.previousValue': stringId },
              ],
            },
            (doc) => {
              const update: Record<string, any> = {};
              if (doc.metadata?.newValue === stringId)
                update['metadata.newValue'] = objectId;
              if (doc.metadata?.previousValue === stringId)
                update['metadata.previousValue'] = objectId;
              return update;
            },
          );
        } else {
          await collection.updateMany(
            { [relationField]: stringId },
            { $set: { [relationField]: objectId } },
          );
        }
        break;

      default:
        await collection.updateMany(
          { [relationField]: stringId },
          { $set: { [relationField]: objectId } },
        );
    }
  }
};

const replaceRelationId = async ({ stringId, objectId, module }: any) => {
  switch (module) {
    case 'teams': {
      try {
        console.log(`Updating team relations: ${stringId}`);

        await updateMany({
          relations: ['teamMembers', 'tasks', 'cycles', 'statuses', 'projects'],
          relationFields: {
            teamMembers: 'teamId',
            tasks: 'teamId',
            cycles: 'teamId',
            statuses: 'teamId',
            projects: 'teamId',
          },
          stringId,
          objectId,
        });

        console.log(`Updated team relations: ${stringId}`);
      } catch (error) {
        console.log(
          `Error occurred while updating team relations: ${error.message}`,
        );
      }

      break;
    }

    case 'cycles': {
      try {
        console.log(`Updating cycle relations: ${stringId}`);

        await updateMany({
          relations: ['tasks', 'activities'],
          relationFields: {
            tasks: 'cycleId',
            activities: 'metadata',
          },
          stringId,
          objectId,
        });

        console.log(`Updated cycle relations: ${stringId}`);
      } catch (error) {
        console.log(
          `Error occurred while updating cycle relations: ${error.message}`,
        );
      }

      break;
    }

    case 'projects': {
      try {
        console.log(`Updating project relations: ${stringId}`);

        await updateMany({
          relations: ['tasks', 'activities'],
          relationFields: {
            tasks: 'projectId',
            activities: 'contentId',
          },
          stringId,
          objectId,
        });

        console.log(`Updated project relations: ${stringId}`);
      } catch (error) {
        console.log(
          `Error occurred while updating project relations: ${error.message}`,
        );
      }

      break;
    }

    case 'tasks': {
      try {
        console.log(`Updating task relations: ${stringId}`);

        await updateMany({
          relations: ['notes', 'activities'],
          relationFields: {
            notes: 'contentId',
            activities: 'contentId',
          },
          stringId,
          objectId,
        });

        console.log(`Updated task relations: ${stringId}`);
      } catch (error) {
        console.log(
          `Error occurred while updating task relations: ${error.message}`,
        );
      }

      break;
    }

    case 'statuses': {
      try {
        console.log(`Updating status relations: ${stringId}`);

        await updateMany({
          relations: ['tasks', 'activities'],
          relationFields: {
            tasks: 'status',
            activities: 'metadata',
          },
          stringId,
          objectId,
        });

        console.log(`Updated status relations: ${stringId}`);
      } catch (error) {
        console.log(
          `Error occurred while updating status relations: ${error.message}`,
        );
      }

      break;
    }

    case 'notes': {
      try {
        console.log(`Updating note relations: ${stringId}`);

        await updateMany({
          relations: ['activities'],
          relationFields: {
            activities: 'metadata',
          },
          stringId,
          objectId,
        });

        console.log(`Updated note relations: ${stringId}`);
      } catch (error) {
        console.log(
          `Error occurred while updating note relations: ${error.message}`,
        );
      }

      break;
    }
  }
};

const command = async () => {
  await client.connect();
  db = client.db() as Db;

  COLLECTIONS = {
    tasks: db.collection('operation_tasks'),
    teams: db.collection('operation_teams'),
    teamMembers: db.collection('operation_team_members'),
    statuses: db.collection('operation_statuses'),
    projects: db.collection('operation_projects'),
    notes: db.collection('operation_notes'),
    activities: db.collection('operation_activities'),
    cycles: db.collection('operation_cycles'),
  };

  try {
    const operations = Object.keys(COLLECTIONS);

    for (const operation of operations) {
      const collection = COLLECTIONS[operation];

      console.log(`Processing collection: ${collection.collectionName}`);

      const collectionName = `${collection.collectionName}_migrated`;

      const migratedCollection = db.collection(collectionName);

      const documents = await collection.find({});

      for await (const document of documents) {
        const { _id, ...fields } = document;

        const objectId = new ObjectId();

        const migratedDocument = {
          _id: objectId,
          ...fields,
        };

        await migratedCollection.insertOne(migratedDocument);

        await replaceRelationId({
          stringId: _id,
          objectId: objectId,
          module: operation,
        });
      }

      await collection.drop();
      console.log(`Dropped old collection: ${collection.collectionName}`);

      await migratedCollection.rename(collection.collectionName);
      console.log(`Renamed ${collectionName} → ${collection.collectionName}`);
    }
  } catch (e) {
    console.log(`Error occurred: ${e.message}`);
  } finally {
    await client.close();
  }

  console.log(`Process finished at: ${new Date().toISOString()}`);
};

command();
