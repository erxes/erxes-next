import React, { useRef, useState } from 'react';

import {
  Button,
  InlineCell,
  InlineCellEdit,
  Tabs,
  usePreviousHotkeyScope,
} from 'erxes-ui';
import {
  ISelectTagsContextProviderProps,
  ITag,
  SelectTagsProps,
} from '../types/Tag';
import { SelectTagsContext } from '../contexts/SelectTagsContext';
import { useSelectTagsContext } from '../hooks/useSelectTagsContext';
import { TagsInSelectTags } from './Tags';
import { CreateTagForm, SelectTagCreateContainer } from './CreateTagForm';
import { TagsDisplay } from './TagsDisplay';

const SelectTagsRoot = React.forwardRef<
  React.ElementRef<typeof Button>,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> & SelectTagsProps
>((props, ref) => {
  const {
    tagType,
    selected,
    onSelect,
    loading,
    showAddButton,
    display,
    asTrigger,
    ...rest
  } = props;
  return (
    <SelectTagsProvider
      tagType={tagType}
      selected={selected}
      onSelect={onSelect}
      loading={loading}
      asTrigger={asTrigger}
    >
      <InlineCell
        name="tags"
        onEnter={() => null}
        {...rest}
        display={() => (
          <TagsDisplay
            ref={ref}
            showAddButton={showAddButton}
            tabIndex={asTrigger ? undefined : -1}
          />
        )}
        edit={() => (
          <InlineCellEdit>
            <SelectTagsContent />
          </InlineCellEdit>
        )}
      />
    </SelectTagsProvider>
  );
});

const SelectTagsProvider = ({
  children,
  tagType,
  selected = [],
  onSelect,
  asTrigger,
  loading,
}: ISelectTagsContextProviderProps) => {
  const [activeTab, _setActiveTab] = useState<string>('tags');
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  const handleSelect = (tag: ITag) => {
    if (!onSelect) return;
    console.log({ selected });
    const tagIndex = selected.indexOf(tag._id);

    if (tagIndex >= 0) {
      const newTagIds = [...selected];
      newTagIds.splice(tagIndex, 1);
      onSelect(newTagIds);
    } else {
      onSelect([...selected, tag._id]);
    }
  };

  const setActiveTab = (tab: string) => {
    if (tab === 'create') {
      setHotkeyScopeAndMemorizePreviousScope('tag-create');
    } else {
      goBackToPreviousHotkeyScope();
    }
    _setActiveTab(tab);
  };

  return (
    <SelectTagsContext.Provider
      value={{
        tagType,
        selected,
        onSelect: handleSelect,
        setActiveTab,
        activeTab,
        asTrigger,
        loading,
      }}
    >
      {children}
    </SelectTagsContext.Provider>
  );
};

const SelectTagsContent = () => {
  const { tagType, activeTab, setActiveTab, onSelect } = useSelectTagsContext();

  const commandSearchRef = useRef<HTMLInputElement>(null);

  const focusCommandInput = () =>
    setTimeout(() => commandSearchRef.current?.focus());

  const handleBack = () => {
    setActiveTab('tags');
    focusCommandInput();
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <Tabs.Content value="tags" asChild>
        <TagsInSelectTags ref={commandSearchRef} />
      </Tabs.Content>
      <SelectTagCreateContainer onBack={handleBack}>
        <CreateTagForm
          tagType={tagType}
          onCompleted={(tag) => {
            onSelect(tag);
            setActiveTab('tags');
          }}
        />
      </SelectTagCreateContainer>
    </Tabs>
  );
};

export const SelectTags = Object.assign(SelectTagsRoot, {
  Provider: SelectTagsProvider,
  Content: SelectTagsContent,
});
