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

export const productsQueries = {
  products,
};
