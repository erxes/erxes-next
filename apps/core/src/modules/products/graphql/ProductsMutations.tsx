import { gql } from '@apollo/client';

const productsEdit = gql`
  mutation ProductsEdit(
    $_id: String!
    $name: String
    $shortName: String
    $categoryId: String
    $type: String
    $description: String
    $unitPrice: Float
    $code: String
    $customFieldsData: JSON
    $vendorId: String
    $uom: String
  ) {
    productsEdit(
      _id: $_id
      name: $name
      shortName: $shortName
      categoryId: $categoryId
      type: $type
      description: $description
      unitPrice: $unitPrice
      code: $code
      customFieldsData: $customFieldsData
      vendorId: $vendorId
      uom: $uom
    ) {
      _id
    }
  }
`;
export const productsMutations = { productsEdit };
