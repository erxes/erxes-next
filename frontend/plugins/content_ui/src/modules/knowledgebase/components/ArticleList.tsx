'use client';

import { useQuery } from '@apollo/client';
import { ARTICLES } from '../graphql/queries';
import { Spinner, Table } from 'erxes-ui';
import dayjs from 'dayjs';

interface Article {
  _id: string;
  title: string;
  createdUser?: {
    details?: {
      fullName?: string;
    };
    email?: string;
  };
  createdDate: string;
  status: string;
}

interface ArticleListProps {
  categoryId: string;
}

export function ArticleList({ categoryId }: ArticleListProps) {
  const { data, loading } = useQuery(ARTICLES, {
    variables: {
      categoryIds: [categoryId],
      page: 1,
      perPage: 20,
    },
  });

  const articles = data?.knowledgeBaseArticles?.list || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <img
          src="/images/empty.svg"
          alt="No articles"
          className="w-32 h-32 mb-4"
        />
        <p>No articles found</p>
      </div>
    );
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Title</Table.Head>
          <Table.Head>Created By</Table.Head>
          <Table.Head>Created Date</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {articles.map((article: Article) => (
          <Table.Row key={article._id}>
            <Table.Cell>{article.title}</Table.Cell>
            <Table.Cell>
              {article.createdUser?.details?.fullName ||
                article.createdUser?.email}
            </Table.Cell>
            <Table.Cell>
              {dayjs(article.createdDate).format('DD/MM/YYYY')}
            </Table.Cell>
            <Table.Cell>{article.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
