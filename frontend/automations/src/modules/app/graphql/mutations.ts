import gql from 'graphql-tag';

const edit = gql`
  mutation AutomationsEdit(
    $id: String
    $name: String
    $status: String
    $triggers: [TriggerInput]
    $actions: [ActionInput]
  ) {
    automationsEdit(
      _id: $id
      name: $name
      status: $status
      triggers: $triggers
      actions: $actions
    ) {
      _id
      name
      status
    }
  }
`;

const create = gql`
  mutation AutomationsAdd(
    $name: String
    $status: String
    $triggers: [TriggerInput]
    $actions: [ActionInput]
  ) {
    automationsAdd(
      name: $name
      status: $status
      triggers: $triggers
      actions: $actions
    ) {
      _id
      name
      status
    }
  }
`;

export default { edit, create };
