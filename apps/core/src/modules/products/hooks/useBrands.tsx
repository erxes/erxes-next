import { useQuery } from "@apollo/client";
import { productsQueries } from "../graphql/ProductsQueries";
import { QueryHookOptions } from "@apollo/client";

export const useBrands = (options: QueryHookOptions) => {
    const { data, loading } = useQuery(
      productsQueries.productBrands,
      options
    );
  
    return {
      brands: data?.brands,
      loading,
    };
  };
  