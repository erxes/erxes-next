import { gql, useQuery } from '@apollo/client';
import { Sidebar, Skeleton } from 'erxes-ui';

export const TagsSidebar = () => {
  const { data, loading } = useQuery(gql`
    query TagsGetTypes {
      tagsGetTypes
    }
  `);

  return (
    <Sidebar collapsible="none" className="border-r flex-none">
      <Sidebar.Group>
        <Sidebar.GroupLabel>Tags</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {data?.tagsGetTypes.map((tag: any) => (
              <Sidebar.MenuItem key={tag._id}>{tag.name}</Sidebar.MenuItem>
            ))}
            {loading &&
              Array.from({ length: 10 }).map((_, index) => (
                <Sidebar.MenuItem key={index}>
                  <Skeleton className="w-full h-4 my-1" />
                </Sidebar.MenuItem>
              ))}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar>
  );
};
