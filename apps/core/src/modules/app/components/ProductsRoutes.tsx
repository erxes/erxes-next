import { ProductsPath } from '@/types/ProductsPath';
import { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

const ProductsIndexPage = lazy(() =>
  import('~/app/products/ProductsIndexPage').then((module) => ({
    default: module.ProductsIndexPage,
  }))
);

const ProductsRoutes = () => {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route path={ProductsPath.Index} element={<ProductsIndexPage />} />
      </Routes>
    </Suspense>
  );
};

export default ProductsRoutes;
