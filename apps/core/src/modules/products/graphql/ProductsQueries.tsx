import { gql } from '@apollo/client';

const products = gql`
  query Products(
    $type: String
    $status: String
    $categoryId: String
    $searchValue: String
    $vendorId: String
    $brand: String
    $tag: String
    $segment: String
    $segmentData: String
    $page: Int
    $perPage: Int
    $sortField: String
    $sortDirection: Int
  ) {
    products(
      type: $type
      status: $status
      categoryId: $categoryId
      searchValue: $searchValue
      vendorId: $vendorId
      brand: $brand
      tag: $tag
      segment: $segment
      segmentData: $segmentData
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortDirection: $sortDirection
    ) {
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
      status
      shortName
      taxCode
      taxType
      uom
      unitPrice
      type
      vendor {
        _id
        primaryName
      }
    }
    productsTotalCount(
      type: $type
      status: $status
      categoryId: $categoryId
      searchValue: $searchValue
      vendorId: $vendorId
      brand: $brand
      tag: $tag
      segment: $segment
      segmentData: $segmentData
    )
  }
`;

const productCategories = gql`
  query ProductCategories {
    productCategories {
      _id
      attachment {
        url
      }
      code
      name
      order
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
const productBrands = gql`
query brands($page: Int, $perPage: Int, $searchValue: String) {
  brands(page: $page, perPage: $perPage, searchValue: $searchValue) {
    _id
    code
    name
    createdAt
    description
    emailConfig
    __typename
  }
}`

export const productsQueries = {
  products,
  productCategories,
  productTags,
  productBrands
};
