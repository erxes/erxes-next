import { Button, Input } from 'erxes-ui';
import { useSetAtom } from 'jotai';
import {
  callNumberState,
  showNumbersState,
} from '@/integrations/call/states/callWidgetStates';
import { IconAsterisk, IconHash, IconX } from '@tabler/icons-react';
import { useAtom } from 'jotai';

export const CallNumberInput = () => {
  const [showNumbers, setShowNumbers] = useAtom(showNumbersState);
  const [number, setNumber] = useAtom(callNumberState);

  if (!showNumbers) return null;

  return (
    <div className="flex items-center flex-col gap-2 flex-auto min-w-72 border-l p-4 py-8 relative">
      <Input
        className="shadow-none focus-visible:shadow-none max-w-48 mx-auto h-10 font-bold text-xl text-center"
        value={number}
      />
      <div className="grid grid-cols-3 gap-3 w-full max-w-44 mx-auto ">
        <CallNumberInputButton>1</CallNumberInputButton>
        <CallNumberInputButton letters="abc">2</CallNumberInputButton>
        <CallNumberInputButton letters="def">3</CallNumberInputButton>
        <CallNumberInputButton letters="ghi">4</CallNumberInputButton>
        <CallNumberInputButton letters="jkl">5</CallNumberInputButton>
        <CallNumberInputButton letters="mno">6</CallNumberInputButton>
        <CallNumberInputButton letters="pqrs">7</CallNumberInputButton>
        <CallNumberInputButton letters="tuv">8</CallNumberInputButton>
        <CallNumberInputButton letters="wxyz">9</CallNumberInputButton>
        <CallNumberInputButton sign>
          <IconAsterisk strokeWidth={3} />
        </CallNumberInputButton>
        <CallNumberInputButton letters="+">0</CallNumberInputButton>
        <CallNumberInputButton sign>
          <IconHash strokeWidth={3} />
        </CallNumberInputButton>
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4"
        onClick={() => {
          setShowNumbers(false);
          setNumber('');
        }}
      >
        <IconX />
      </Button>
    </div>
  );
};

export const CallNumberInputButton = ({
  children,
  letters,
  sign,
}: {
  children: React.ReactNode;
  letters?: string;
  sign?: boolean;
}) => {
  const setNumber = useSetAtom(callNumberState);
  return (
    <Button
      variant="secondary"
      className="aspect-square h-auto rounded-full text-lg font-bold flex-col gap-0"
      onClick={() => setNumber((prev) => prev + children)}
    >
      {children}
      {!sign && (
        <span className="text-[0.625rem] leading-3 text-accent-foreground font-normal uppercase h-3">
          {letters}
        </span>
      )}
    </Button>
  );
};
