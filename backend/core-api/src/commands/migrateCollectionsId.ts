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

const command = async () => {
  await client.connect();
  db = client.db() as Db;

  try {
    const collections = await db.collections();

    for await (const collection of collections) {
      console.log(`Processing collection: ${collection.collectionName}`);

      const collectionName = `${collection.collectionName}_migrated`;

      const migratedCollection = db.collection(collectionName);

      try {
        const documents = collection.find({});

        for await (const document of documents) {
          const { _id, ...fields } = document;

          const migratedDocument = {
            _id: new ObjectId(),
            ...fields,
          };

          await migratedCollection.insertOne(migratedDocument);
        }

        await collection.drop();
        console.log(`Dropped old collection: ${collection.collectionName}`);

        await migratedCollection.rename(collection.collectionName);
        console.log(`Renamed ${collectionName} → ${collection.collectionName}`);
      } catch (error) {
        console.log(
          `Error occurred while updating collection ${collection.collectionName}: ${error}`,
        );
      }
    }
  } catch (error) {
    console.log(`Error occurred: ${error}`);
  } finally {
    await client.close();
  }

  console.log(`Process finished at: ${new Date().toISOString()}`);
};

command();
