import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';
import {
  IconDeviceUnknown,
  IconHotelService,
  IconPackage,
  IconStar,
} from '@tabler/icons-react';

const iconMap = {
  unique: IconDeviceUnknown,
  subscription: IconStar,
  service: IconHotelService,
  default: IconPackage,
};

export const ProductTypeIcon = (info: CellContext<ProductT, any>) => {
  const productType = info.row.original.type; // Access the product type directly
  const Icon = iconMap[productType] || iconMap.default;
  return <Icon className="w-5 h-5 text-muted-foreground" />;
};
