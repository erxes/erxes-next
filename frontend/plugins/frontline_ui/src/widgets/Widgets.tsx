import { Widgets as InboxWidgets } from '@/inbox/widgets/Widgets';

const Widgets = ({
  contentType,
  contentId,
}: {
  contentType: string;
  contentId: string;
}) => {
  switch (contentType) {
    case 'inbox':
      return <InboxWidgets contentId={contentId} />;
    default:
      return null;
  }
};

export default Widgets;
