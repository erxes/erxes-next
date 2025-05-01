import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ITRPCContext } from '~/init-trpc';

const t = initTRPC.context<ITRPCContext>().create();

export const conformityTrpcRouter = t.router({
  conformity: t.router({
    addConformity: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.addConformity(input),
        };
      }),

    savedConformity: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.savedConformity(input),
        };
      }),

    create: t.procedure.input(z.any()).mutation(async ({ ctx, input }) => {
      const { models } = ctx;
      return {
        success: true,
        data: await models.Conformities.create(input),
      };
    }),

    removeConformities: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.removeConformities(input),
        };
      }),

    removeConformity: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.removeConformity(input),
        };
      }),

    getConformities: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.getConformities(input),
        };
      }),

    addConformities: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.addConformities(input),
        };
      }),

    relatedConformity: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.relatedConformity(input),
        };
      }),

    filterConformity: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.filterConformity(input),
        };
      }),

    changeConformity: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.changeConformity(input),
        };
      }),

    findConformities: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.find(input).lean(),
        };
      }),

    editConformity: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { models } = ctx;
        return {
          success: true,
          data: await models.Conformities.editConformity(input),
        };
      }),
  }),
});
