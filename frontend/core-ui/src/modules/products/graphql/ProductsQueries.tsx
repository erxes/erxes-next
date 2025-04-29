import { gql } from '@apollo/client';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

const products = gql`
  query Products(
    $type: String
    $categoryId: String
    $searchValue: String
    $vendorId: String
    $brand: String
    $tag: String
    $segment: String
    $segmentData: String
    $sortField: String
    $sortDirection: Int
     ${GQL_CURSOR_PARAM_DEFS}
  ) {
    products(
      type: $type
      categoryId: $categoryId
      searchValue: $searchValue
      vendorId: $vendorId
      brand: $brand
      tag: $tag
      segment: $segment
      segmentData: $segmentData
      sortField: $sortField
      sortDirection: $sortDirection
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        attachment {
          url
      }
      categoryId
      code
      createdAt
      customFieldsData
      description
      tagIds
      name
      shortName
      uom
      unitPrice
      type
      vendor {
        _id
          primaryName
        }
      }
      ${GQL_PAGE_INFO}
    }
  }
`;

const productCategories = gql`
  query ProductCategories {
    productCategories {
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

const productTags = gql`
  query Tags($searchValue: String, $perPage: Int) {
    tags(type: "core:product", searchValue: $searchValue, perPage: $perPage) {
      _id
      colorCode
      order
      name
    }
  }
`;

export const productsQueries = {
  products,
  productCategories,
  productTags,
};
