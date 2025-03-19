import { IconPlus } from '@tabler/icons-react';
import { DropdownMenu, Button } from 'erxes-ui';
import { Link } from 'react-router-dom';

export const AddTransaction = ({
  inForm,
  children,
  onClick,
}: {
  inForm?: boolean;
  children: React.ReactNode;
  onClick?: (journal?: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[--radix-dropdown-menu-trigger-width]">
        <DropdownMenu.Label>Ерөнхий</DropdownMenu.Label>
        <AddTransactionItem journal="general" onClick={onClick} inForm={inForm}>
          Ерөнхий журнал
        </AddTransactionItem>
        <AddTransactionItem disabled>НӨАТ</AddTransactionItem>
        <DropdownMenu.Label>Мөнгөн хөрөнгө</DropdownMenu.Label>
        <AddTransactionItem journal="cash" onClick={onClick} inForm={inForm}>
          Касс
        </AddTransactionItem>
        <AddTransactionItem
          journal="exchange"
          onClick={onClick}
          inForm={inForm}
        >
          Харилцах
        </AddTransactionItem>
        <DropdownMenu.Label>Тооцоо</DropdownMenu.Label>
        <AddTransactionItem
          journal="exchange"
          onClick={onClick}
          inForm={inForm}
        >
          Авлага
        </AddTransactionItem>
        <AddTransactionItem
          journal="exchange"
          onClick={onClick}
          inForm={inForm}
        >
          Өглөг
        </AddTransactionItem>
        <DropdownMenu.Label>Бараа материал</DropdownMenu.Label>
        <AddTransactionItem disabled>Орлого</AddTransactionItem>
        <AddTransactionItem disabled>Хангамжийн зарлага</AddTransactionItem>
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
  journal?: string;
  onClick?: (journal?: string) => void;
  inForm?: boolean;
}) => {
  if (disabled) {
    return <DropdownMenu.Item disabled>{children}</DropdownMenu.Item>;
  }
  if (!inForm && journal) {
    return (
      <DropdownMenu.Item asChild>
        <Link to={`transaction/?defaultJournal=${journal}`}>{children}</Link>
      </DropdownMenu.Item>
    );
  }
  return (
    <DropdownMenu.Item onClick={() => onClick && onClick(journal)}>
      {children}
    </DropdownMenu.Item>
  );
};
