import { PageSubHeader, ScrollArea } from 'erxes-ui';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentsFilter } from './DocumentsFilter';
import { DocumentsGrid } from './DocumentsGrid';
import { DocumentsList } from './DocumentsList';

type Props = {
  viewType: 'list' | 'grid';
  showFilter?: boolean;
};

const DOCUMENTS_VIEW_TYPES: Record<
  string,
  React.ComponentType<{ documents: any[] }>
> = {
  grid: DocumentsGrid,
  list: DocumentsList,
};

export const Documents = ({ viewType, showFilter = true }: Props) => {
  const { documents } = useDocuments();

  const Component = DOCUMENTS_VIEW_TYPES[viewType] ?? DocumentsList;

  return (
    <>
      {showFilter && (
        <PageSubHeader>
          <DocumentsFilter />
        </PageSubHeader>
      )}
      <ScrollArea className="h-full pb-12" viewportClassName="[&>div]:block">
        <Component documents={documents} />
      </ScrollArea>
    </>
  );
};
