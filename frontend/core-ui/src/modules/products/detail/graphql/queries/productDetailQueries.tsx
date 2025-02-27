import { gql } from '@apollo/client';

export const productCategoryDetail = gql`
  query productDetail($_id: String) {
  productDetail(_id: $_id) {
    _id
    name
    shortName
    type
    code
    categoryId
    vendorId
    vendor {
      _id
      avatar
      businessType
      code
      createdAt
      customFieldsData
      description
      emails
      industry
      isSubscribed
      links
      location
      mergedIds
      modifiedAt
      names
      ownerId
      parentCompanyId
      phones
      plan
      primaryEmail
      primaryName
      primaryPhone
      score
      size
      tagIds
      trackedData
      website
      __typename
    }
    scopeBrandIds
    status
    description
    unitPrice
    barcodes
    variants
    barcodeDescription
    getTags {
      _id
      name
      colorCode
      __typename
    }
    tagIds
    createdAt
    category {
      _id
      code
      name
      __typename
    }
    attachment {
      url
      name
      size
      type
      __typename
    }
    attachmentMore {
      url
      name
      size
      type
      __typename
    }
    pdfAttachment {
      pdf {
        name
        url
        type
        size
        __typename
      }
      pages {
        name
        url
        type
        size
        __typename
      }
      __typename
    }
    uom
    subUoms
    customFieldsData
    __typename
  }
}
`;