import { gql } from "@apollo/client"

const GET_CONFIGS = gql`
  query configs {
    configs {
      _id
      code
      value
    }
}
`

export const fileSettingsQueries = {
  GET_CONFIGS
}