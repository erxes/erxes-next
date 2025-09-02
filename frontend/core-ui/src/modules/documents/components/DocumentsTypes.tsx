import { FormType } from '@/documents/hooks/useDocumentForm';
import { ScrollArea, Sidebar, useQueryState } from 'erxes-ui';
import { useFormContext } from 'react-hook-form';
import { DOCUMENTS_TYPES_SET } from '../constants';
import { useDocumentsTypes } from '../hooks/useDocumentsTypes';
import { IDocumentType } from '../types';

export const DocumentsTypes = () => {
  const [contentType, setQuery] = useQueryState('contentType');

  const { setValue } = useFormContext<FormType>();

  const { documentsTypes } = useDocumentsTypes();

  return (
    <ScrollArea className="h-full" viewportClassName="[&>div]:block">
      <Sidebar.Group>
        <Sidebar.GroupLabel>Document types</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {documentsTypes.map(
              ({ contentType: module, label }: IDocumentType) => {
                const Icon = DOCUMENTS_TYPES_SET[module]['icon'];

                return (
                  <Sidebar.MenuItem key={module}>
                    <Sidebar.MenuButton
                      isActive={module === contentType}
                      onClick={() => {
                        setQuery(module);
                        setValue('contentType', module);
                      }}
                    >
                      <Icon />
                      {label}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                );
              },
            )}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </ScrollArea>
  );
};
