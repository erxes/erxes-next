import { Button } from 'erxes-ui';

const FloatingWidget = () => {
  return (
    <div className="absolute bottom-4 right-4 z-50">
      <Button variant="default" className="rounded-full">
        Inbox floating widget
      </Button>
    </div>
  );
};

export default FloatingWidget;
