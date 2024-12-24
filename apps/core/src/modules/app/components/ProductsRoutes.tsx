import { ProductsPath } from '@/types/ProductsPath';
import { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

import { useRecoilValue } from 'recoil';
import { currentOrganizationState } from 'erxes-shared-states';

const ProductsIndexPage = lazy(() =>
  import('~/pages/products/ProductsIndexPage').then((module) => ({
    default: module.ProductsIndexPage,
  }))
);

const ProductsRoutes = () => {
  const currentOrganization = useRecoilValue(currentOrganizationState);
  const plugins = currentOrganization?.plugins;

  console.log('plugins', plugins);

  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route path={ProductsPath.Index} element={<ProductsIndexPage />} />
      </Routes>
    </Suspense>
  );
};

export default ProductsRoutes;
