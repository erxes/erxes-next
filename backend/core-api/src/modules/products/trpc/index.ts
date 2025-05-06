import { initTRPC } from '@trpc/server';

import { productCategoryTrpcRouter } from '@/products/trpc/category';
import { productConfigTrpcRouter } from '@/products/trpc/config';
import { productTrpcRouter } from '@/products/trpc/product';
import { uomTrpcRouter } from '@/products/trpc/uom';

const t = initTRPC.create();

export const productRouter = t.mergeRouters(
  productTrpcRouter,
  uomTrpcRouter,
  productCategoryTrpcRouter,
  productConfigTrpcRouter,
);
