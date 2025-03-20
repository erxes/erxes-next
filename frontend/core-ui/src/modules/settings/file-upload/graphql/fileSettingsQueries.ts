import { gql } from "@apollo/client"

const configsQuery = gql`
  query configs {
    configs {
      _id
      code
      value
    }
}
`

export const fileSettingsQueries = {
  configsQuery
}