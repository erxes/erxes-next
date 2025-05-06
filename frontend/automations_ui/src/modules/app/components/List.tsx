import { Button } from 'erxes-ui/components';
import { Link } from 'react-router-dom';

const List = () => {
  return (
    <>
      <Button asChild>
        <Link to={'/automations/create'}>Add</Link>
      </Button>
    </>
  );
};

export default List;
