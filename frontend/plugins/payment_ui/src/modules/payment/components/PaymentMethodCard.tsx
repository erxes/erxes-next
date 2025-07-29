import { Card, REACT_APP_API_URL } from 'erxes-ui';
import { useNavigate } from 'react-router-dom';

type Props = {
  name: string;
  description: string;
  kind: string;
  count: number;
};

const PaymentMethodCard = (props: Props) => {
  const navigate = useNavigate();
  return (
    <Card
      className="cursor-pointer hover:bg-accent"
      onClick={() => {
        navigate(`/settings/payment/${props.kind}`);
      }}
    >
      <Card.Header>
        <div className="flex items-center gap-2">
          <img
            className="w-10 h-10 object-contain rounded-md"
            src={
              REACT_APP_API_URL +
              '/pl:payment/static/images/payments/' +
              props.kind +
              '.png'
            }
            alt={props.name}
          />
          <div className="flex flex-col gap-1">
            <Card.Title>{props.name}</Card.Title>
            <p className="text-xs text-muted-foreground">
              ({props.count || 0})
            </p>
          </div>
        </div>
        <Card.Description>{props.description}</Card.Description>
      </Card.Header>
    </Card>
  );
};

export default PaymentMethodCard;
