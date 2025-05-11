import {
  ControllerRenderProps,
  Field,
  FieldError,
  UseFieldArrayRemove,
  UseFormReturn,
} from 'react-hook-form';
import {
  FieldQueryResponse,
  IField,
  IProperty,
  IPropertyCondtion,
  IPropertyField,
  IPropertyInput,
} from '../../types';
import { z } from 'zod';
import formSchema from './schema';
import { useState } from 'react';
import { cn } from 'erxes-ui/lib';
import {
  Button,
  DatePicker,
  Form,
  HoverCard,
  Input,
  Select,
} from 'erxes-ui/components';
import { IconTrash } from '@tabler/icons-react';
import { DEFAULT_OPERATORS, OPERATORS } from '../../constants';
import { createFieldNameSafe, groupByType } from '../../utils';
import { gql, useQuery } from '@apollo/client';
import queries from '../../graphql/queries';
import { getFieldsProperties, getSelectedFieldConfig } from '../../hooks';
import { SelectCommand } from '../../common';
import { useQueryState } from 'erxes-ui/hooks';
type Props = {
  error?: FieldError;
  children: React.ReactNode;
};

const FieldWithError = ({ error, children }: Props) => {
  if (error) {
    return (
      <HoverCard>
        <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
        <HoverCard.Content className="w-80">
          <Form.Message />
        </HoverCard.Content>
      </HoverCard>
    );
  }

  return children;
};

const PropertyField = ({
  index,
  form,
  fields,
  currentField,
  parentFieldName,
  defaultValue,
  propertyTypes,
}: IPropertyField<z.infer<typeof formSchema>>) => {
  const groups = groupByType(fields);
  const [selectedContentType] = useQueryState<string>('contentType');
  return (
    <div className="flex flex-row">
      <Form.Field
        control={form.control}
        name={`${parentFieldName}.propertyType`}
        defaultValue={selectedContentType || undefined}
        render={({ field, fieldState }) => (
          <FieldWithError error={fieldState.error}>
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <Select.Trigger className="w-2/6 rounded-l-lg border-r-none">
                <Select.Value placeholder="Select an field" />
              </Select.Trigger>
              <Select.Content>
                {propertyTypes.map(({ value, description }: any) => (
                  <Select.Item value={value}>{description}</Select.Item>
                ))}
              </Select.Content>
            </Select>
          </FieldWithError>
        )}
      />
      <Form.Field
        control={form.control}
        name={`${parentFieldName}.propertyName`}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => (
          <FieldWithError error={fieldState.error}>
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <Select.Trigger className="w-4/6 rounded-r-lg border-l-none">
                <Select.Value placeholder="Select an field" />
              </Select.Trigger>
              <Select.Content>
                {Object.keys(groups).map((key) => {
                  let groupName = key;
                  const groupDetail = (groups[key] || []).find(
                    ({ group }: any) => group === key,
                  )?.groupDetail;

                  if (groupDetail) {
                    groupName = groupDetail?.name || key;
                  }
                  return (
                    <>
                      <Select.Group>
                        <Select.Label>{groupName}</Select.Label>
                        {groups[key].map(({ name, label }: any) => (
                          <Select.Item value={name}>{label}</Select.Item>
                        ))}
                      </Select.Group>
                      <Select.Separator />
                    </>
                  );
                })}
              </Select.Content>
            </Select>
          </FieldWithError>
        )}
      />
    </div>
  );
};

