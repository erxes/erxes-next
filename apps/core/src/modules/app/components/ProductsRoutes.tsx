import { ProductsPath } from '@/types/ProductsPath';
import { Suspense, lazy } from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router';

const ProductsIndexPage = lazy(() =>
  import('~/pages/products/ProductsIndexPage').then((module) => ({
    default: module.ProductsIndexPage,
  }))
);

const ProductsDetailPage = lazy(() =>
  import('~/pages/products/ProductsDetailPage').then((module) => ({
    default: module.ProductsDetailPage,
  }))
);

export const ProductsRoutes = () => {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route path={ProductsPath.Index} element={<ProductsIndexPage />} />
        <Route path={ProductsPath.Detail} element={<ProductsDetailPage />} />
      </Routes>
    </Suspense>
  );
};
