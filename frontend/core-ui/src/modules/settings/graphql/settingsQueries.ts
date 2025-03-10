import { gql } from "@apollo/client"

const queryConfigsByCodes = gql`
  query QueryConfigsByCode($codes: [String], $pattern: String) {
    configsByCode(codes: $codes, pattern: $pattern) {
      _id
      code
      value
    }
  }
`


export const SettingsQueries = {
  queryConfigsByCodes
}