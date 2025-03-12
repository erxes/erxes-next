import { IconPlus } from '@tabler/icons-react';
import { DropdownMenu, Button } from 'erxes-ui';

export const AddTransaction = () => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Button>
          <IconPlus />
          Add Transaction
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[--radix-dropdown-menu-trigger-width]">
        <DropdownMenu.Label>Ерөнхий</DropdownMenu.Label>
        <DropdownMenu.Item>Ерөнхий журнал</DropdownMenu.Item>
        <DropdownMenu.Item disabled>НӨАТ</DropdownMenu.Item>
        <DropdownMenu.Label>Мөнгөн хөрөнгө</DropdownMenu.Label>
        <DropdownMenu.Item>Касс</DropdownMenu.Item>
        <DropdownMenu.Item>Харилцах</DropdownMenu.Item>
        <DropdownMenu.Label>Тооцоо</DropdownMenu.Label>
        <DropdownMenu.Item>Авлага</DropdownMenu.Item>
        <DropdownMenu.Item>Өглөг</DropdownMenu.Item>
        <DropdownMenu.Label>Бараа материал</DropdownMenu.Label>
        <DropdownMenu.Item>Орлого</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Хангамжийн зарлага</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Борлуулалт (байнгын)</DropdownMenu.Item>
        <DropdownMenu.Item disabled>
          Борлуулалт (ажил үйлчилгээ)
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled>Дотоод хөдөлгөөн</DropdownMenu.Item>
        <DropdownMenu.Label>Үндсэн хөрөнгө</DropdownMenu.Label>
        <DropdownMenu.Item disabled>Орлого</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Акт</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Хөдөлгөөн</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Тохируулга</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