const PropertyOperator = ({
  index,
  form,
  currentField,
  operators,
  parentFieldName,
  defaultValue,
}: IPropertyCondtion<z.infer<typeof formSchema>>) => {
  return (
    <Form.Field
      control={form.control}
      name={`${parentFieldName}.propertyOperator`}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FieldWithError error={fieldState.error}>
          <Select
            defaultValue={field?.value}
            disabled={!currentField}
            onValueChange={(selectedValue) => field.onChange(selectedValue)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select an operator" />
            </Select.Trigger>
            <Select.Content>
              {operators.map((operator, i) => (
                <Select.Item value={operator.value}>
                  {operator.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </FieldWithError>
      )}
    />
  );
};

const PropertyInput = ({
  index,
  form,
  defaultValue,
  parentFieldName,
  operators,
  selectedField,
}: IPropertyInput<z.infer<typeof formSchema>>) => {
  const propertyOperator = form.watch(`${parentFieldName}.propertyOperator`);
  const propertyName = form.getValues(`${parentFieldName}.propertyName`);

  const selectedOperator = operators.find(
    (operator) => operator.value === propertyOperator,
  );

  const { value = '', noInput } = selectedOperator || {};

  if (noInput) {
    return null;
  }

  const {
    selectOptions = [],
    selectionConfig,
    type,
    choiceOptions = [],
  } = selectedField || {};
  console.log({ selectedField, value });

  if (['is', 'ins', 'it', 'if'].indexOf(value) >= 0) {
    return null;
  }

  let Component = (_: ControllerRenderProps<any, any>) => <Input disabled />;

  if (['dateigt', 'dateilt', 'drlt', 'drgt'].includes(value)) {
    Component = (field: ControllerRenderProps<any, any>) => (
      <DatePicker
        className="w-full"
        value={field.value}
        onChange={(date) => field.onChange(date as Date)}
        placeholder="Select date"
      />
    );
  }

  if (selectOptions.length > 0) {
    Component = (field: ControllerRenderProps<any, any>) => (
      <Select
        defaultValue={field?.value}
        onValueChange={(selectedValue) => field.onChange(selectedValue)}
      >
        <Select.Trigger>
          <Select.Value className="w-full" />
        </Select.Trigger>
        <Select.Content>
          {selectOptions.map((option) => (
            <Select.Item value={`${option?.value}`}>
              {option?.label || '-'}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    );
  }

  if (selectionConfig) {
    const {
      queryName,
      selectionName,
      labelField,
      valueField = '_id',
      multi,
    } = selectionConfig;
    const query = gql`
        query ${queryName}($searchValue: String,$direction: CURSOR_DIRECTION,$cursor: String,$limit:Int) {
          ${queryName}(searchValue: $searchValue,direction:$direction,cursor:$cursor,limit:$limit) {
            list{${labelField},${valueField}}
            totalCount,
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      `;
    Component = (field: ControllerRenderProps<any, any>) => (
      <SelectCommand
        query={query}
        queryName={queryName}
        labelField={labelField}
        valueField={valueField}
        nullable
        initialValue={field.value}
        onSelect={(value) => field.onChange(value)}
        focusOnMount
      />
    );
  }

  if (type === 'radio' && choiceOptions.length > 0) {
    const options = choiceOptions.map((opt) => ({ value: opt, label: opt }));

    Component = (field: ControllerRenderProps<any, any>) => (
      <Select
        defaultValue={field?.value}
        onValueChange={(selectedValue) => field.onChange(selectedValue)}
      >
        <Select.Trigger>
          <Select.Value className="w-full" />
        </Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item value={`${option?.value}`}>
              {option?.label || '-'}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    );
  }

  return (
    <Form.Field
      control={form.control}
      name={`${parentFieldName}.propertyValue`}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FieldWithError error={fieldState.error}>
          <Form.Item className="flex-1">
            <Form.Control>{Component(field)}</Form.Control>
            <Form.Message />
          </Form.Item>
        </FieldWithError>
      )}
    />
  );
};

const Property = ({
  index,
  form,
  condition,
  remove,
  isFirst,
  isLast,
  total,
  parentFieldName,
}: IProperty<z.infer<typeof formSchema>>) => {
  const fieldName = createFieldNameSafe(parentFieldName, 'conditions', index);
  const propertyType = form.watch(`${fieldName}.propertyType` as any);
  const { fields, propertyTypes } = getFieldsProperties(propertyType);

  const { selectedField, operators } =
    getSelectedFieldConfig(
      form.watch(`${fieldName}.propertyName` as any),
      fields,
    ) || {};

  const renderAndOrBtn = () => {
    const hasTwoElement = total === 2;
    const isOdd = Math.round(total) % 2 === 0;
    const middleIndex = Math.round(total / 2) + (isOdd ? 1 : 0);

    if (middleIndex === index + 1 || (hasTwoElement && index === 1)) {
      const field:
        | `conditionSegments.${number}.conditionsConjunction`
        | 'conditionsConjunction' = parentFieldName
        ? `${parentFieldName}.conditionsConjunction`
        : `conditionsConjunction`;
      const value = form.getValues(field);
      const handleClick = () => {
        form.setValue(field, value === 'or' ? 'and' : 'or');
      };
      return (
        <div
          className={cn(
            'absolute z-10 -left-1 cursor-pointer hover:bg-amber-200 text-amber-600/50 w-12 h-6 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-medium transition',
            {
              '-top-3': isOdd,
              'bg-green-100 text-green-600 hover:bg-green-100 hover:text-green-600/50':
                value === 'and',
            },
          )}
          onClick={handleClick}
        >
          {(value || '')?.toUpperCase() || 'OR'}
        </div>
      );
    }
  };

  return (
    <div className="flex items-center relative">
      {/* Tree line connector */}
      {total > 1 && (
        <div className="absolute left-0 flex items-center h-full">
          {/* Vertical line */}
          {!isFirst && (
            <div className="absolute top-0 left-[24px] w-[1px] h-1/2 bg-gray-300"></div>
          )}
          {!isLast && (
            <div className="absolute bottom-0 left-[24px] w-[1px] h-1/2 bg-gray-300"></div>
          )}

          {/* Horizontal line */}
          <div className="absolute left-[24px] w-[20px] h-[1px] bg-gray-300"></div>

          {/* OR label (only on second item) */}
          {renderAndOrBtn()}
        </div>
      )}

      <div
        className={`flex flex-row gap-4 w-full py-2 group ${
          total > 1 ? 'pl-12' : ''
        }`}
      >
        <div className="w-2/5">
          <PropertyField
            defaultValue={condition.propertyName}
            parentFieldName={fieldName}
            index={index}
            form={form}
            fields={fields}
            currentField={selectedField}
            propertyTypes={propertyTypes}
          />
        </div>
        <div className="w-1/5">
          <PropertyOperator
            defaultValue={condition.propertyOperator}
            parentFieldName={fieldName}
            index={index}
            form={form}
            currentField={selectedField}
            operators={operators || []}
          />
        </div>
        <div className="w-2/5 flex items-center gap-2">
          <PropertyInput
            defaultValue={condition.propertyValue}
            parentFieldName={fieldName}
            index={index}
            form={form}
            operators={operators || []}
            selectedField={selectedField}
          />
          <Button
            variant="destructive"
            size="icon"
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => remove()}
          >
            <IconTrash size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Property;
