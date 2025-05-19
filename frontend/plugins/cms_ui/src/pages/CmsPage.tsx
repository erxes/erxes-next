import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCpConfigs } from '~/modules/cms/hooks/useCpGetConfigs';
import { useCmsContext } from '~/modules/app/context/CmsContext';

import {
  IconLayoutListFilled,
  IconList,
  IconCalendarPlus,
  IconEdit,
} from '@tabler/icons-react';
import { Button } from 'erxes-ui/components';

export const CmsPage = () => {
  const { data: configs } = useCpConfigs();
  const { setSelectedWebsite } = useCmsContext();
  const [view, setView] = useState<'list' | 'grid'>('grid');

  const webs = configs?.clientPortalGetConfigs || [];

  return (
    <div className="w-full p-6 pt-0">
      <div className="w-full flex justify-between gap-4 items-center py-4">
        <p className="text-gray-500 text-[12px]">Found {webs.length} results</p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-[#4F46E51A]/10' : 'bg-white'}
          >
            <div className="flex gap-1 items-center">
              <IconLayoutListFilled size={16} /> List
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'bg-[#4F46E51A]/10' : 'bg-white'}
          >
            <div className="flex gap-1 items-center">
              <IconList size={16} /> Grid
            </div>
          </Button>
        </div>
      </div>
      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'
            : 'flex flex-col gap-3'
        }
      >
        {webs.map((web: any) => (
          <div
            key={web._id}
            className="flex flex-col gap-3 items-start justify-between w-full p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
              alt={web.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <p className="font-semibold">{web.name}</p>
            <p className="text-gray-500">{web.description}</p>
            <div className="w-full flex justify-between">
              <div className="flex gap-2 font-semibold">
                <IconCalendarPlus size={16} className="text-gray-600" />
                <p>
                  {new Date(web.createdAt)
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, '/')}
                </p>
              </div>
              <Link
                to={`/cms/${web._id}/posts`}
                onClick={() => {
                  setSelectedWebsite(web._id);
                }}
              >
                <div className="flex gap-2 font-semibold text-blue-600 hover:underline">
                  <IconEdit size={16} />
                  <p>Manage</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
