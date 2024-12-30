import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';
import {
  IconDeviceUnknown,
  IconHotelService,
  IconPackage,
  IconStar,
} from '@tabler/icons-react';
import { cn } from 'erxes-ui';
const iconMap = {
  unique: IconDeviceUnknown,
  subscription: IconStar,
  service: IconHotelService,
  default: IconPackage,
};

export const ProductTypeIcon = ({
  info,
  type,
  className,
}: {
  info?: CellContext<ProductT, unknown>;
  type?: ProductT['type'];
  className?: string;
}) => {
  const productType = type || info?.row.original.type; // Access the product type directly
  const Icon = iconMap[productType as keyof typeof iconMap] || iconMap.default;
  return <Icon className={cn('w-5 h-5 text-muted-foreground', className)} />;
};
