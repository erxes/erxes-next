import { Button } from 'erxes-ui';
import {
  IconLayoutGrid,
  IconList,
  IconEye,
  IconEdit,
  IconTrash,
  IconFile,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Tag } from './Tag';
import { Category } from './Category';
import { Page } from './Page';
import { CmsLayout } from './CmsLayout';

// Fake posts data
const fakePosts = [
  {
    _id: '1',
    title: 'Welcome to Our Website',
    content:
      'This is the first post on our new website. Stay tuned for more updates!',
    category: 'General',
    tags: ['welcome', 'announcement'],
    status: 'published',
    createdAt: '2024-01-15T10:30:00Z',
    modifiedAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    title: 'How to Get Started with Our Services',
    content:
      'A comprehensive guide to help you begin using our platform effectively.',
    category: 'Tutorials',
    tags: ['guide', 'getting-started'],
    status: 'published',
    createdAt: '2024-01-12T11:00:00Z',
    modifiedAt: '2024-01-14T15:00:00Z',
  },
  {
    _id: '3',
    title: 'New Features Released',
    content:
      "Check out the latest features we've added to enhance your experience.",
    category: 'Updates',
    tags: ['features', 'release'],
    status: 'published',
    createdAt: '2024-01-10T09:00:00Z',
    modifiedAt: '2024-01-10T09:00:00Z',
  },
  {
    _id: '4',
    title: 'Upcoming Maintenance Schedule',
    content:
      'Important information regarding planned system maintenance and downtime.',
    category: 'Announcements',
    tags: ['maintenance', 'schedule'],
    status: 'draft',
    createdAt: '2024-01-08T14:00:00Z',
    modifiedAt: '2024-01-08T14:00:00Z',
  },
  {
    _id: '5',
    title: 'Archived Post Example',
    content:
      'This is an old post that has been archived and is no longer publicly visible.',
    category: 'Archive',
    tags: ['old', 'archive'],
    status: 'archived',
    createdAt: '2023-12-20T10:00:00Z',
    modifiedAt: '2024-01-01T10:00:00Z',
  },
];

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function Posts() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeNav, setActiveNav] = useState('posts');

  return (
    <CmsLayout activeNav={activeNav} onNavChange={setActiveNav}>
      {/* Conditional Content Based on Active Navigation */}
      {activeNav === 'posts' && (
        <>
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Found {fakePosts.length} posts
              <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Sample Data
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === 'list' ? 'grid' : 'list')
                }
              >
                {viewMode === 'list' ? (
                  <IconLayoutGrid className="h-4 w-4" />
                ) : (
                  <IconList className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Posts Content */}
          {viewMode === 'list' ? (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modified Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fakePosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {post.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            post.status,
                          )}`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.modifiedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <IconEye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <IconEdit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fakePosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {post.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          post.status,
                        )}`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      <div>Category: {post.category}</div>
                      <div>
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-900">
                        <IconEye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                        <IconEdit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-red-600 hover:text-red-900">
                        <IconTrash className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Category Component */}
      {activeNav === 'category' && <Category />}

      {/* Tag Component */}
      {activeNav === 'tag' && <Tag />}

      {/* Custom Type Content */}
      {activeNav === 'custom-type' && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <IconFile className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Custom Type Management
            </h3>
            <p className="text-gray-500">Manage custom content types here</p>
          </div>
        </div>
      )}

      {/* Page Component */}
      {activeNav === 'page' && <Page />}
    </CmsLayout>
  );
}
