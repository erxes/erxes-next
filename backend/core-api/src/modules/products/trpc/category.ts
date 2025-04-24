import { initTRPC } from '@trpc/server';
import { escapeRegExp } from 'erxes-api-shared/utils';
import { z } from 'zod';
import { ITRPCContext } from '~/init-trpc';

const t = initTRPC.context<ITRPCContext>().create();

export const productCategoryTrpcRouter = t.router({
  categories: t.router({
    find: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { query, sort, regData } = input;
      const { models } = ctx;

      if (regData) {
        return await models.ProductCategories.find({
          ...query,
          order: { $regex: new RegExp(escapeRegExp(regData)) },
        }).sort(sort);
      }

      const productCategories = await models.ProductCategories.find(query)
        .sort(sort)
        .lean();

      return productCategories;
    }),

    findOne: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { query } = input;
      const { models } = ctx;

      const productCategory = await models.ProductCategories.findOne(
        query,
      ).lean();

      return productCategory;
    }),

    withChilds: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { _ids } = input;
      const { models } = ctx;

      const productCategories =
        await models.ProductCategories.getChildCategories(_ids);

      return productCategories;
    }),

    createProductCategory: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { doc } = input;
        const { models } = ctx;

        const productCategory =
          await models.ProductCategories.createProductCategory(doc);

        return productCategory;
      }),

    updateProductCategory: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { _id, doc } = input;
        const { models } = ctx;

        const productCategory =
          await models.ProductCategories.updateProductCategory(_id, doc);

        return productCategory;
      }),

    removeProductCategory: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { _id } = input;
        const { models } = ctx;

        const productCategory =
          await models.ProductCategories.removeProductCategory(_id);

        return productCategory;
      }),

    count: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { query } = input;
      const { models } = ctx;

      const count = await models.ProductCategories.find(query).countDocuments();

      return count;
    }),
  }),
});
