import { Button } from 'erxes-ui';

export const LeactureList = () => {
  const data = [
    {
      id: '1',
      name: 'Leacture 1',
    },
  ];

  return data.map((item) => (
    <div key={item.id}>
      <h1>{item.name}</h1>
    </div>
  ));
};

export default LeactureList;
