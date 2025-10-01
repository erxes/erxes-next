import { CallWidget } from '@/integrations/call/components/CallWidget';
import { SipContainer } from '@/integrations/call/components/SipContainer';

const FloatingWidget = () => {
  console.log('wahahah...');
  return (
    <SipContainer>
      <CallWidget />
    </SipContainer>
  );
};

export default FloatingWidget;
