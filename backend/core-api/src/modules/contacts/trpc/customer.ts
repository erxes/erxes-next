import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ITRPCContext } from '~/init-trpc';
import { AWS_EMAIL_STATUSES, EMAIL_VALIDATION_STATUSES } from '../constants';
import { createOrUpdate } from './utils';

const t = initTRPC.context<ITRPCContext>().create();

export const customerRouter = t.router({
  customer: t.router({
    find: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { query } = input;
      const { models } = ctx;

      return {
        success: true,
        data: await models.Customers.find(query).lean(),
      };
    }),

    findOne: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { query } = input;
      const { models } = ctx;

      const defaultFilter = { status: { $ne: 'deleted' } };

      if (query.customerPrimaryEmail) {
        defaultFilter['$or'] = [
          { emails: { $in: [query.customerPrimaryEmail] } },
          { primaryEmail: query.customerPrimaryEmail },
        ];
      }

      if (query.customerPrimaryPhone) {
        defaultFilter['$or'] = [
          { phones: { $in: [query.customerPrimaryPhone] } },
          { primaryPhone: query.customerPrimaryPhone },
        ];
      }

      if (query.customerCode) {
        defaultFilter['code'] = query.customerCode;
      }

      if (query._id) {
        defaultFilter['_id'] = query._id;
      }

      return {
        success: true,
        data: await models.Customers.findOne(defaultFilter).lean(),
      };
    }),

    findActiveCustomers: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { query, fields, skip, limit } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.findActiveCustomers(
            query,
            fields,
            skip,
            limit,
          ),
        };
      }),

    getCustomerName: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { customer } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.getCustomerName(customer),
        };
      }),

    getWidgetCustomer: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { _id } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.getWidgetCustomer(_id),
        };
      }),

    count: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { query } = input;
      const { models } = ctx;

      return {
        success: true,
        data: await models.Customers.find(query).countDocuments(),
      };
    }),

    createCustomer: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { doc } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.createCustomer(doc),
        };
      }),

    updateCustomer: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { _id, doc } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.updateCustomer(_id, doc),
        };
      }),

    updateOne: t.procedure.input(z.any()).mutation(async ({ ctx, input }) => {
      const { query, doc } = input;
      const { models } = ctx;

      return {
        success: true,
        data: await models.Customers.updateOne(query, doc),
      };
    }),

    updateMany: t.procedure.input(z.any()).mutation(async ({ ctx, input }) => {
      const { query, doc } = input;
      const { models } = ctx;

      return {
        success: true,
        data: await models.Customers.updateMany(query, doc),
      };
    }),

    removeCustomers: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { _ids } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.removeCustomers(_ids),
        };
      }),

    markCustomerAsActive: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { _id } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.markCustomerAsActive(_id),
        };
      }),

    createMessengerCustomer: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { doc, customData } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.createMessengerCustomer({
            doc,
            customData,
          }),
        };
      }),

    updateMessengerCustomer: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { _id, doc, customData } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.updateMessengerCustomer({
            _id,
            doc,
            customData,
          }),
        };
      }),

    saveVisitorContactInfo: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { params } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.saveVisitorContactInfo(params),
        };
      }),

    updateLocation: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { customerId, browserInfo } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.updateLocation(customerId, browserInfo),
        };
      }),

    updateSession: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { customerId } = input;
        const { models } = ctx;

        return {
          success: true,
          data: await models.Customers.updateSession(customerId),
        };
      }),

    setUnsubscribed: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { customerIds = [], status, _id } = input;
        const { models } = ctx;

        const update: any = { isSubscribed: 'No' };

        if (status === AWS_EMAIL_STATUSES.BOUNCE) {
          update.emailValidationStatus = EMAIL_VALIDATION_STATUSES.INVALID;
        }

        if (_id && status) {
          return {
            success: true,
            data: await models.Customers.updateOne({ _id }, { $set: update }),
          };
        }

        if (customerIds.length > 0 && !status) {
          return {
            success: true,
            data: await models.Customers.updateMany(
              { _id: { $in: customerIds } },
              { $set: update },
            ),
          };
        }
      }),

    createOrUpdate: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { doc } = input;
        const { models } = ctx;

        const customer = await createOrUpdate({
          collection: models.Customers,
          data: doc,
        });

        return {
          success: true,
          data: customer,
        };
      }),
  }),
});
