import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostLists } from '~/modules/cms/hooks/usePostlist';
import { useCmsContext } from '~/modules/app/context/CmsContext';

import {
  IconLayoutListFilled,
  IconList,
  IconCalendarPlus,
  IconEdit,
} from '@tabler/icons-react';
import { Button } from 'erxes-ui/components';

export const CmsPage = () => {
  const { setSelectedWebsite } = useCmsContext();

  const data = usePostLists();

  const [view, setView] = useState<'list' | 'grid'>('list');

  const [webs] = useState([
    {
      id: 1,
      name: 'Web 1',
      slug: 'web1',
      url: 'https://www.web1.com',
      status: 'Active',
      desc: 'Web 1 Description',
      img: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
    },
    {
      id: 2,
      name: 'Web 2',
      slug: 'web2',
      url: 'https://www.web2.com',
      status: 'Active',
      desc: 'Web 2 Description',
      img: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
    },
    {
      id: 3,
      name: 'Web 3',
      slug: 'web3',
      url: 'https://www.web3.com',
      status: 'Inactive',
      desc: 'Web 3 Description',
      img: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
    },
  ]);

  return (
    <div className="w-full p-6 pt-0">
      <div className="w-full flex justify-between gap-4 items-center py-4">
        <p className="text-gray-500 text-[12px]">Found {webs.length} results</p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'bg-[#4F46E51A]/10' : 'bg-white'}
          >
            <div className="flex gap-1">
              <IconList size={16} /> List
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-[#4F46E51A]/10' : 'bg-white'}
          >
            <div className="flex gap-1">
              <IconLayoutListFilled size={16} /> Thumbnail
            </div>
          </Button>
        </div>
      </div>

      <div
        className={
          view === 'list'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'
            : 'flex flex-col gap-3'
        }
      >
        {webs.map((web) => (
          <div
            key={web.id}
            className="flex flex-col gap-3 items-start justify-between w-full p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <img
              src={web.img}
              alt={web.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <p className="font-semibold">{web.name}</p>
            <p className="text-gray-500">{web.desc}</p>
            <div className="w-full flex justify-between">
              <div className="flex gap-2 font-semibold">
                <IconCalendarPlus size={16} className="text-gray-600" />
                <p>Created on: Jan 25, 2025</p>
              </div>
              <Link
                to={`/cms/${web.slug}/posts`}
                onClick={() => {
                  setSelectedWebsite(web.slug);
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
