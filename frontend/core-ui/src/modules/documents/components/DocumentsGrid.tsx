import { Card, useSetQueryStateByKey } from 'erxes-ui';
// import { MemberInline } from 'ui-modules';
import { MembersInline } from 'ui-modules';
import { DocumentPreview } from './DocumentPreview';

export const DocumentsGrid = ({ documents }: { documents: any[] }) => {
  const setQuery = useSetQueryStateByKey();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {documents.map((document) => (
        <Card
          key={document._id}
          className="flex flex-col overflow-hidden cursor-pointer"
          onClick={() => {
            setQuery('documentId', document._id);
            setQuery('contentType', document.contentType);
          }}
        >
          <Card.Content className="p-0 relative flex items-center justify-center h-[140px]">
            <DocumentPreview document={document} />
          </Card.Content>

          <Card.Footer className="flex-auto p-4 border-t">
            <div className="w-full h-full flex flex-col justify-between">
              <Card.Title className="text-base font-medium mb-3">
                {document.name}
              </Card.Title>
              <Card.Description className="flex items-start justify-between w-full">
                <MembersInline
                  members={[document.createdUser]}
                  key={document._id}
                />
                <p className="text-sm flex-shrink-0 ml-2">
                  {new Date(document.createdAt).toLocaleDateString()}
                </p>
              </Card.Description>
            </div>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
};
