export const Widget = ({
  module,
  contentId,
  contentType,
}: {
  module: {
    name: string;
    path: string;
    hasSettings: boolean;
    hasWidgets: boolean;
  };
  contentId: string;
  contentType: string;
}) => {
  console.log('13', module, contentId, contentType);
  return (
    <div>
      Widget {contentId} {contentType}
    </div>
  );
};

export default Widget;
