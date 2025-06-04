import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type BMSLocation {
    lat: Float
    lng: Float
    name: String
    mapId: String
  }
  input BMSLocationInput {
    lat: Float
    lng: Float
    name: String
    mapId: String
  }

  type Element {
    _id: String!
    name: String
    quick: Boolean
    icon: String
    content: String
    note: String
    startTime: String
    duration: Int
    cost: Float
    images: [String]
    categories: [String]
    categoriesObject: [ElementCategory]
    itineraryId: String
    location: BMSLocation
    branchId: String
    createdAt: Date
    modifiedAt: Date
  }

  type ElementCategory {
    _id: String!
    name: String
    parentId: String
  }

  type ElementListResponse {
    list: [Element]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

export const queries = `
  bmElements(branchId:String, categories: [String],name: String,quick: Boolean, ${GQL_CURSOR_PARAM_DEFS}): ElementListResponse
  bmElementDetail(_id:String!): Element
  bmElementCategoryies(parentId:String): [ElementCategory]
  bmElementsInit: JSON
  bmCategoryInit: JSON
`;

const params = `
  name: String,
  content: String,
  note: String,
  startTime: String,
  duration: Int,
  cost:Float,
  images:[String],
  categories: [String],
  itineraryId: String,
  location: BMSLocationInput,
  quick: Boolean,
  branchId: String
`;

export const mutations = `
  bmElementAdd(${params}): Element
  bmElementRemove(ids: [String]): JSON
  bmElementEdit(_id:String!, ${params}): Element
  bmElementCategoryAdd(name:String,parentId:String):ElementCategory
  bmElementCategoryRemove(_id: String!):JSON
  bmElementCategoryEdit(_id: String!, name:String,parentId:String): ElementCategory
`;
