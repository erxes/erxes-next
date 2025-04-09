import { Spinner } from 'erxes-ui';
import { useParams, useNavigate } from 'react-router-dom';
import { Table } from 'erxes-ui';
import { RecordTable } from 'erxes-ui';

import {
  IconPin,
  IconLabelFilled,
  IconCategoryFilled,
  IconCube,
  IconFile,
  IconDots,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { cmsColumns } from '~/modules/cms/components/CmsColumns';

const posts = [
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },

  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },

  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },

  {
    name: 'Post 2',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 3',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
];

const PostsComponent = () => (
  <RecordTable.Provider
    columns={cmsColumns}
    data={posts}
    // handleReachedBottom={handleFetchMore}
    stickyColumns={['avatar', 'name']}
    className="mt-1.5"
    // moreColumn={contactMoreColumn}
  >
    <RecordTable>
      <RecordTable.Header />
      <RecordTable.Body>
        {/* {!loading && totalCount > customers?.length && (
          <RecordTable.RowSkeleton
            rows={4}
            handleReachedBottom={handleFetchMore}
          />
        )} */}
      </RecordTable.Body>
    </RecordTable>
  </RecordTable.Provider>
);

const CategoryComponent = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold">Categories</h2>
    <p>Manage your categories here.</p>
  </div>
);

const TagComponent = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold">Tags</h2>
    <p>Manage your tags here.</p>
  </div>
);

const CustomTypeComponent = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold">Custom Types</h2>
    <p>Manage your custom types here.</p>
  </div>
);

const PageComponent = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold">Pages</h2>
    <p>Manage your pages here.</p>
  </div>
);

export const CmsPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('/posts');

  const sideBarOptions = [
    { route: '/posts', icon: IconPin, name: 'Posts' },
    { route: '/categories', icon: IconCategoryFilled, name: 'Category' },
    { route: '/tags', icon: IconLabelFilled, name: 'Tag' },
    { route: '/custom-types', icon: IconCube, name: 'Custom Type' },
    { route: '/pages', icon: IconFile, name: 'Page' },
  ];

  useEffect(() => {
    if (slug) {
      setSelectedOption('/posts');
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      navigate(`/cms/${slug}${selectedOption}`);
    }
  }, [selectedOption, navigate, slug]);

  const renderComponent = () => {
    switch (selectedOption) {
      case '/posts':
        return <PostsComponent />;
      case '/categories':
        return <CategoryComponent />;
      case '/tags':
        return <TagComponent />;
      case '/custom-types':
        return <CustomTypeComponent />;
      case '/pages':
        return <PageComponent />;
      default:
        return <Spinner />;
    }
  };

  return (
    <div className="flex justify-center p-4 h-screen">
      <div className="w-[15%] h-screen flex flex-col p-4 gap-1">
        {sideBarOptions.map((option, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-2 cursor-pointer rounded-md ${
              selectedOption === option.route
                ? 'text-[#4F46E5] font-semibold bg-[#4F46E51A]/10'
                : ''
            }`}
            onClick={() => setSelectedOption(option.route)}
          >
            <option.icon
              size={16}
              className={` ${
                selectedOption === option.route
                  ? 'text-[#4F46E5]'
                  : 'text-gray-500'
              }`}
            />
            {option.name}
          </div>
        ))}
      </div>
      <div className="w-[85%] flex flex-col items-start">
        {renderComponent()}
      </div>
    </div>
  );
};
