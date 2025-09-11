const commonContactInfoTypes = `
    phoneNumber: String
    email: String
    links: JSON
    coordinate: Coordinate
    image: Attachment
`;
export const StructureTypes = `
  type Structure {
        _id: ID!
        title: String
        supervisor: User
        description: String
        supervisorId: String
        code: String
        ${commonContactInfoTypes}
    }
`;

const commonContactInfoParams = `
    phoneNumber: String
    email: String
    links: JSON
    coordinate: CoordinateInput
    image: AttachmentInput
`;

const commonStructureParams = `
    title: String!
    description: String
    supervisorId: String
    code: String
    website: String

    ${commonContactInfoParams}
`;

export const mutations = `
    structuresAdd(${commonStructureParams}): Structure
    structuresEdit(_id: ID!,${commonStructureParams}): Structure
    structuresRemove(_id: ID!): JSON
`;

export const queries = `
  structureDetail: Structure
`;
