import { gql } from "@apollo/client"

const configsQuery = gql`
  query configs {
    configs {
      _id
      code
      value
      __typename
    }
}
`

export const SettingsQueries = {
  configsQuery
}