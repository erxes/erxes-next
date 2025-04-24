export const createOrUpdate = async ({
  collection,
  data: { rows, doNotReplaceExistingValues },
}) => {
  const operations: any = [];

  for (const row of rows) {
    const { selector, doc, customFieldsData } = row;

    const prevEntry = await collection.findOne(selector).lean();

    if (prevEntry) {
      let cfData = prevEntry.customFieldsData || [];

      // remove existing rows
      for (const cf of customFieldsData || []) {
        cfData = cfData.filter(({ field }) => field !== cf.field);
      }

      // add new rows
      for (const cf of customFieldsData || []) {
        cfData.push(cf);
      }

      const newDoc = { ...doc };

      if (doNotReplaceExistingValues) {
        for (const fieldName of Object.keys(doc)) {
          if (prevEntry[fieldName]) {
            delete newDoc[fieldName];
          }
        }
      }

      newDoc.customFieldsData = cfData;

      operations.push({
        updateOne: { filter: selector, update: { $set: newDoc } },
      });
    } else {
      doc.customFieldsData = customFieldsData;
      doc.createdAt = new Date();
      doc.modifiedAt = new Date();
      operations.push({ insertOne: { document: doc } });
    }
  }

  return collection.bulkWrite(operations);
};
