import { IContactsParams } from '@/portal/@types/user';
import { random } from 'erxes-api-shared/src/utils/string';
import { sendTRPCMessage } from 'erxes-api-shared/src/utils/trpc';
import { IModels } from '~/connectionResolvers';

export const handleContacts = async (args: IContactsParams) => {
  const { models, portalId, document, password = random('Aa0!', 8) } = args;
  const { type = 'customer' } = document;
  const trimmedMail = (document.email || '').toLowerCase().trim();
  const phone = document.phone;

  let qry: any = {
    portalId,
    ...(phone ? { phone } : {}),
    ...(document.email && !phone ? { email: trimmedMail } : {}),
  };

  let user: any;

  if (type === 'customer') {
    const customer = await findOrCreateCustomer(trimmedMail, phone, document);
    qry = { erxesCustomerId: customer._id, portalId };

    user = await models.Users.findOne(qry);
    if (user) {
      throw new Error('user is already exists');
    }

    user = await createUser(models, document, password, portalId);
    await linkCustomerToUser(models, user._id, customer._id);

    // TODO: fix
    // for (const serviceName of await getServices()) {
    //   const serviceConfig = await getService(serviceName);

    //   if (serviceConfig.config?.meta?.hasOwnProperty('cpCustomerHandle')) {
    //     if (await isEnabled(serviceName)) {
    //       sendMessage(`${serviceName}:cpCustomerHandle`, {
    //         subdomain,
    //         data: { customer },
    //       });
    //     }
    //   }
    // }
  }

  if (type === 'company') {
    const company = await findOrCreateCompany(trimmedMail, phone, document);

    qry = { erxesCompanyId: company._id, portalId };
    user = await models.Users.findOne(qry);

    if (user && (user.isEmailVerified || user.isPhoneVerified)) {
      throw new Error('user is already exists');
    }

    if (!user) {
      user = await createUser(models, document, password, portalId);
    }

    await linkCompanyToUser(models, user._id, company._id);

    // TODO: fix
    // for (const serviceName of await getServices()) {
    //   const serviceConfig = await getService(serviceName);

    //   if (serviceConfig.config?.meta?.hasOwnProperty('cpCustomerHandle')) {
    //     if (await isEnabled(serviceName)) {
    //       sendMessage(`${serviceName}:cpCustomerHandle`, {
    //         subdomain,
    //         data: { company },
    //       });
    //     }
    //   }
    // }
  }

  return user;
};

// Helpers

const findOrCreateCustomer = async (email: string, phone: string, doc: any) => {
  let customer = await sendTRPCMessage({
    pluginName: 'core',
    method: 'query',
    module: 'customers',
    action: 'findOne',
    input: {
      $or: [{ customerPrimaryEmail: email }, { customerPrimaryPhone: phone }],
    },
  });

  if (!customer) {
    customer = await sendTRPCMessage({
      pluginName: 'core',
      method: 'mutation',
      module: 'customers',
      action: 'createCustomer',
      input: {
        firstName: doc.firstName,
        lastName: doc.lastName,
        primaryEmail: email,
        primaryPhone: phone,
        state: 'lead',
      },
    });
  }

  return customer;
};

const findOrCreateCompany = async (email: string, phone: string, doc: any) => {
  let company = await sendTRPCMessage({
    pluginName: 'core',
    method: 'query',
    module: 'companies',
    action: 'findOne',
    input: {
      $or: [{ primaryEmail: email }, { primaryPhone: phone }],
    },
  });

  if (!company) {
    company = await sendTRPCMessage({
      pluginName: 'core',
      method: 'mutation',
      module: 'companies',
      action: 'createCompany',
      input: {
        primaryName: doc.companyName,
        primaryEmail: email,
        primaryPhone: phone,
        code: doc.companyRegistrationNumber,
      },
    });
  }

  return company;
};

const createUser = async (
  models: any,
  doc: any,
  password: string,
  portalId: string,
) => {
  return await models.Users.create({
    ...doc,
    portalId,
    password: password && (await models.Users.generatePassword(password)),
  });
};

const linkCustomerToUser = async (
  models: any,
  userId: string,
  customerId: string,
) => {
  await models.Users.updateOne(
    { _id: userId },
    { $set: { erxesCustomerId: customerId } },
  );
};

