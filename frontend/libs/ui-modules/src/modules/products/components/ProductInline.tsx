import { useProductInline } from '../hooks/useProductInline';
import React from 'react';
import { cn, Skeleton, TextOverflowTooltip } from 'erxes-ui';
import { IProduct } from 'ui-modules';

export const ProductInlineRoot = React.forwardRef<
  HTMLSpanElement,
  Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {
    product?: IProduct;
    productId?: string;
  }
>(({ product, productId, className, ...props }, ref) => {
  const { product: fetchedProduct, loading } = useProductInline({
    _id: productId,
  });

  const productData = product || fetchedProduct;

  if (loading) {
    return <Skeleton className="w-24 h-4" />;
  }

  return (
    <span
      className={cn('flex items-center gap-2', className)}
      ref={ref}
      {...props}
    >
      {productData?.code && (
        <span className="text-muted-foreground">({productData.code})</span>
      )}
      <TextOverflowTooltip value={productData?.name} />
    </span>
  );
});

ProductInlineRoot.displayName = 'ProductInline';

export const ProductInline = ProductInlineRoot;
