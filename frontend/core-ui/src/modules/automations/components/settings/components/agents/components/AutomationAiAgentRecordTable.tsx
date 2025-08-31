import { AUTOMATIONS_AI_AGENTS } from '@/automations/components/settings/components/agents/graphql/automationsAiAgents';
import { useQuery } from '@apollo/client';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
  Button,
  cn,
  RelativeDateDisplay,
  Skeleton,
  Table,
  useQueryState,
} from 'erxes-ui';
import { Link } from 'react-router';

type AiAgents = {
  automationsAiAgents: {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
  }[];
};

export const AutomationAiAgentRecordTable = () => {
  const [kind] = useQueryState<string>('kind');

  const { data, loading } = useQuery<AiAgents>(AUTOMATIONS_AI_AGENTS, {
    variables: { kind },
    skip: !kind,
  });

  const { automationsAiAgents = [] } = data || {};

  return (
    <Table>
      <Table.Row>
        <Table.Head>Name</Table.Head>
        <Table.Head>Description</Table.Head>
        <Table.Head>Created at</Table.Head>
        <Table.Head className="w-28 text-center">Action</Table.Head>
      </Table.Row>
      <Table.Body>
        {loading &&
          Array.from({ length: 10 }).map((_, index) => (
            <Table.Row key={index} className={cn('h-cell')}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Table.Cell key={index} className={cn('border-r-0 px-2')}>
                  <Skeleton className="h-4 w-full min-w-4" />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}

        {automationsAiAgents.map(({ _id, name, description, createdAt }) => (
          <Table.Row key={_id}>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell className="truncate">{description}</Table.Cell>
            <Table.Cell>
              <RelativeDateDisplay.Value value={createdAt} />
            </Table.Cell>
            <Table.Cell className="flex justify-center items-center">
              <Link to={`/settings/automations/agents/${_id}`}>
                <Button variant="ghost">
                  <IconEdit />
                </Button>
              </Link>
              <Button variant="ghost" className="text-destructive">
                <IconTrash />
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
