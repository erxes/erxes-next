export const types = `
  type Product {
    _id: String!
    name: String
    shortName: String
    status: String
    code: String
    type: String
    description: String
    barcodes: [String]
    variants: JSON
    barcodeDescription: String
    unitPrice: Float
    categoryId: String
    customFieldsData: JSON
    customFieldsDataByFieldCode: JSON
    createdAt: Date
    tagIds: [String]
    attachment: Attachment
    attachmentMore: [Attachment]
    vendorId: String
    scopeBrandIds: [String]
    uom: String
    subUoms: JSON
    currency: String

    category: ProductCategory
    vendor: Company
    hasSimilarity: Boolean

    pdfAttachment: PdfAttachment
  }

  type ProductSimilarityGroup {
    title: String
    fieldId: String
  }

  type ProductSimilarity {
    products: [Product],
    groups: [ProductSimilarityGroup],
  }
`;

const queryParams = `
  type: String,
  status: String,
  categoryId: String,
  searchValue: String,
  vendorId: String,
  brand: String
  tag: String,
  ids: [String],
  excludeIds: Boolean,
  tags: [String]
  excludeTags: [String]
  tagWithRelated: Boolean
  pipelineId: String,
  boardId: String,
  segment: String,
  segmentData: String,
  groupedSimilarity: String,
  image: String,

  page: Int,
  perPage: Int,
  sortField: String
  sortDirection: Int
`;

export const queries = `
  products(${queryParams}): [Product]
  productsTotalCount(${queryParams}): Int
  productDetail(_id: String): Product
  productSimilarities(_id: String!, groupedSimilarity: String): ProductSimilarity
`;

export const mutationParams = `
  name: String,
  shortName: String,
  categoryId: String,
  type: String,
  description: String,
  barcodes: [String],
  variants: JSON,
  barcodeDescription: String,
  unitPrice: Float,
  code: String,
  customFieldsData: JSON,
  attachment: AttachmentInput,
  attachmentMore: [AttachmentInput],
  vendorId: String,
  scopeBrandIds: [String],
  uom: String,
  subUoms: JSON,
  currency: String
  pdfAttachment: PdfAttachmentInput
`;

export const mutations = `
  productsAdd(${mutationParams}): Product
  productsEdit(_id: String!, ${mutationParams}): Product
  productsRemove(productIds: [String!]): String
  productsMerge(productIds: [String], productFields: JSON): Product
  productsDuplicate(_id: String!): Product
`;
