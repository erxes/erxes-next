import { gql } from '@apollo/client';

export const CREATE_NOTE = gql`
  mutation CreateNote($content: String, $itemId: String, $mentions: [String]) {
    createNote(content: $content, itemId: $itemId, mentions: $mentions) {
      _id
    }
  }
`;
