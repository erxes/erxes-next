import { gql } from '@apollo/client';

export const GET_SELECT_PRODUCTS = gql`
  query SelectProducts(
    $categoryId: String
    $searchValue: String
    $vendorId: String
    $brand: String
    $tag: String
    $segment: String
    $segmentData: String
    $page: Int
    $perPage: Int
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
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortDirection: $sortDirection
    ) {
      _id
      code
      name
    }
    productsTotalCount(
      type: $type
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

export const GET_PRODUCT_INLINE = gql`
  query ProductInline($_id: String) {
    productDetail(_id: $_id) {
      _id
      name
      code
    }
  }
`;
