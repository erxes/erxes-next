import { gql } from '@apollo/client';

const productCategories = gql`
  query ProductCategories(
    $searchValue: String
    $parentId: String
    $withChild: Boolean
  ) {
    productCategories(
      searchValue: $searchValue
      parentId: $parentId
      withChild: $withChild
    ) {
      _id
      parentId
      attachment {
        url
      }
      code
      name
      order
      productCount
    }
  }
`;

const productCategoryDetail = gql`
  query ProductCategories($ids: [String]) {
  productCategories(ids: $ids) {
    _id
    code
    name
  }
}
`;

export const categories = {
  productCategories,
  productCategoryDetail,
};
