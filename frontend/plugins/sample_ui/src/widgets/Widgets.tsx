const Widgets = ({
  contentType,
  contentId,
  message,
}: {
  contentType: string;
  contentId: string;
  message: string;
}) => {
  console.log(message);
  return <div>Widgets sample {message}</div>;
};

export default Widgets;
