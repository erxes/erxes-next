import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { sendSms } from '~/modules/portal/utils/common';
import { ContentTRPCContext } from '~/trpc/init-trpc';

const t = initTRPC.context<ContentTRPCContext>().create();

export const portalRouter = t.router({
  findOne: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
    const { models } = ctx;
    try {
      const result = await models.Portals.findOne(input).lean();

      if (!result) {
        return {
          status: 'error',
          error: {
            code: 'NOT_FOUND',
            message: 'Portal not found',
            suggestion: 'Please verify the search criteria',
          },
          timestamp: new Date().toISOString(),
        };
      }

      return {
        status: 'success',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('FindOne operation failed:', error);

      return {
        status: 'error',
        error: {
          code: 'FIND_ONE_FAILED',
          message: 'Failed to find portal',
          details: error instanceof Error ? error.message : 'Database error',
          ...(process.env.NODE_ENV === 'development' && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }),

  find: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
    const { models } = ctx;
    try {
      const result = await models.Portals.find(input).lean();

      return {
        status: 'success',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('FindAll operation failed:', error);

      return {
        status: 'error',
        error: {
          code: 'FIND_ALL_FAILED',
          message: 'Failed to find all portals',
          details: error instanceof Error ? error.message : 'Database error',
          ...(process.env.NODE_ENV === 'development' && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }),

  count: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
    const { models } = ctx;
    try {
      const result = await models.Portals.countDocuments(input);

      return {
        status: 'success',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Count operation failed:', error);

      return {
        status: 'error',
        error: {
          code: 'COUNT_FAILED',
          message: 'Failed to count portals',
          details: error instanceof Error ? error.message : 'Database error',
          ...(process.env.NODE_ENV === 'development' && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }),

  sendSms: t.procedure.input(z.any()).mutation(async ({ ctx, input }) => {
    const { type, to, content } = input;
    try {
      await sendSms(type, to, content);
      return {
        status: 'success',
        data: {},
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('SendSms operation failed:', error);

      return {
        status: 'error',
        error: {
          code: 'SEND_SMS_FAILED',
          message: 'Failed to send sms',
          details: error instanceof Error ? error.message : 'Database error',
          ...(process.env.NODE_ENV === 'development' && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }),
});

export const portalUserRouter = t.router({
  findOne: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
    const { models } = ctx;
    try {
      const result = await models.Users.findOne(input).lean();

      if (!result) {
        return {
          status: 'error',
          error: {
            code: 'NOT_FOUND',
            message: 'Portal User not found',
            suggestion: 'Please verify the search criteria',
          },
          timestamp: new Date().toISOString(),
        };
      }

      return {
        status: 'success',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('FindOne operation failed:', error);

      return {
        status: 'error',
        error: {
          code: 'FIND_ONE_FAILED',
          message: 'Failed to find portal user',
          details: error instanceof Error ? error.message : 'Database error',
          ...(process.env.NODE_ENV === 'development' && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }),
  find: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
    const { models } = ctx;
    try {
      const result = await models.Users.find(input).lean();

      return {
        status: 'success',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Find operation failed:', error);

      return {
        status: 'error',
        error: {
          code: 'FIND_FAILED',
          message: 'Failed to find portal users',
          details: error instanceof Error ? error.message : 'Database error',
          ...(process.env.NODE_ENV === 'development' && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }),
  count: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
    const { models } = ctx;
    try {
      const result = await models.Users.countDocuments(input);

      return {
        status: 'success',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Count operation failed:', error);

      return {
        status: 'error',
        error: {
          code: 'COUNT_FAILED',
          message: 'Failed to count portal users',
          details: error instanceof Error ? error.message : 'Database error',
          ...(process.env.NODE_ENV === 'development' && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }),

  userIds: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
    const { models } = ctx;
    try {
      const result = await models.Users.find(input).distinct('_id');

      return {
        status: 'success',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Distinct operation failed:', error);

      return {
        status: 'error',
        error: {
          code: 'DISTINCT_FAILED',
          message: 'Failed to distinct portal users',
          details: error instanceof Error ? error.message : 'Database error',
          ...(process.env.NODE_ENV === 'development' && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }),

  create: t.procedure.input(z.any()).mutation(async ({ ctx, input }) => {
    const { models } = ctx;
    try {
      const result = await models.Users.create(input);

      return {
        status: 'success',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Create operation failed:', error);

      return {
        status: 'error',
        error: {
          code: 'CREATE_FAILED',
          message: 'Failed to count portal users',
          details: error instanceof Error ? error.message : 'Database error',
          ...(process.env.NODE_ENV === 'development' && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }),
});
