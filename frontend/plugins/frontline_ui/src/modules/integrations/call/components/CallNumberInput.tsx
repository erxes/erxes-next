import { Button, Input } from 'erxes-ui';
import {
  callNumberState,
  showNumbersState,
} from '@/integrations/call/states/callWidgetStates';
import { IconAsterisk, IconHash, IconX } from '@tabler/icons-react';
import { useAtom, useSetAtom } from 'jotai';

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
        <CallNumberInputButton value="1" />
        <CallNumberInputButton letters="abc" value="2" />
        <CallNumberInputButton letters="def" value="3" />
        <CallNumberInputButton letters="ghi" value="4" />
        <CallNumberInputButton letters="jkl" value="5" />
        <CallNumberInputButton letters="mno" value="6" />
        <CallNumberInputButton letters="pqrs" value="7" />
        <CallNumberInputButton letters="tuv" value="8" />
        <CallNumberInputButton letters="wxyz" value="9" />
        <CallNumberInputButton sign value="*">
          <IconAsterisk strokeWidth={3} />
        </CallNumberInputButton>
        <CallNumberInputButton letters="+" value="0" />
        <CallNumberInputButton sign value="#">
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
  value,
}: {
  children?: React.ReactNode;
  letters?: string;
  sign?: boolean;
  value: string;
}) => {
  const setNumber = useSetAtom(callNumberState);
  return (
    <Button
      variant="secondary"
      className="aspect-square h-auto rounded-full text-lg font-bold flex-col gap-0"
      onClick={() => setNumber((prev) => prev + value)}
    >
      {children || value}
      {!sign && (
        <span className="text-[0.625rem] leading-3 text-accent-foreground font-normal uppercase h-3">
          {letters}
        </span>
      )}
    </Button>
  );
};