const linkCompanyToUser = async (
  models: any,
  userId: string,
  companyId: string,
) => {
  await models.Users.updateOne(
    { _id: userId },
    { $set: { erxesCompanyId: companyId } },
  );
};

export const putActivityLog = async (subdomain, user) => {
  let contentType = 'core:customer';
  let contentId = user.erxesCustomerId;

  if (user.type === 'company') {
    contentType = 'core:company';
    contentId = user.erxesCompanyId;
  }

  //TODO: fix
  // await sendMessage('putActivityLog', {
  //   subdomain,
  //   data: {
  //     action: 'putActivityLog',
  //     data: {
  //       contentType,
  //       contentId,
  //       createdBy: user.portalId,
  //       action: 'create',
  //     },
  //   },
  // });
};

export const handleDeviceToken = async (user, deviceToken) => {
  if (deviceToken) {
    const deviceTokens: string[] = user.deviceTokens || [];

    if (!deviceTokens.includes(deviceToken)) {
      deviceTokens.push(deviceToken);

      await user.updateOne({ $set: { deviceTokens } });
    }
  }
};

export const createCard = async (subdomain, models, cpUser, doc) => {
  //TODO: fix
  // const customer = await sendCoreMessage({
  //   subdomain,
  //   action: 'customers.findOne',
  //   data: {
  //     _id: cpUser.erxesCustomerId,
  //   },
  //   isRPC: true,
  // });
  // if (!customer) {
  //   throw new Error('Customer not registered');
  // }
  // const {
  //   type,
  //   subject,
  //   description,
  //   stageId,
  //   parentId,
  //   closeDate,
  //   startDate,
  //   customFieldsData,
  //   attachments,
  //   labelIds,
  //   productsData,
  // } = doc;
  // let priority = doc.priority;
  // if (['High', 'Critical'].includes(priority)) {
  //   priority = 'Normal';
  // }
  // let card = {} as any;
  // const data = {
  //   userId: cpUser.userId,
  //   name: subject,
  //   description,
  //   priority,
  //   stageId,
  //   status: 'active',
  //   customerId: customer._id,
  //   createdAt: new Date(),
  //   stageChangedDate: null,
  //   parentId,
  //   closeDate,
  //   startDate,
  //   customFieldsData,
  //   attachments,
  //   labelIds,
  //   productsData,
  // };
  // switch (type) {
  //   case 'deal':
  //     card = await sendSalesMessage({
  //       subdomain,
  //       action: `${type}s.create`,
  //       data,
  //       isRPC: true,
  //     });
  //     break;
  //   case 'ticket':
  //     card = await sendTicketsMessage({
  //       subdomain,
  //       action: `${type}s.create`,
  //       data,
  //       isRPC: true,
  //     });
  //     break;
  //   case 'task':
  //     card = await sendTasksMessage({
  //       subdomain,
  //       action: `${type}s.create`,
  //       data,
  //       isRPC: true,
  //     });
  //     break;
  //   case 'purchase':
  //     card = await sendPurchasesMessage({
  //       subdomain,
  //       action: `${type}s.create`,
  //       data,
  //       isRPC: true,
  //     });
  //     break;
  // }
  // await models.ClientPortalUserCards.createOrUpdateCard({
  //   contentType: type,
  //   contentTypeId: card._id,
  //   portalUserId: cpUser.userId,
  // });
  // return card;
};

export const participantEditRelation = async (
  subdomain,
  models: IModels,
  type,
  cardId,
  oldportalUserIds,
  portalUserIds,
) => {
  const userCards = await models.UserCards.find({
    contentType: type,
    contentTypeId: cardId,
  });
  const newCpUsers = portalUserIds.filter(
    (x) => userCards.findIndex((m) => m.portalUserId === x) === -1,
  );

  const excludedCpUsers = oldportalUserIds.filter(
    (m) => !portalUserIds.includes(m),
  );

  if (newCpUsers) {
    const docs = newCpUsers.map((d) => ({
      contentType: type,
      contentTypeId: cardId,
      portalUserId: d,
    }));
    await models.UserCards.insertMany(docs);
  }
  if (excludedCpUsers) {
    await models.UserCards.deleteMany({
      contentType: type,
      contentTypeId: cardId,
      portalUserId: { $in: excludedCpUsers },
    });
  }

  return 'ok';
};

export const escapeRegex = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
