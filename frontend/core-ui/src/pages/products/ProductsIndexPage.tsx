import { ProductsHeader } from '@/products/components/ProductsHeader';
import { useQueryState } from 'nuqs';
import { useAtom } from 'jotai';
import { ProductDetail } from '@/products/detail/components/ProductDetail';
import { renderingProductDetailAtom } from '@/products/states/productDetailStates';
import { ProductsRecordTable } from '@/products/components/ProductsRecordTable';

export const ProductsIndexPage = () => {
  const [renderingProductDetail] = useAtom(renderingProductDetailAtom);
  const [productId] = useQueryState('product_id');
  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <ProductsHeader />
      {!(renderingProductDetail && productId) && <ProductsRecordTable />}
      <ProductDetail />
    </div>
  );
};
// import { useQueryState } from 'nuqs';
// import { ContactsHeader } from '@/contacts/components/ContactsHeader';
// import { ContactsRecordTable } from '@/contacts/components/ContactsRecordTable';
// import { renderingContactDetailAtom } from '@/contacts/detail/states/contactDetailStates';
// import { ContactDetail } from '@/contacts/detail/components/ContactDetail';
// import { useAtom } from 'jotai';
// import { ProductDetail } from '@/products/detail/ProductDetail';
// import { renderingProductDetailAtom } from '@/products/states/productDetailStates';
// import { ProductsRecordTable } from '@/products/components/ProductsRecordTable';
// import { ProductsHeader } from '@/products/components/ProductsHeader';

// export const ContactsIndexPage = () => {
//   const [renderingContactDetail] = useAtom(renderingProductDetailAtom);
//   const [contactId] = useQueryState('product_id');

//   return (
//     <div className="flex flex-col h-full p-3 pt-0">
//       <ProductsHeader />
//       {!(renderingContactDetail && contactId) && <ProductsRecordTable />}
//       <ProductDetail />
//     </div>
//   );
// };
