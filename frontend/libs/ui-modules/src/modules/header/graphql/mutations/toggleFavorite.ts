import { gql } from '@apollo/client';

export const TOGGLE_FAVORITE = gql`
  mutation toggleFavorite($type: String!, $item: String!) {
    toggleFavorite(type: $type, item: $item) {
      _id
    }
  }
`;
