import { useState } from 'react';
import { Collapsible, Sidebar } from 'erxes-ui';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  IconPin,
  IconFile,
  IconCube,
  IconLabelFilled,
  IconCategoryFilled,
  IconCaretUpFilled,
} from '@tabler/icons-react';
import { useCmsContext } from '~/modules/app/context/CmsContext';

const sidebarSections = [
  {
    title: 'Content builder',
    items: [
      { label: 'Posts', icon: IconPin, path: 'posts' },
      { label: 'Page', icon: IconFile, path: 'pages' },
    ],
  },
  {
    title: 'Custom post type',
    items: [
      { label: 'Add custom post type', icon: IconCube, path: 'custom-post' },
      { label: 'Дотоод ажлын зар', icon: IconCube, path: 'internal-job' },
      { label: 'Гадаад ажлын зар', icon: IconCube, path: 'external-job' },
    ],
  },
  {
    title: 'Content settings',
    items: [
      { label: 'Tag', icon: IconLabelFilled, path: 'tags' },
      { label: 'Category', icon: IconCategoryFilled, path: 'categories' },
    ],
  },
];

export function CmsSideBar() {
  const { selectedWebsite } = useCmsContext();

  const { slug } = useParams();
  const location = useLocation();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      sidebarSections.reduce((acc, curr) => {
        acc[curr.title] = false;
        return acc;
      }, {} as Record<string, boolean>),
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Sidebar collapsible="none" className="border-r flex-none min-h-screen">
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {sidebarSections.map((section) => {
              const isOpen = openSections[section.title];

              return (
                <Collapsible
                  key={section.title}
                  open={isOpen}
                  onOpenChange={() => toggleSection(section.title)}
                >
                  <Sidebar.MenuItem>
                    <Collapsible.Trigger asChild>
                      <Sidebar.MenuButton className="flex items-center gap-2">
                        <IconCaretUpFilled
                          className={`transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                        {section.title}
                      </Sidebar.MenuButton>
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                      {section.items.map(({ label, icon: Icon, path }) => {
                        const fullPath = `/cms/${selectedWebsite}/${path}`;
                        const isActive = location.pathname === fullPath;

                        return (
                          <Sidebar.MenuItem key={label}>
                            <Sidebar.MenuButton asChild isActive={isActive}>
                              <Link
                                to={fullPath}
                                className="flex items-center gap-2"
                              >
                                <Icon />
                                <span>{label}</span>
                              </Link>
                            </Sidebar.MenuButton>
                          </Sidebar.MenuItem>
                        );
                      })}
                    </Collapsible.Content>
                  </Sidebar.MenuItem>
                </Collapsible>
              );
            })}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar>
  );
}
