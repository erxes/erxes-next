export const types = `
  type Product @key(fields: "_id") @cacheControl(maxAge: 3) {
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

  type ProductsListResponse {
    list: [Product],
    pageInfo: PageInfo
    totalCount: Int,
  }
`;

const queryParams = `
  type: String,
  status: String,
  categoryIds: [String],
  searchValue: String,
  vendorId: String,
  brandIds: [String]
  tagIds: [String],
  ids: [String],
  excludeIds: Boolean,
  excludeTagIds: [String]
  tagWithRelated: Boolean
  pipelineId: String,
  boardId: String,
  segment: String,
  segmentData: String,
  groupedSimilarity: String,
  image: String,

  sortField: String
  sortDirection: Int

  limit: Int
  cursor: String
  direction: CURSOR_DIRECTION
`;

export const queries = `
  products(${queryParams}): ProductsListResponse
  productsTotalCount(${queryParams}): Int
  productDetail(_id: String): Product
  productSimilarities(_id: String!, groupedSimilarity: String): ProductSimilarity
  productCountByTags: JSON
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
