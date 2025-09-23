import { Button } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import {
  IconPlus,
  IconSettings,
  IconFile,
  IconEdit,
  IconTrash,
  IconEye,
  IconCalendar,
  IconUser,
} from '@tabler/icons-react';
import { useState } from 'react';

// Fake pages data
const fakePages = [
  {
    _id: '1',
    title: 'Home Page',
    slug: 'home',
    content: 'Welcome to our website. This is the main landing page.',
    status: 'published',
    author: 'John Doe',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    views: 1250,
  },
  {
    _id: '2',
    title: 'About Us',
    slug: 'about-us',
    content: 'Learn more about our company and our mission.',
    status: 'published',
    author: 'Jane Smith',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    views: 850,
  },
  {
    _id: '3',
    title: 'Contact',
    slug: 'contact',
    content: 'Get in touch with us through our contact form.',
    status: 'published',
    author: 'Mike Johnson',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    views: 650,
  },
  {
    _id: '4',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: 'Our privacy policy and data protection information.',
    status: 'published',
    author: 'Sarah Wilson',
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
    views: 320,
  },
  {
    _id: '5',
    title: 'Terms of Service',
    slug: 'terms-of-service',
    content: 'Terms and conditions for using our services.',
    status: 'draft',
    author: 'David Brown',
    createdAt: '2024-01-11T16:00:00Z',
    updatedAt: '2024-01-11T16:00:00Z',
    views: 0,
  },
  {
    _id: '6',
    title: 'Services',
    slug: 'services',
    content: 'Overview of our services and offerings.',
    status: 'published',
    author: 'Emily Davis',
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-10T08:30:00Z',
    views: 980,
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

export function Page() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <div className="flex items-center gap-2">
            <IconFile className="h-5 w-5 text-purple-600" />
            <span className="font-semibold">Page Management</span>
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
            Add Page
          </Button>
        </PageHeader.End>
      </PageHeader>

      <div className="flex flex-1">
        <div className="flex-1 p-6">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Found {fakePages.length} pages
              <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Sample Data
              </span>
            </div>
          </div>

          {/* Pages Content */}
          {viewMode === 'list' ? (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fakePages.map((page) => (
                    <tr key={page._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {page.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          /{page.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            page.status,
                          )}`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <IconUser className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {page.author}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {page.views}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(page.updatedAt).toLocaleDateString('en-US', {
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
              {fakePages.map((page) => (
                <div
                  key={page._id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {page.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          page.status,
                        )}`}
                      >
                        {page.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {page.content}
                    </p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <code className="bg-gray-100 px-2 py-1 rounded">
                          /{page.slug}
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <IconUser className="w-3 h-3" />
                        <span>{page.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <IconCalendar className="w-3 h-3" />
                        <span>
                          Updated:{' '}
                          {new Date(page.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Views: {page.views}</span>
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
        </div>
      </div>
    </div>
  );
}
