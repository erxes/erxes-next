import { Widgets as InboxWidgets } from '@/inbox/widgets/Widgets';

const Widgets = ({
  contentType,
  moduleName,
  contentId,
}: {
  moduleName: string;
  contentType: string;
  contentId: string;
}) => {
  switch (moduleName) {
    case 'inbox':
      return <InboxWidgets contentId={contentId} contentType={contentType} />;
    default:
      return null;
  }
};

export default Widgets;
