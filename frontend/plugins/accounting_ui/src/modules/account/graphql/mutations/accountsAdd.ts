import { gql } from '@apollo/client';

export const accountsAdd = gql`
  mutation AccountsAdd(
    $code: String
    $name: String
    $currency: String
    $kind: String
    $journal: String
    $description: String
    $branchId: String
    $departmentId: String
    $isOutBalance: Boolean
    $scopeBrandIds: [String]
  ) {
    accountsAdd(
      code: $code
      name: $name
      currency: $currency
      kind: $kind
      journal: $journal
      description: $description
      branchId: $branchId
      departmentId: $departmentId
      isOutBalance: $isOutBalance
      scopeBrandIds: $scopeBrandIds
    ) {
      _id
    }
  }
`;
