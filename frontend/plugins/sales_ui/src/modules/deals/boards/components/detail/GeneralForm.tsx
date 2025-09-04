import { Combobox, Form, Input, Popover, Select } from 'erxes-ui';
import {
  SelectBranches,
  SelectDepartments,
  SelectMember,
  SelectTags,
} from 'ui-modules';
import { useRef, useState } from 'react';

import { IPipeline } from '@/deals/types/pipelines';
import { SelectBoards } from '../SelectBoards';

const VISIBILITY_TYPES = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

const GeneralForm = ({
  form,
  pipeline,
}: {
  form: any;
  pipeline: IPipeline;
}) => {
  const { control } = form;

  const [open, setOpen] = useState(false);
  const [visibility, setVisibility] = useState(
    pipeline ? pipeline.visibility : 'public',
  );

  const handleBranchChange = (branchId: string | string[] | undefined) => {
    const singleBranchId = Array.isArray(branchId) ? branchId[0] : branchId;
    form.setValue('branchId', singleBranchId || '');
    form.trigger('branchId');
  };

  const handleDepartmentChange = (
    departmentId: string | string[] | undefined,
  ) => {
    const singleDepartmentId = Array.isArray(departmentId)
      ? departmentId[0]
      : departmentId;
    form.setValue('departmentId', singleDepartmentId || '');
    form.trigger('departmentId');
  };

  const selectParentRef =
    useRef<React.ElementRef<typeof Combobox.Trigger>>(null);

  const { name, boardId, tagId, departmentIds, branchIds, memberIds } =
    pipeline;

  return (
    <div className="space-y-3">
      <Form.Field
        control={control}
        name="name"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>{field.name}</Form.Label>
            <Form.Control>
              <Input {...field} placeholder="Name" value={name} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="visibility"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Visibility</Form.Label>
            <Form.Control>
              <Select
                onValueChange={(value) => {
                  setVisibility(value);
                  field.onChange(value);
                }}
                value={visibility}
              >
                <Select.Trigger
                  className={!visibility ? 'text-muted-foreground' : ''}
                >
                  {visibility || 'Select visibility'}
                </Select.Trigger>
                <Select.Content>
                  {VISIBILITY_TYPES.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="boardId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>{field.name}</Form.Label>
            <SelectBoards.FormItem
              mode="single"
              onValueChange={field.onChange}
              value={boardId}
              className="focus-visible:relative focus-visible:z-10"
            />
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="tagId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>{field.name}</Form.Label>
            <SelectTags.Provider
              tagType="sales:deal"
              value={tagId}
              onValueChange={(tag) => {
                field.onChange(tag);
                setOpen(false);
              }}
            >
              <Popover open={open} onOpenChange={setOpen}>
                <Form.Control>
                  <Combobox.Trigger ref={selectParentRef}>
                    <SelectTags.Value />
                  </Combobox.Trigger>
                </Form.Control>
                <Combobox.Content>
                  <SelectTags.Command disableCreateOption />
                </Combobox.Content>
              </Popover>
            </SelectTags.Provider>
            <Form.Message />
          </Form.Item>
        )}
      />
      {visibility === 'private' && (
        <>
          <Form.Field
            control={control}
            name="departmentId"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Departments</Form.Label>
                <SelectDepartments.FormItem
                  mode="single"
                  onValueChange={handleDepartmentChange}
                  value={departmentIds}
                  className="focus-visible:relative focus-visible:z-10"
                />
              </Form.Item>
            )}
          />
          <Form.Field
            control={control}
            name="branchId"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Branches</Form.Label>
                <SelectBranches.FormItem
                  onValueChange={handleBranchChange}
                  value={branchIds}
                  mode="single"
                  className="focus-visible:relative focus-visible:z-10"
                />
              </Form.Item>
            )}
          />
          <Form.Field
            name="memberIds"
            control={control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Team members</Form.Label>
                <SelectMember.FormItem
                  value={memberIds}
                  onValueChange={field.onChange}
                />
              </Form.Item>
            )}
          />
        </>
      )}
    </div>
  );
};

export default GeneralForm;
