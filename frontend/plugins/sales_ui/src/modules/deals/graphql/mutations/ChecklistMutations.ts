import gql from "graphql-tag";

export const commonVariables = `
  $contentTypeId: String,
  $title: String
`;

export const commonParams = `
  contentTypeId: $contentTypeId,
  title: $title
`;

export const checklistFields = `
  _id
  contentType
  contentTypeId
  title
  createdUserId
  createdDate
  items {
    _id
    checklistId
    isChecked
    content
  }
  percent
`;

export const ADD_CHECKLISTS = gql`
  mutation salesChecklistsAdd(
    ${commonVariables}
  ) {
    salesChecklistsAdd(
      ${commonParams}
    ) {
      ${checklistFields}
    }
  }
`;

export const EDIT_CHECKLISTS = gql`
  mutation salesChecklistsEdit(
    $_id: String!,
    ${commonVariables}
  ) {
    salesChecklistsEdit(
      _id: $_id,
      ${commonParams}
    ) {
      ${checklistFields}
    }
  }
`;

export const REMOVE_CHECKLISTS = gql`
  mutation salesChecklistsRemove($_id: String!) {
    salesChecklistsRemove(_id: $_id) {
      _id
    }
  }
`;
