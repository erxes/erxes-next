import { gql } from "@apollo/client"

const configsUpdate = gql`
  mutation configsUpdate($configsMap: JSON!) {
    configsUpdate(configsMap: $configsMap)
  }
`

export const fileSettingsMutations = {
  configsUpdate
}