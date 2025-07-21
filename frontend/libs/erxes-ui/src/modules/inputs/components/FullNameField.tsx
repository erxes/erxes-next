import { cn } from 'erxes-ui/lib/utils';
import { Badge, Input } from 'erxes-ui/components';
import { forwardRef, useEffect, useState } from 'react';
import {
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui/modules/record-table';

export const FullNameContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn('flex -space-x-px', className)} />
  );
});
FullNameContainer.displayName = 'FullNameContainer';

export const FullNameInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    roudedSide?: 'left' | 'right' | 'none';
  }
>(({ className, roudedSide = 'left', ...props }, ref) => {
  return (
    <Input
      ref={ref}
      {...props}
      className={cn(
        'focus-visible:z-10 max-w-36 shadow-none',
        roudedSide === 'left' && 'rounded-r-none',
        roudedSide === 'right' && 'rounded-l-none',
        className,
      )}
    />
  );
});
FullNameInput.displayName = 'FullNameInput';

const FirstNameInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <FullNameInput
      ref={ref}
      roudedSide="left"
      className={className}
      placeholder="First name"
      {...props}
    />
  );
});
FirstNameInput.displayName = 'FirstNameInput';

const LastNameInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <FullNameInput
      ref={ref}
      roudedSide="right"
      className={className}
      placeholder="Last name"
      {...props}
    />
  );
});
LastNameInput.displayName = 'LastNameInput';

interface FullNameProps
  extends React.ComponentProps<typeof RecordTablePopover> {
  firstName: string;
  lastName: string;
  onClose?: (firstName: string, lastName: string) => void;
  onClick?: (e: React.MouseEvent) => void;
  withBadge?: boolean;
}

const FullNameRoot = ({
  firstName,
  lastName,
  onClose,
  onClick,
  withBadge = false,
  ...props
}: FullNameProps) => {
  const [firstNameState, setFirstNameState] = useState<string>('');
  const [lastNameState, setLastNameState] = useState<string>('');
  useEffect(() => {
    setFirstNameState(firstName);
    setLastNameState(lastName);
  }, [firstName, lastName]);
  return (
    <RecordTablePopover
      scope={props.scope}
      open={props.open}
      onOpenChange={(open) => {
        props.onOpenChange?.(open);
        if (!open) {
          onClose?.(firstNameState, lastNameState);
        }
      }}
      {...props}
    >
      <RecordTableCellTrigger>
        {withBadge ? (
          <Badge
            variant="secondary"
            onClick={(e) => {
              onClick?.(e);
            }}
          >
            {firstName || lastName ? (
              <span>
                {firstName} {lastName}
              </span>
            ) : (
              <span className="text-muted-foreground">Unnamed customer</span>
            )}
          </Badge>
        ) : firstName || lastName ? (
          <span
            onClick={(e) => {
              onClick?.(e);
            }}
          >
            {firstName} {lastName}
          </span>
        ) : (
          <span className="text-muted-foreground">Unnamed customer</span>
        )}
      </RecordTableCellTrigger>
      <RecordTableCellContent className="w-72" asChild>
        <FullNameField.Container>
          <FullNameField.FirstName
            value={firstNameState || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFirstNameState(e.target.value);
            }}
          />
          <FullNameField.LastName
            value={lastNameState || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLastNameState(e.target.value);
            }}
          />
        </FullNameField.Container>
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};

const FullNameDetail = ({
  firstName,
  lastName,
  onClose,
  onClick,
  withBadge = false,
  ...props
}: FullNameProps) => {
  const [firstNameState, setFirstNameState] = useState<string>('');
  const [lastNameState, setLastNameState] = useState<string>('');
  useEffect(() => {
    setFirstNameState(firstName);
    setLastNameState(lastName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <RecordTablePopover
      scope={props.scope}
      open={props.open}
      onOpenChange={(open) => {
        props.onOpenChange?.(open);
        if (!open) {
          onClose?.(firstNameState, lastNameState);
        }
      }}
      {...props}
    >
      <RecordTableCellTrigger>
        {withBadge ? (
          <Badge
            variant="secondary"
            onClick={(e) => {
              onClick?.(e);
            }}
          >
            {firstName || lastName ? (
              <span>
                {firstName} {lastName}
              </span>
            ) : (
              <span className="text-muted-foreground">Unnamed customer</span>
            )}
          </Badge>
        ) : firstName || lastName ? (
          <span
            onClick={(e) => {
              onClick?.(e);
            }}
          >
            {firstName} {lastName}
          </span>
        ) : (
          <span className="text-muted-foreground">Unnamed customer</span>
        )}
      </RecordTableCellTrigger>
      <RecordTableCellContent className="w-72" asChild>
        <FullNameField.Container>
          <FullNameField.FirstName
            value={firstNameState || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFirstNameState(e.target.value);
            }}
          />
          <FullNameField.LastName
            value={lastNameState || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLastNameState(e.target.value);
            }}
          />
        </FullNameField.Container>
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};

// const FullNameDetail = ({
//   firstName,
//   lastName,
//   onClose,
//   onClick,
//   ...props
// }: FullNameProps) => {
//   const [firstNameState, setFirstNameState] = useState<string>('');
//   const [lastNameState, setLastNameState] = useState<string>('');
//   useEffect(() => {
//     setFirstNameState(firstName);
//     setLastNameState(lastName);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   return (
//     <RecordTablePopover
//       scope={props.scope}
//       open={props.open}
//       onOpenChange={(open) => {
//         props.onOpenChange?.(open);
//         if (!open) {
//           onClose?.(firstNameState, lastNameState);
//         }
//       }}
//       {...props}
//     >
//       <RecordTableCellTrigger>
//         {firstName || lastName ? (
//           <span
//             onClick={(e) => {
//               onClick?.(e);
//             }}
//             className="font-semibold text-lg"
//           >
//             {firstName} {lastName}
//           </span>
//         ) : (
//           <span className="text-muted-foreground">Unnamed customer</span>
//         )}
//       </RecordTableCellTrigger>
//       <RecordTableCellContent className="w-72" asChild>
//         <FullNameField.Container>
//           <FullNameField.FirstName
//             value={firstNameState}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//               setFirstNameState(e.target.value);
//             }}
//           />
//           <FullNameField.LastName
//             value={lastNameState}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//               setLastNameState(e.target.value);
//             }}
//           />
//         </FullNameField.Container>
//       </RecordTableCellContent>
//     </RecordTablePopover>
//   );
// };

const FullNameField = Object.assign(FullNameRoot, {
  Container: FullNameContainer,
  Input: FullNameInput,
  FirstName: FirstNameInput,
  LastName: LastNameInput,
  Detail: FullNameDetail,
});

export { FullNameField };
