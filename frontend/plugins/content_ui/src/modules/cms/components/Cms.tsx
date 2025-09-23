import { Button, Sidebar, Breadcrumb, Separator, ToggleGroup } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import {
  IconFileText,
  IconPlus,
  IconSettings,
  IconLayoutGrid,
  IconList,
  IconCalendar,
  IconEdit,
  IconArrowUpRight,
  IconUser,
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useWebsites } from '../hooks/useWebsites';
import { WebsiteDrawer } from './WebsiteDrawer';

const getThumbnailGradient = (color: string) => {
  const gradients = {
    orange: 'bg-gradient-to-br from-orange-200 to-orange-300',
    red: 'bg-gradient-to-br from-red-200 to-red-300',
    blue: 'bg-gradient-to-br from-blue-200 to-blue-300',
    green: 'bg-gradient-to-br from-green-200 to-green-300',
    yellow: 'bg-gradient-to-br from-yellow-200 to-yellow-300',
    purple: 'bg-gradient-to-br from-purple-200 to-purple-300',
    pink: 'bg-gradient-to-br from-pink-200 to-pink-300',
    indigo: 'bg-gradient-to-br from-indigo-200 to-indigo-300',
    teal: 'bg-gradient-to-br from-teal-200 to-teal-300',
  };
  return gradients[color as keyof typeof gradients] || gradients.orange;
};

export function Cms() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('thumbnail');
  const [isWebsiteDrawerOpen, setIsWebsiteDrawerOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<any>(null);
  const {
    websites,
    loading: websitesLoading,
    refetch: refetchWebsites,
  } = useWebsites();

  // Fake data for testing when no real data is available
  const fakeWebsites = [
    {
      _id: '1',
      name: 'E-commerce Store',
      description:
        'Modern online shopping platform with advanced features and user-friendly interface.',
      domain: 'shop.example.com',
      url: 'https://shop.example.com',
      kind: 'client',
      createdAt: '2024-01-15T10:30:00Z',
      __typename: 'ClientPortal',
    },
    {
      _id: '2',
      name: 'Corporate Website',
      description:
        'Professional business website showcasing company services and portfolio.',
      domain: 'company.com',
      url: 'https://company.com',
      kind: 'client',
      createdAt: '2024-01-10T14:20:00Z',
      __typename: 'ClientPortal',
    },
    {
      _id: '3',
      name: 'Blog Platform',
      description:
        'Content management system for publishing articles and managing blog content.',
      domain: 'blog.example.com',
      url: 'https://blog.example.com',
      kind: 'client',
      createdAt: '2024-01-08T09:15:00Z',
      __typename: 'ClientPortal',
    },
    {
      _id: '4',
      name: 'Support Portal',
      description:
        'Customer support platform with ticket management and knowledge base.',
      domain: 'support.example.com',
      url: 'https://support.example.com',
      kind: 'vendor',
      createdAt: '2024-01-05T16:45:00Z',
      __typename: 'ClientPortal',
    },
    {
      _id: '5',
      name: 'Learning Management System',
      description:
        'Educational platform for online courses and student management.',
      domain: 'learn.example.com',
      url: 'https://learn.example.com',
      kind: 'client',
      createdAt: '2024-01-03T11:30:00Z',
      __typename: 'ClientPortal',
    },
    {
      _id: '6',
      name: 'Event Management Portal',
      description:
        'Platform for managing events, registrations, and attendee communications.',
      domain: 'events.example.com',
      url: 'https://events.example.com',
      kind: 'client',
      createdAt: '2024-01-01T08:00:00Z',
      __typename: 'ClientPortal',
    },
  ];

  // Use fake data if no real data is available
  const displayWebsites = websites.length > 0 ? websites : fakeWebsites;

  const handleCloseWebsiteDrawer = () => {
    setIsWebsiteDrawerOpen(false);
    setEditingWebsite(null);
  };

  const handleEditWebsite = (website: any) => {
    setEditingWebsite(website);
    setIsWebsiteDrawerOpen(true);
  };

  const handleWebsiteClick = (website: any) => {
    // Navigate to website posts management
    navigate(`/content/cms/${website._id}/posts`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/content/cms">
                    <IconFileText />
                    CMS
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <Link to="/settings/content">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <Button onClick={() => setIsWebsiteDrawerOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Website
          </Button>
        </PageHeader.End>
      </PageHeader>

      <div className="flex flex-1">
        <div className="flex-1 p-6">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Found {displayWebsites.length} results
              {websites.length === 0 && (
                <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Sample Data
                </span>
              )}
            </div>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) =>
                setViewMode(value as 'list' | 'thumbnail')
              }
            >
              <ToggleGroup.Item value="list" aria-label="List view">
                <IconList className="h-4 w-4" />
              </ToggleGroup.Item>
              <ToggleGroup.Item value="thumbnail" aria-label="Thumbnail view">
                <IconLayoutGrid className="h-4 w-4" />
              </ToggleGroup.Item>
            </ToggleGroup>
          </div>

          {/* Content Grid */}
          {viewMode === 'thumbnail' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {displayWebsites.map((website, index) => (
                <div
                  key={website._id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleWebsiteClick(website)}
                >
                  {/* Thumbnail Image */}
                  <div
                    className={`aspect-video ${getThumbnailGradient(
                      [
                        'orange',
                        'red',
                        'blue',
                        'green',
                        'yellow',
                        'purple',
                        'pink',
                        'indigo',
                        'teal',
                      ][index % 9],
                    )} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Website Icon */}
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                    </div>

                    {/* Domain Badge */}
                    {website.domain && (
                      <div className="absolute bottom-2 right-2">
                        <div className="px-2 py-1 bg-white/90 rounded text-xs font-medium text-gray-700">
                          {website.domain}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {website.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {website.description || 'No description available'}
                    </p>

                    {/* Metadata and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <IconCalendar className="w-3 h-3" />
                        <span>
                          Created on:{' '}
                          {new Date(website.createdAt).toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric', year: 'numeric' },
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditWebsite(website);
                          }}
                          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                        >
                          <IconEdit className="w-3 h-3" />
                          <span>Manage</span>
                        </button>
                        {website.url && (
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                          >
                            <IconArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {displayWebsites.map((website, index) => (
                <div
                  key={website._id}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleWebsiteClick(website)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 ${getThumbnailGradient(
                        [
                          'orange',
                          'red',
                          'blue',
                          'green',
                          'yellow',
                          'purple',
                          'pink',
                          'indigo',
                          'teal',
                        ][index % 9],
                      )} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {website.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {website.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <IconCalendar className="w-3 h-3" />
                          <span>
                            Created on:{' '}
                            {new Date(website.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              },
                            )}
                          </span>
                        </div>
                        {website.domain && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {website.domain}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWebsite(website);
                        }}
                        className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                      >
                        <IconEdit className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                      {website.url && (
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                        >
                          <IconArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <WebsiteDrawer
        website={editingWebsite}
        isOpen={isWebsiteDrawerOpen}
        onClose={handleCloseWebsiteDrawer}
      />
    </div>
  );
}
