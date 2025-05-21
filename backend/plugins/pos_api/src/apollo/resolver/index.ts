import Mutation from '@/pos/graphql/resolvers/mutations';

import Query from '@/pos/graphql/resolvers/queries';

import Pos from '@/pos/graphql/resolvers/customResolvers/pos';
import PosOrder from '@/pos/graphql/resolvers/customResolvers/posOrder';
import PosOrderDetail from '@/pos/graphql/resolvers/customResolvers/posOrderDetail';
import PosProduct from '@/pos/graphql/resolvers/customResolvers/posProduct';
import PosCover from '@/pos/graphql/resolvers/customResolvers/posCover';
import PosOrdersByCustomer from '@/pos/graphql/resolvers/customResolvers/posOrdersByCustomer';
import PosOrdersBySubs from '@/pos/graphql/resolvers/customResolvers/posOrdersBySubs';

const resolvers: any = async () => ({
  Pos,
  PosOrder,
  PosProduct,
  PosOrderDetail,
  PosCover,
  PosOrdersByCustomer,
  PosOrdersBySubs,
  Mutation,
  Query
});

export default resolvers;
