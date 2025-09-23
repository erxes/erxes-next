import { Sidebar } from 'erxes-ui';
import {
  IconBell,
  IconChevronDown,
  IconChevronRight,
  IconHeart,
  IconClipboard,
  IconFilter,
  IconUser,
  IconBuilding,
  IconWorld,
  IconMail,
  IconSearch,
  IconCalendar,
  IconChartBar,
  IconCube,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useState } from 'react';

export function MainSidebar() {
  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    views: true,
    plugins: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Sidebar className="bg-red-500 border-r">
      <Sidebar.Content className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">X</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">erxes Inc</div>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-200 rounded">
            <IconBell className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Favorites Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('favorites')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
          >
            <span>Favorites</span>
            {expandedSections.favorites ? (
              <IconChevronDown className="h-4 w-4" />
            ) : (
              <IconChevronRight className="h-4 w-4" />
            )}
          </button>
          {expandedSections.favorites && (
            <div className="space-y-1 ml-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors bg-purple-50 text-purple-700 border border-purple-200">
                <IconMail className="h-5 w-5 text-purple-600" />
                <span className="font-medium">CMS</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                <IconClipboard className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Tasks</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                <IconFilter className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Sales Pipeline</span>
              </div>

              {/* Contacts Submenu */}
              <div className="ml-6">
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full">
                  <IconUser className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">Contacts</span>
                  <IconChevronRight className="h-4 w-4 ml-auto" />
                </button>
                <div className="ml-6 mt-1 space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                    <IconUser className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Customers</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                    <IconUser className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Leads</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                    <IconBuilding className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Companies</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                    <IconWorld className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Vendor portal users</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                    <IconWorld className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Client portal users</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Views Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('views')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
          >
            <span>Views</span>
            {expandedSections.views ? (
              <IconChevronDown className="h-4 w-4" />
            ) : (
              <IconChevronRight className="h-4 w-4" />
            )}
          </button>
          {expandedSections.views && (
            <div className="space-y-1 ml-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                <IconMail className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Team inbox</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                <IconClipboard className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Tasks assigned to me</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                <IconUser className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Contacts owned by me</span>
              </div>
            </div>
          )}
        </div>

        {/* Plugins Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('plugins')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
          >
            <span>Plugins</span>
            {expandedSections.plugins ? (
              <IconChevronDown className="h-4 w-4" />
            ) : (
              <IconChevronRight className="h-4 w-4" />
            )}
          </button>
          {expandedSections.plugins && (
            <div className="space-y-1 ml-2">
              {/* Search Bar */}
              <div className="relative mb-3">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                <IconCalendar className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Bookings</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                <IconUser className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Contacts</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                <IconChartBar className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Insight</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-4">
          <div className="text-xs text-gray-500">Show usage</div>

          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Upgrade plan
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
              <IconUser className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                Gal Zorigo
              </div>
              <div className="text-xs text-gray-500 truncate">
                gal_zorigo@yahoo.c...
              </div>
            </div>
            <IconChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </Sidebar.Content>
    </Sidebar>
  );
}
