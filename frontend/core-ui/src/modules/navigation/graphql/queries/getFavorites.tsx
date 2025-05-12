import { gql } from '@apollo/client';

export const GET_FAVORITES = gql`
  query getFavorites {
    getFavoritesByCurrentUser {
      _id
      type
      item
    }
  }
`;
