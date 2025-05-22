import { gql } from '@apollo/client';

const REMOVE_BRANDS = gql`
  mutation BrandsRemove($id: String!) {
    brandsRemove(_id: $id)
  }
`;

export { REMOVE_BRANDS };
