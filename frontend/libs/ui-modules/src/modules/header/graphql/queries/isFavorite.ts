import { gql } from '@apollo/client';

export const IS_FAVORITE = gql`
  query isFavorite($type: String!, $item: String!) {
    isFavorite(type: $type, item: $item)
  }
`;
