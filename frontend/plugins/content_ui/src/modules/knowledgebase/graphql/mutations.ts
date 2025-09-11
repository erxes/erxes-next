import { gql } from '@apollo/client';

export const ADD_TOPIC = gql`
  mutation knowledgeBaseTopicsAdd($input: KnowledgeBaseTopicInput!) {
    knowledgeBaseTopicsAdd(input: $input) {
      _id
    }
  }
`;

export const EDIT_TOPIC = gql`
  mutation knowledgeBaseTopicsEdit(
    $_id: ID!
    $input: KnowledgeBaseTopicInput!
  ) {
    knowledgeBaseTopicsEdit(_id: $_id, input: $input) {
      _id
    }
  }
`;

export const REMOVE_TOPIC = gql`
  mutation knowledgeBaseTopicsRemove($_id: ID!) {
    knowledgeBaseTopicsRemove(_id: $_id)
  }
`;

export const ADD_CATEGORY = gql`
  mutation knowledgeBaseCategoriesAdd($input: KnowledgeBaseCategoryInput!) {
    knowledgeBaseCategoriesAdd(input: $input) {
      _id
    }
  }
`;

export const EDIT_CATEGORY = gql`
  mutation knowledgeBaseCategoriesEdit(
    $_id: ID!
    $input: KnowledgeBaseCategoryInput!
  ) {
    knowledgeBaseCategoriesEdit(_id: $_id, input: $input) {
      _id
    }
  }
`;

export const REMOVE_CATEGORY = gql`
  mutation knowledgeBaseCategoriesRemove($_id: ID!) {
    knowledgeBaseCategoriesRemove(_id: $_id)
  }
`;

export const ADD_ARTICLE = gql`
  mutation knowledgeBaseArticlesAdd($input: KnowledgeBaseArticleInput!) {
    knowledgeBaseArticlesAdd(input: $input) {
      _id
    }
  }
`;

export const EDIT_ARTICLE = gql`
  mutation knowledgeBaseArticlesEdit(
    $_id: ID!
    $input: KnowledgeBaseArticleInput!
  ) {
    knowledgeBaseArticlesEdit(_id: $_id, input: $input) {
      _id
    }
  }
`;

export const REMOVE_ARTICLE = gql`
  mutation knowledgeBaseArticlesRemove($_id: ID!) {
    knowledgeBaseArticlesRemove(_id: $_id) {
      _id
    }
  }
`;
