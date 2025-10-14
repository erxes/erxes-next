import { generalSettingsFields } from "../db/definitions/generalSettings";

export const generaltypes = () => [
`
type GeneralSettings {
  _id: String!
  ${generalSettingsFields}
  updatedAt: String
}

input GeneralSettingsInput {
  assistantName: String
  conversationStarter: String
  description: String
  promptSuggestions: [String]
}

extend type Query {
  getGeneralSettings: GeneralSettings
}


extend type Mutation {
  updateGeneralSettings(input: GeneralSettingsInput!): GeneralSettings
}
`
];
