import { gql } from '@apollo/client';

export const productEdit = gql`
    mutation productsEdit($_id: String!, $name: String, $shortName: String, $type: String, $categoryId: String, $description: String, $barcodes: [String], $variants: JSON, $barcodeDescription: String, $unitPrice: Float, $code: String, $customFieldsData: JSON, $attachment: AttachmentInput, $attachmentMore: [AttachmentInput], $pdfAttachment: PdfAttachmentInput, $vendorId: String, $scopeBrandIds: [String], $uom: String, $subUoms: JSON, $currency: String) {
        productsEdit(
        _id: $_id
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
        currency: $currency
    ) {
        _id
        __typename
    }
    }
`
export const productRemove = gql`
    mutation productsRemove($productIds: [String!]) {
        productsRemove(productIds: $productIds)
    }`