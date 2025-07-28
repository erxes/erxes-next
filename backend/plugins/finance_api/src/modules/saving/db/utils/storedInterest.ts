import { getFullDate } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import { IContractDocument } from '~/modules/saving/@types/contracts';
import { calcInterest, getDiffDay } from '~/modules/saving/db/utils/utils';
import BigNumber from 'bignumber.js';

export default async function storedInterest(
  contract: IContractDocument,
  models: IModels,
  date?: Date,
) {
  const nowDate = getFullDate(date || new Date());

  var mustStoreInterest = 0;

  const transactions = await models.Transactions.find({
    payDate: { $gt: contract.lastStoredDate },
  });

  var currentDate = getFullDate(contract.lastStoredDate);

  for await (let transaction of transactions) {
    const nextDate = getFullDate(transaction.payDate);
    const diffDays = getDiffDay(currentDate, nextDate);

    const storeInterest = calcInterest({
      balance: transaction.balance || 0,
      interestRate: contract.interestRate,
      dayOfMonth: diffDays,
    });

    mustStoreInterest = new BigNumber(storeInterest)
      .plus(mustStoreInterest)
      .toNumber();

    //transaction update action for store insterest
    await models.Transactions.updateOne(
      { _id: transaction._id },
      {
        $set: {
          storeReaction: {
            diffDays,
            beginDate: currentDate,
            nextDate,
            storeInterest,
          },
        },
      },
    );
    currentDate = nextDate;
  }

  if (transactions.length === 0) {
    const diffDays = getDiffDay(currentDate, date || new Date());

    mustStoreInterest = calcInterest({
      balance: contract.savingAmount || 0,
      interestRate: contract.interestRate,
      dayOfMonth: diffDays,
    });
  } else {
    const diffDays = getDiffDay(currentDate, nowDate);

    let interest = calcInterest({
      balance: contract.savingAmount || 0,
      interestRate: contract.interestRate,
      dayOfMonth: diffDays,
    });

    mustStoreInterest = new BigNumber(interest)
      .plus(mustStoreInterest)
      .toNumber();
  }

  //contract increase store action
  await models.StoredInterest.create({
    description: `store interest action`,
    invDate: nowDate,
    prevStoredDate: contract.lastStoredDate,
    amount: contract._id,
    type: `storedInterest`,
  });

  await models.Contracts.updateOne(
    { _id: contract._id },
    {
      $set: { lastStoredDate: nowDate },
      $inc: { storedInterest: mustStoreInterest },
    },
  );
}
