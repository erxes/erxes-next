import { gql, useQuery } from '@apollo/client';
import { Sidebar, Skeleton, useQueryState } from 'erxes-ui';

export const TagsSidebar = () => {
  const { data, loading } = useQuery(gql`
    query TagsGetTypes {
      tagsGetTypes
    }
  `);
  const [tag, setTag] = useQueryState('tag');

  return (
    <Sidebar collapsible="none" className="border-r flex-none">
      <Sidebar.Group>
        <Sidebar.GroupLabel>Tags</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {data?.tagsGetTypes.map((tag: any) => (
              <Sidebar.MenuItem key={tag._id}>
                <Sidebar.MenuButton>{tag.description}</Sidebar.MenuButton>
              </Sidebar.MenuItem>
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
