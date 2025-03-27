import { FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form';
import { useUserForm } from '../../hooks/useUserForm';
import {
  Button,
  Checkbox,
  cn,
  Form,
  Input,
  ScrollArea,
  Spinner,
  Table,
  Tooltip,
} from 'erxes-ui';
import { TUserForm } from '../../types';
import { useCallback, useState } from 'react';
import { IconPlus, IconSend, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { SelectBranch, SelectDepartment, SelectUsersGroup } from 'ui-modules';
import { useUsersInvite } from '../../hooks/useUsersInvite';

export function InviteForm({
  setIsOpen,
}: {
  setIsOpen: (open: boolean) => void;
}) {
  const {
    methods,
    methods: {
      control,
      handleSubmit,
      formState: { errors },
    },
  } = useUserForm();
  const { handleInvitations, loading } = useUsersInvite();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries',
  });
  const handleAddRow = () => {
    append({
      email: '',
      password: '',
      groupId: '',
      channelIds: '',
      unitId: '',
      branchId: '',
      departmentId: '',
    });
  };

  const handleSelectRow = (index: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleRemoveSelected = () => {
    remove(Array.from(selectedRows));
    setSelectedRows(new Set());
  };

  const submitHandler: SubmitHandler<TUserForm> = useCallback(async (data) => {
    try {
      console.log('Form Data Submitted:', data);
      handleInvitations({
        variables: {
          entries: data?.entries,
        },
        onCompleted() {
          setIsOpen(false);
        },
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler)} className="h-full">
        <ScrollArea className="max-h-[400px] flex flex-col">
          <Table.Root className="rounded-lg relative h-full [&_th]:h-7 [&_th:first-child]:rounded-tl-[7px] [&_th:last-child]:rounded-tr-[7px] [&_th]:bg-[#f4f4f5] bg-[#e4e4e5] border-spacing-0 border border-[#e4e4e5] overflow-hidden">
            <Table.Header className="sticky top-0 z-1">
              <Table.Row className="[&_th]:rounded-[2px] [&_th]:border border-[#e4e4e5]">
                <Table.Head className="w-7 h-7 px-0">
                  <Form.Item className="flex items-center justify-center">
                    <Checkbox
                      checked={
                        fields.length > 0 && selectedRows.size === fields.length
                      }
                      onCheckedChange={() => {
                        if (selectedRows.size === fields.length) {
                          setSelectedRows(new Set());
                        } else {
                          setSelectedRows(new Set(fields.map((_, i) => i)));
                        }
                      }}
                    />
                  </Form.Item>
                </Table.Head>
                <Table.Head>Email</Table.Head>
                <Table.Head>Password</Table.Head>
                <Table.Head className="w-36">Permission</Table.Head>
                <Table.Head>Channles</Table.Head>
                <Table.Head>Unit</Table.Head>
                <Table.Head className="w-36">Department</Table.Head>
                <Table.Head className="w-36">Branch</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body className="overflow-y-scroll [&_td]:border-none [&_input]:h-7">
              {fields.map((field, index) => (
                <Table.Row
                  key={field.id}
                  className="[&_input]:shadow-none [&_button]:shadow-none [&_td]:rounded-[2px] [&_th]:border border-[#e4e4e5]"
                >
                  <Table.Cell>
                    <Form.Item className="flex w-7 h-7 items-center rounded-[2px] justify-center bg-white">
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onCheckedChange={() => handleSelectRow(index)}
                      />
                    </Form.Item>
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Field
                      control={control}
                      name={`entries.${index}.email`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Control>
                            <Tooltip.Provider>
                              <Tooltip>
                                <Tooltip.Trigger asChild>
                                  <Input
                                    {...field}
                                    placeholder="Email"
                                    type={'email'}
                                    autoComplete="off"
                                    className={cn(
                                      Array.isArray(errors?.entries) &&
                                        errors.entries.at(index)?.email
                                        ? 'border border-destructive'
                                        : '',
                                      'rounded-[2px] w-full',
                                    )}
                                    autoFocus={false}
                                  />
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                  {(Array.isArray(errors?.entries) &&
                                    errors.entries.at(index)?.email &&
                                    errors.entries.at(index)?.email?.message) ||
                                    'Email'}
                                </Tooltip.Content>
                              </Tooltip>
                            </Tooltip.Provider>
                          </Form.Control>
                        </Form.Item>
                      )}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Field
                      control={control}
                      name={`entries.${index}.password`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Control>
                            <Tooltip.Provider>
                              <Tooltip>
                                <Tooltip.Trigger asChild>
                                  <Input
                                    {...field}
                                    placeholder="Password"
                                    autoComplete={`new-password-${index}`}
                                    type="password"
                                    className={cn(
                                      Array.isArray(errors?.entries) &&
                                        errors.entries.at(index)?.password
                                        ? 'border border-destructive'
                                        : '',
                                      'rounded-[2px] w-full',
                                    )}
                                  />
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                  {(Array.isArray(errors?.entries) &&
                                    errors.entries.at(index)?.password &&
                                    errors.entries.at(index)?.password
                                      ?.message) ||
                                    'Password'}
                                </Tooltip.Content>
                              </Tooltip>
                            </Tooltip.Provider>
                          </Form.Control>
                        </Form.Item>
                      )}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Field
                      control={control}
                      name={`entries.${index}.groupId`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Control>
                            <SelectUsersGroup
                              name={field.name}
                              onValueChange={field.onChange}
                              value={field.value}
                              className="truncate w-36 rounded-[2px] h-7"
                            />
                          </Form.Control>
                        </Form.Item>
                      )}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Field
                      control={control}
                      name={`entries.${index}.channelIds`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Control>
                            <Input
                              {...field}
                              placeholder="Channel"
                              className="rounded-[2px]"
                            />
                          </Form.Control>
                        </Form.Item>
                      )}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Field
                      control={control}
                      name={`entries.${index}.unitId`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Control>
                            <Input
                              {...field}
                              placeholder="Unit"
                              className="rounded-[2px]"
                            />
                          </Form.Control>
                        </Form.Item>
                      )}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Field
                      control={control}
                      name={`entries.${index}.departmentId`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Control>
                            <SelectDepartment
                              name={field.name}
                              onValueChange={field.onChange}
                              value={field.value}
                              className="truncate w-36 rounded-[2px] h-7"
                            />
                          </Form.Control>
                        </Form.Item>
                      )}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Field
                      control={control}
                      name={`entries.${index}.branchId`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Control>
                            <SelectBranch
                              name={field.name}
                              onValueChange={field.onChange}
                              value={field.value}
                              className="truncate w-36 rounded-[2px] h-7"
                            />
                          </Form.Control>
                        </Form.Item>
                      )}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row className="sticky bottom-0 z-10">
                <Table.Cell colSpan={8}>
                  <Button
                    type="button"
                    variant={'ghost'}
                    className="w-full rounded-t-[2px] text-muted-foreground text-sm bg-[#f4f4f5]"
                    onClick={handleAddRow}
                  >
                    <IconPlus size={16} />
                    Add Row
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
          <ScrollArea.Bar />
        </ScrollArea>
        <div className="mt-3 w-full flex gap-3 justify-end">
          <AnimatePresence>
            {selectedRows.size > 0 && (
              <motion.div
                className="flex"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <Button
                  variant={'destructive'}
                  className="text-white"
                  onClick={handleRemoveSelected}
                >
                  <IconX size={16} />
                  Remove ({selectedRows.size})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button type="submit" disabled={loading} className="text-sm">
            {(loading && (
              <Spinner size={'small'} className="stroke-white" />
            )) || <IconSend size={16} />}
            Send invites
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
