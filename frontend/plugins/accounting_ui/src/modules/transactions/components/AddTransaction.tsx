import {
  DropdownMenu,
  usePreviousHotkeyScope,
  useScopedHotkeys,
} from 'erxes-ui';
import { Link } from 'react-router-dom';
import { JournalEnum } from '@/settings/account/types/Account';
import { AccountingHotkeyScope } from '@/types/AccountingHotkeyScope';
import { useEffect, useState } from 'react';

export const AddTransaction = ({
  inForm,
  children,
  onClick,
}: {
  inForm?: boolean;
  children: React.ReactNode;
  onClick?: (journal?: JournalEnum) => void;
}) => {
  const [open, setOpen] = useState(false);
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  useScopedHotkeys(
    'c',
    () => {
      setOpen(true);
    },
    AccountingHotkeyScope.MainPage,
  );

  useEffect(() => {
    if (open) {
      setHotkeyScopeAndMemorizePreviousScope(
        AccountingHotkeyScope.AddTransactionDropdown,
      );
    } else {
      goBackToPreviousHotkeyScope();
    }
  }, [
    open,
    goBackToPreviousHotkeyScope,
    setHotkeyScopeAndMemorizePreviousScope,
  ]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[--radix-dropdown-menu-trigger-width]">
        <DropdownMenu.Label>Ерөнхий</DropdownMenu.Label>
        <AddTransactionItem
          journal={JournalEnum.MAIN}
          onClick={onClick}
          inForm={inForm}
        >
          Ерөнхий журнал
        </AddTransactionItem>
        <AddTransactionItem disabled>НӨАТ</AddTransactionItem>
        <DropdownMenu.Label>Мөнгөн хөрөнгө</DropdownMenu.Label>
        <AddTransactionItem
          journal={JournalEnum.CASH}
          onClick={onClick}
          inForm={inForm}
        >
          Касс
        </AddTransactionItem>
        <AddTransactionItem
          journal={JournalEnum.BANK}
          onClick={onClick}
          inForm={inForm}
        >
          Харилцах
        </AddTransactionItem>
        <DropdownMenu.Label>Тооцоо</DropdownMenu.Label>

        <DropdownMenu.Label>Бараа материал</DropdownMenu.Label>
        <AddTransactionItem
          journal={JournalEnum.INV_INCOME}
          onClick={onClick}
          inForm={inForm}
        >
          Орлого
        </AddTransactionItem>
        <AddTransactionItem
          journal={JournalEnum.INV_OUT}
          onClick={onClick}
          inForm={inForm}
        >
          Хангамжийн зарлага
        </AddTransactionItem>
        <AddTransactionItem disabled>Борлуулалт (байнгын)</AddTransactionItem>
        <AddTransactionItem disabled>
          Борлуулалт (ажил үйлчилгээ)
        </AddTransactionItem>
        <AddTransactionItem disabled>Дотоод хөдөлгөөн</AddTransactionItem>
        <DropdownMenu.Label>Үндсэн хөрөнгө</DropdownMenu.Label>
        <AddTransactionItem disabled>Орлого</AddTransactionItem>
        <AddTransactionItem disabled>Акт</AddTransactionItem>
        <AddTransactionItem disabled>Хөдөлгөөн</AddTransactionItem>
        <AddTransactionItem disabled>Тохируулга</AddTransactionItem>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

const AddTransactionItem = ({
  children,
  disabled,
  journal,
  inForm,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  journal?: JournalEnum;
  onClick?: (journal?: JournalEnum) => void;
  inForm?: boolean;
}) => {
  if (disabled) {
    return <DropdownMenu.Item disabled>{children}</DropdownMenu.Item>;
  }
  if (!inForm && journal) {
    return (
      <DropdownMenu.Item asChild>
        <Link to={`/accounting/transaction/?defaultJournal=${journal}`}>
          {children}
        </Link>
      </DropdownMenu.Item>
    );
  }
  return (
    <DropdownMenu.Item onClick={() => onClick && onClick(journal)}>
      {children}
    </DropdownMenu.Item>
  );
};
