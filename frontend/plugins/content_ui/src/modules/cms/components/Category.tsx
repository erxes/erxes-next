import { Button } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import {
  IconPlus,
  IconSettings,
  IconGrid3x3,
  IconEdit,
  IconTrash,
  IconEye,
} from '@tabler/icons-react';
import { useState } from 'react';

// Fake categories data
const fakeCategories = [
  {
    _id: '1',
    name: 'Technology',
    description: 'Posts related to technology and innovation',
    color: '#3B82F6',
    postsCount: 25,
    createdAt: '2024-01-15T10:30:00Z',
    parentId: null,
  },
  {
    _id: '2',
    name: 'Programming',
    description: 'Programming languages and development',
    color: '#10B981',
    postsCount: 18,
    createdAt: '2024-01-14T14:20:00Z',
    parentId: '1',
  },
  {
    _id: '3',
    name: 'Business',
    description: 'Business and entrepreneurship content',
    color: '#F59E0B',
    postsCount: 12,
    createdAt: '2024-01-13T09:15:00Z',
    parentId: null,
  },
  {
    _id: '4',
    name: 'Marketing',
    description: 'Marketing and advertising content',
    color: '#EF4444',
    postsCount: 8,
    createdAt: '2024-01-12T11:30:00Z',
    parentId: '3',
  },
  {
    _id: '5',
    name: 'Design',
    description: 'Design and creative content',
    color: '#8B5CF6',
    postsCount: 15,
    createdAt: '2024-01-11T16:00:00Z',
    parentId: null,
  },
];

export function Category() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const getParentCategory = (parentId: string | null) => {
    if (!parentId) return null;
    return fakeCategories.find((cat) => cat._id === parentId);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <div className="flex items-center gap-2">
            <IconGrid3x3 className="h-5 w-5 text-purple-600" />
            <span className="font-semibold">Category Management</span>
          </div>
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <a href="/settings/content">
              <IconSettings />
              Go to settings
            </a>
          </Button>
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </PageHeader.End>
      </PageHeader>

      <div className="flex flex-1">
        <div className="flex-1 p-6">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Found {fakeCategories.length} categories
              <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Sample Data
              </span>
            </div>
          </div>

          {/* Categories Content */}
          {viewMode === 'list' ? (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fakeCategories.map((category) => {
                    const parent = getParentCategory(category.parentId);
                    return (
                      <tr key={category._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <div className="text-sm font-medium text-gray-900">
                              {category.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {category.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {parent ? parent.name : '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm text-gray-600">
                              {category.color}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {category.postsCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fakeCategories.map((category) => {
                const parent = getParentCategory(category.parentId);
                return (
                  <div
                    key={category._id}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {category.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {category.postsCount} posts
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {category.description}
                      </p>
                      {parent && (
                        <div className="text-xs text-gray-500 mb-3">
                          Parent:{' '}
                          <span className="font-medium">{parent.name}</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mb-3">
                        Created:{' '}
                        {new Date(category.createdAt).toLocaleDateString()}
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
