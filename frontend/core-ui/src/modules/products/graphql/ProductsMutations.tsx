import { gql } from '@apollo/client';

const productsAdd = gql`
  mutation productsAdd(
    $name: String
    $shortName: String
    $type: String
    $categoryId: String
    $description: String
    $barcodes: [String]
    $variants: JSON
    $barcodeDescription: String
    $unitPrice: Float
    $code: String
    $customFieldsData: JSON
    $attachment: AttachmentInput
    $attachmentMore: [AttachmentInput]
    $pdfAttachment: PdfAttachmentInput
    $vendorId: String
    $scopeBrandIds: [String]
    $uom: String
    $subUoms: JSON
  ) {
    productsAdd(
      name: $name
      shortName: $shortName
      type: $type
      categoryId: $categoryId
      description: $description
      barcodes: $barcodes
      variants: $variants
      barcodeDescription: $barcodeDescription
      unitPrice: $unitPrice
      code: $code
      customFieldsData: $customFieldsData
      attachment: $attachment
      attachmentMore: $attachmentMore
      pdfAttachment: $pdfAttachment
      vendorId: $vendorId
      scopeBrandIds: $scopeBrandIds
      uom: $uom
      subUoms: $subUoms
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
      shortName
      uom
      unitPrice
      type
      vendor {
        _id
        primaryName
      }
    }
  }
`;

const productsEdit = gql`
  mutation ProductsEdit(
    $_id: String!
    $name: String
    $shortName: String
    $barcodes: [String]
    $categoryId: String
    $type: String
    $description: String
    $unitPrice: Float
    $code: String
    $customFieldsData: JSON
    $vendorId: String
    $uom: String
    $barcodeDescription: String
  ) {
    productsEdit(
      _id: $_id
      name: $name
      shortName: $shortName
      categoryId: $categoryId
      barcodes: $barcodes
      type: $type
      description: $description
      unitPrice: $unitPrice
      code: $code
      customFieldsData: $customFieldsData
      vendorId: $vendorId
      uom: $uom
      barcodeDescription: $barcodeDescription
    ) {
      _id
    }
  }
`;
  const productRemove = gql`
    mutation productsRemove($productIds: [String!]) {
        productsRemove(productIds: $productIds)
    }`


export const productsMutations = { productsEdit, productsAdd , productRemove };
