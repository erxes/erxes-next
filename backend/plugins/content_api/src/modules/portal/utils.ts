import { IContactsParams } from "@/portal/@types/user";
import { IModels } from "~/connectionResolvers";

export const generateRandomPassword = () => {
    const specials = "!@#$%^&*()_+{}:\"<>?|[];',./`~";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
  
    const pick = (
      exclusions: string,
      string: string,
      min: number,
      max: number
    ) => {
      let n;
      let chars = "";
  
      if (max === undefined) {
        n = min;
      } else {
        n = min + Math.floor(Math.random() * (max - min + 1));
      }
  
      let i = 0;
      while (i < n) {
        const character = string.charAt(
          Math.floor(Math.random() * string.length)
        );
        if (exclusions.indexOf(character) < 0 && chars.indexOf(character) < 0) {
          chars += character;
          i++;
        }
      }
  
      return chars;
    };
  
    const shuffle = (string: string) => {
      const array = string.split("");
      let tmp;
      let current;
      let top = array.length;
  
      if (top) {
        while (--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = array[current];
          array[current] = array[top];
          array[top] = tmp;
        }
  
        return array.join("");
      }
    };
  
    let password = "";
  
    password += pick(password, specials, 1, 1);
    password += pick(password, lowercase, 2, 3);
    password += pick(password, uppercase, 2, 3);
    password += pick(password, numbers, 3, 3);
  
    return shuffle(password);
  };
  

  export const handleContacts = async (args: IContactsParams) => {
    const { subdomain, models, portalId, document, password } = args;
    const { type = 'customer' } = document;
  
    let qry: any = {};
    let user: any;
  
    const trimmedMail = (document.email || '').toLowerCase().trim();
  
    if (document.email) {
      qry = { email: trimmedMail };
    }
  
    if (document.phone) {
      qry = { phone: document.phone };
    }
  
    qry.portalId = portalId;
    
    // TODO: fix
    // if (type === 'customer') {
    //   let customer = await sendCoreMessage({
    //     subdomain,
    //     action: 'customers.findOne',
    //     data: {
    //       customerPrimaryEmail: trimmedMail,
    //       customerPrimaryPhone: document.phone,
    //     },
    //     isRPC: true,
    //   });
  
    //   if (customer) {
    //     qry = { erxesCustomerId: customer._id, portalId };
    //   }
  
    //   user = await models.ClientPortalUsers.findOne(qry);
  
    //   if (user) {
    //     throw new Error('user is already exists');
    //   }
  
    //   user = await models.ClientPortalUsers.create({
    //     ...document,
    //     portalId,
    //     // hash password
    //     password:
    //       password && (await models.ClientPortalUsers.generatePassword(password)),
    //   });
  
    //   if (!customer) {
    //     customer = await sendCoreMessage({
    //       subdomain,
    //       action: 'customers.createCustomer',
    //       data: {
    //         firstName: document.firstName,
    //         lastName: document.lastName,
    //         primaryEmail: trimmedMail,
    //         primaryPhone: document.phone,
    //         state: 'lead',
    //       },
    //       isRPC: true,
    //     });
    //   }
  
    //   if (customer && customer._id) {
    //     user.erxesCustomerId = customer._id;
    //     await models.ClientPortalUsers.updateOne(
    //       { _id: user._id },
    //       { $set: { erxesCustomerId: customer._id } }
    //     );
  
    //     for (const serviceName of await getServices()) {
    //       const serviceConfig = await getService(serviceName);
  
    //       if (serviceConfig.config?.meta?.hasOwnProperty('cpCustomerHandle')) {
    //         if (await isEnabled(serviceName)) {
    //           sendMessage(`${serviceName}:cpCustomerHandle`, {
    //             subdomain,
    //             data: { customer },
    //           });
    //         }
    //       }
    //     }
    //   }
    // }
  
    //TODO: fix
    // if (type === 'company') {
    //   let company = await sendCoreMessage({
    //     subdomain,
    //     action: 'companies.findOne',
    //     data: {
    //       companyPrimaryEmail: trimmedMail,
    //       companyPrimaryPhone: document.phone,
    //       companyCode: document.companyRegistrationNumber,
    //     },
    //     isRPC: true,
    //   });
  
    //   if (company) {
    //     qry = { erxesCompanyId: company._id, portalId };
    //   }
  
    //   user = await models.ClientPortalUsers.findOne(qry);
  
    //   if (user && (user.isEmailVerified || user.isPhoneVerified)) {
    //     throw new Error('user is already exists');
    //   }
  
    //   if (user) {
    //     return user;
    //   }
  
    //   user = await models.ClientPortalUsers.create({
    //     ...document,
    //     portalId,
    //     // hash password
    //     password:
    //       password && (await models.ClientPortalUsers.generatePassword(password)),
    //   });
  
    //   if (!company) {
    //     company = await sendCoreMessage({
    //       subdomain,
    //       action: 'companies.createCompany',
    //       data: {
    //         primaryName: document.companyName,
    //         primaryEmail: trimmedMail,
    //         primaryPhone: document.phone,
    //         code: document.companyRegistrationNumber,
    //       },
    //       isRPC: true,
    //     });
    //   }
  
    //   if (company && company._id) {
    //     user.erxesCompanyId = company._id;
    //     await models.ClientPortalUsers.updateOne(
    //       { _id: user._id },
    //       { $set: { erxesCompanyId: company._id } }
    //     );
  
    //     for (const serviceName of await getServices()) {
    //       const serviceConfig = await getService(serviceName);
  
    //       if (serviceConfig.config?.meta?.hasOwnProperty('cpCustomerHandle')) {
    //         if (await isEnabled(serviceName)) {
    //           sendMessage(`${serviceName}:cpCustomerHandle`, {
    //             subdomain,
    //             data: { company },
    //           });
    //         }
    //       }
    //     }
    //   }
    // }
  
    return user;
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
    portalUserIds
  ) => {
    const userCards = await models.UserCards.find({
      contentType: type,
      contentTypeId: cardId,
    });
    const newCpUsers = portalUserIds.filter(
      (x) => userCards.findIndex((m) => m.portalUserId === x) === -1
    );
  
    const excludedCpUsers = oldportalUserIds.filter((m) => !portalUserIds.includes(m));
  
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
  