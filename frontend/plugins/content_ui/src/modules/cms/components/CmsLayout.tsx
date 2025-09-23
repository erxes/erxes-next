import { Button, Breadcrumb, Sidebar } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import {
  IconFileText,
  IconPlus,
  IconSettings,
  IconRocket,
  IconGrid3x3,
  IconTag,
  IconFile,
  IconChevronDown,
  IconChevronRight,
  IconDots,
} from '@tabler/icons-react';
import { Link, useParams } from 'react-router-dom';
import { useState, ReactNode } from 'react';
import { MainSidebar } from './MainSidebar';

interface CmsLayoutProps {
  children: ReactNode;
  activeNav: string;
  onNavChange: (nav: string) => void;
}

export function CmsLayout({
  children,
  activeNav,
  onNavChange,
}: CmsLayoutProps) {
  const { websiteId } = useParams();
  const [expandedSections, setExpandedSections] = useState({
    contentBuilder: true,
    customPostType: true,
    contentSettings: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex h-full">
      {/* Main Sidebar (Core & Plugins) */}
      <MainSidebar />

      <div className="flex flex-col flex-1">
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
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Button variant="ghost" asChild>
                    <Link to="/content/cms">Website {websiteId}</Link>
                  </Button>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Button variant="ghost">Posts</Button>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
          </PageHeader.Start>
          <PageHeader.End>
            <Button variant="outline" asChild>
              <Link to="/settings/content">
                <IconSettings />
                Go to settings
              </Link>
            </Button>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Add Post
            </Button>
          </PageHeader.End>
        </PageHeader>

        <div className="flex flex-1">
          {/* CMS Sidebar */}
          <Sidebar className="w-64 bg-white border-r">
            <Sidebar.Content className="p-4 space-y-4">
              {/* Content Builder Section */}
              <div>
                <button
                  onClick={() => toggleSection('contentBuilder')}
                  className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
                >
                  <span>Content builder</span>
                  {expandedSections.contentBuilder ? (
                    <IconChevronDown className="h-4 w-4" />
                  ) : (
                    <IconChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.contentBuilder && (
                  <div className="space-y-1 ml-2">
                    <div
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        activeNav === 'posts'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => onNavChange('posts')}
                    >
                      <div className="flex items-center gap-3">
                        <IconRocket
                          className={`h-5 w-5 ${
                            activeNav === 'posts'
                              ? 'text-purple-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="font-medium">Posts</span>
                      </div>
                      <IconDots className="h-4 w-4 text-gray-400" />
                    </div>

                    <div
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        activeNav === 'page'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => onNavChange('page')}
                    >
                      <div className="flex items-center gap-3">
                        <IconFile
                          className={`h-5 w-5 ${
                            activeNav === 'page'
                              ? 'text-purple-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="font-medium">Page</span>
                      </div>
                      <IconDots className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Post Type Section */}
              <div>
                <button
                  onClick={() => toggleSection('customPostType')}
                  className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
                >
                  <span>Custom post type</span>
                  {expandedSections.customPostType ? (
                    <IconChevronDown className="h-4 w-4" />
                  ) : (
                    <IconChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.customPostType && (
                  <div className="space-y-1 ml-2">
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      <div className="flex items-center gap-3">
                        <IconFile className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">
                          Add custom post type +
                        </span>
                      </div>
                      <IconDots className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      <div className="flex items-center gap-3">
                        <IconFile className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Дотоод ажлын зар</span>
                      </div>
                      <IconDots className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      <div className="flex items-center gap-3">
                        <IconFile className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Гадаад ажлын зар</span>
                      </div>
                      <IconDots className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content Settings Section */}
              <div>
                <button
                  onClick={() => toggleSection('contentSettings')}
                  className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
                >
                  <span>Content settings</span>
                  {expandedSections.contentSettings ? (
                    <IconChevronDown className="h-4 w-4" />
                  ) : (
                    <IconChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.contentSettings && (
                  <div className="space-y-1 ml-2">
                    <div
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        activeNav === 'tag'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => onNavChange('tag')}
                    >
                      <div className="flex items-center gap-3">
                        <IconTag
                          className={`h-5 w-5 ${
                            activeNav === 'tag'
                              ? 'text-purple-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="font-medium">Tag</span>
                      </div>
                      <IconDots className="h-4 w-4 text-gray-400" />
                    </div>

                    <div
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        activeNav === 'category'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => onNavChange('category')}
                    >
                      <div className="flex items-center gap-3">
                        <IconGrid3x3
                          className={`h-5 w-5 ${
                            activeNav === 'category'
                              ? 'text-purple-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="font-medium">Category</span>
                      </div>
                      <IconDots className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            </Sidebar.Content>
          </Sidebar>

          {/* Main Content */}
          <div className="flex-1 p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
