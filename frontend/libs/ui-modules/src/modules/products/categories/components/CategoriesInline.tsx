import { IProductCategory, CategoriesInlineProps } from '../types/category';
import {
  CategoriesInlineContext,
  useCategoriesInlineContext,
} from '../contexts/CategoriesInlineContext';
import {
  isUndefinedOrNull,
  Skeleton,
  TextOverflowTooltip,
  Tooltip,
  Avatar,
} from 'erxes-ui';
import { useCategoryInline } from '../hooks/useCategoryInline';
import { useEffect, useState } from 'react';

const CategoryBadge = ({ category }: { category: IProductCategory }) => {
  const { attachment, avatar, code, name } = category;
  const firstLetter = name.charAt(0);
  const imageUrl = attachment?.url || avatar?.url;

  return (
    <div className="flex items-center gap-2 flex-auto overflow-hidden justify-start">
      <Avatar>
        <Avatar.Image src={imageUrl} />
        <Avatar.Fallback>{firstLetter}</Avatar.Fallback>
      </Avatar>
      <div className="text-muted-foreground">{code}</div>
      <TextOverflowTooltip value={name} className="flex-auto" />
    </div>
  );
};

const CategoriesInlineRoot = (props: CategoriesInlineProps) => {
  return (
    <CategoriesInlineProvider {...props}>
      <CategoriesInlineTitle />
    </CategoriesInlineProvider>
  );
};

const CategoriesInlineProvider = ({
  children,
  categoryIds,
  categories,
  placeholder,
  updateCategories,
}: CategoriesInlineProps & {
  children?: React.ReactNode;
}) => {
  const [_categories, _setCategories] = useState<IProductCategory[]>(
    categories || [],
  );

  return (
    <CategoriesInlineContext.Provider
      value={{
        categories: categories || _categories,
        loading: false,
        categoryIds: categoryIds || [],
        placeholder: isUndefinedOrNull(placeholder)
          ? 'Select categories'
          : placeholder,
        updateCategories: updateCategories || _setCategories,
      }}
    >
      {children}
      {categoryIds?.map((categoryId) => (
        <CategoriesInlineEffectComponent
          key={categoryId}
          categoryId={categoryId}
        />
      ))}
    </CategoriesInlineContext.Provider>
  );
};

const CategoriesInlineEffectComponent = ({
  categoryId,
}: {
  categoryId: string;
}) => {
  const { categories, updateCategories } = useCategoriesInlineContext();
  const { category } = useCategoryInline({
    variables: {
      _id: categoryId,
    },
    skip: !categoryId || categories.some((c) => c._id === categoryId),
  });

  useEffect(() => {
    const newCategories = [...categories].filter((c) => c._id !== categoryId);

    if (category) {
      const transformedCategory: IProductCategory = {
        ...category,
        attachment: category.attachment
          ? {
              url: category.attachment.url,
              name: '',
            }
          : undefined,
        avatar: undefined,
      };
      updateCategories?.([...newCategories, transformedCategory]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return null;
};

const CategoriesInlineTitle = () => {
  const { categories, loading, placeholder } = useCategoriesInlineContext();
  if (loading) {
    return <Skeleton className="w-full flex-1 h-4" />;
  }

  if (categories.length === 0) {
    return <span className="text-accent-foreground/70">{placeholder}</span>;
  }

  if (categories.length === 1) {
    return <CategoryBadge category={categories[0]} />;
  }

  if (categories.length < 3) {
    return (
      <TextOverflowTooltip value={categories.map((c) => c.name).join(', ')} />
    );
  }

  return (
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <span>{`${categories.length} categories`}</span>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {categories.map((category) => category.name).join(', ')}
        </Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  );
};

export const CategoriesInline = Object.assign(CategoriesInlineRoot, {
  Provider: CategoriesInlineProvider,
  Title: CategoriesInlineTitle,
});
