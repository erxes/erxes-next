import { gql } from '@apollo/client';

export const ADD_PAYMENT = gql`
  mutation paymentAdd($input: PaymentInput!) {
    paymentAdd(input: $input) {
      _id
      name
      createdAt
    }
  }
`;

export const EDIT_PAYMENT = gql`
  mutation paymentEdit($_id: ID!, $input: PaymentInput!) {
    paymentEdit(_id: $_id, input: $input) {
      _id
      name
      createdAt
    }
  }
`;

export const REMOVE_PAYMENT = gql`
  mutation paymentRemove($_id: ID!) {
    paymentRemove(_id: $_id)
  }
`;
