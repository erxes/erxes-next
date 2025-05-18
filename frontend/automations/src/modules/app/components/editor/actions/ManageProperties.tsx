import {
  Control,
  ControllerRenderProps,
  useFormContext,
} from 'react-hook-form';
import { getFieldsProperties, IActionProps, SelectCommand } from 'ui-modules';
import { TAutomationProps } from '../common/formSchema';
import { getContentType } from '../common/utils';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Label,
  Select,
} from 'erxes-ui/components';
import { FieldWithError } from 'ui-modules/modules/segments/common/FieldWithError';
import { groupByType } from 'ui-modules/modules/segments/utils';
import { PROPERTY_OPERATOR } from '~/modules/constants';
import gql from 'graphql-tag';
import { IconChevronDown, IconTrash } from '@tabler/icons-react';
import { IField as UIModuleField } from 'ui-modules/modules/segments/types';
import { SelectTrigger } from '@radix-ui/react-select';
import { Attributes } from 'ui-modules/modules/automations/common/Attributes';
import { useEffect } from 'react';

type OperatorType = 'String' | 'Date' | 'Number' | 'Default';

// Types
interface IField extends Partial<UIModuleField> {
  name: string;
  label: string;
  type?: string;
  validation?: string;
  selectOptions?: Array<{ value: string | number; label: string }>;
  selectionConfig?: {
    queryName: string;
    selectionName: string;
    labelField: string;
    valueField: string;
    multi?: boolean;
  };
  choiceOptions?: string[];
  group?: string;
  groupDetail?: {
    name: string;
  };
}

interface IOperator {
  value: string;
  label: string;
  noInput?: boolean;
}

interface IRule {
  field: string;
  operator: string;
  value?: any;
}

interface IConfig {
  module?: string;
  rules: IRule[];
}

type IFieldName = `detail.actions.${number}.config`;

// Component Props
interface RuleInputProps {
  selectedOperator?: IOperator;
  selectedField?: IField;
  value: any;
  onChange: (value: any) => void;
}

interface RuleProps {
  rule: IRule;
  selectedField?: IField;
  remove: () => void;
  handleChange: (name: string, value: any) => void;
  groups: Record<string, IField[]>;
  operatorOptions: IOperator[];
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Components
const RuleInput = ({
  selectedOperator,
  selectedField,
  value,
  onChange,
}: RuleInputProps) => {
  const { value: operatorValue = '', noInput } = selectedOperator || {};

  if (noInput) {
    return null;
  }

  const {
    selectOptions = [],
    selectionConfig,
    type,
    choiceOptions = [],
  } = selectedField || {};

  console.log({ selectOptions, selectionConfig });

  const renderOptions = () => {
    if (!!selectionConfig) {
      const { queryName, labelField, valueField = '_id' } = selectionConfig;

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

      return (
        <SelectCommand
          query={query}
          queryName={queryName}
          labelField={labelField}
          valueField={valueField}
          nullable
          initialValue={value}
          onSelect={onChange}
          focusOnMount
        />
      );
    }

    if (!!selectOptions?.length) {
      return (
        <Select>
          <Select.Trigger>
            <Button variant="link">
              Options <IconChevronDown />
            </Button>
          </Select.Trigger>
          <Select.Content>
            {selectOptions.map((option) => (
              <Select.Item
                key={String(option.value)}
                value={String(option.value)}
              >
                {option.label || '-'}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      );
    }
  };

  // if (['is', 'ins', 'it', 'if'].indexOf(operatorValue) >= 0) {
  //   return null;
  // }

  // if (['dateigt', 'dateilt', 'drlt', 'drgt'].includes(operatorValue)) {
  //   return (
  //     <DatePicker
  //       className="w-full"
  //       value={value}
  //       onChange={(date) => onChange(date as Date)}
  //       placeholder="Select date"
  //     />
  //   );
  // }

  // if (selectOptions.length > 0) {
  //   return (
  //     <Select value={value} onValueChange={onChange}>
  //       <Select.Trigger>
  //         <Select.Value className="w-full" />
  //       </Select.Trigger>
  //       <Select.Content>
  //         {selectOptions.map((option) => (
  //           <Select.Item
  //             key={String(option.value)}
  //             value={String(option.value)}
  //           >
  //             {option.label || '-'}
  //           </Select.Item>
  //         ))}
  //       </Select.Content>
  //     </Select>
  //   );
  // }

  // if (selectionConfig) {
  //   const { queryName, labelField, valueField = '_id' } = selectionConfig;

  //   const query = gql`
  //     query ${queryName}($searchValue: String,$direction: CURSOR_DIRECTION,$cursor: String,$limit:Int) {
  //       ${queryName}(searchValue: $searchValue,direction:$direction,cursor:$cursor,limit:$limit) {
  //         list{${labelField},${valueField}}
  //         totalCount,
  //         pageInfo {
  //           hasNextPage
  //           hasPreviousPage
  //           startCursor
  //           endCursor
  //         }
  //       }
  //     }
  //   `;

  //   return (
  //     <SelectCommand
  //       query={query}
  //       queryName={queryName}
  //       labelField={labelField}
  //       valueField={valueField}
  //       nullable
  //       initialValue={value}
  //       onSelect={onChange}
  //       focusOnMount
  //     />
  //   );
  // }

  // if (type === 'radio' && choiceOptions.length > 0) {
  //   const options = choiceOptions.map((opt) => ({
  //     value: opt,
  //     label: opt,
  //   }));

  //   return (
  //     <Select value={value} onValueChange={onChange}>
  //       <Select.Trigger>
  //         <Select.Value className="w-full" />
  //       </Select.Trigger>
  //       <Select.Content>
  //         {options.map((option) => (
  //           <Select.Item key={option.value} value={option.value}>
  //             {option.label || '-'}
  //           </Select.Item>
  //         ))}
  //       </Select.Content>
  //     </Select>
  //   );
  // }

  return (
    <div className="flex flex-col items-end">
      {renderOptions()}
      <Attributes
        contentType={type || ''}
        onSelect={(value) => console.log(value)}
      />
      <Input
        value={value}
        placeholder="Value"
        onChange={(e) => onChange(e.target.value)}
        disabled={!operatorValue}
      />
    </div>
  );
};

const Rule = ({
  rule,
  remove,
  handleChange,
  groups,
  selectedField,
  operatorOptions,
}: RuleProps) => {
  return (
    <div className="flex flex-row gap-4 mb-4 group items-end">
      <Select
        value={rule.field}
        onValueChange={(value) => handleChange('field', value)}
      >
        <Select.Trigger className="w-2/5">
          <Select.Value placeholder="Select an field" />
        </Select.Trigger>
        <Select.Content>
          {Object.entries(groups).map(([key, fields]) => {
            const groupName =
              fields.find(({ group }) => group === key)?.groupDetail?.name ||
              key;

            return (
              <div key={key}>
                <Select.Group>
                  <Select.Label>{groupName}</Select.Label>
                  {fields.map(({ name, label }) => (
                    <Select.Item key={name} value={name}>
                      {label}
                    </Select.Item>
                  ))}
                </Select.Group>
                <Select.Separator />
              </div>
            );
          })}
        </Select.Content>
      </Select>

      <Select
        value={rule.operator}
        onValueChange={(value) => handleChange('operator', value)}
      >
        <Select.Trigger className="w-1/5 ">
          <Select.Value placeholder="Select an operator" />
        </Select.Trigger>
        <Select.Content>
          {operatorOptions.map(({ value, label }) => (
            <Select.Item key={value} value={value}>
              {label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      <div className="w-2/5">
        <RuleInput
          selectedOperator={operatorOptions.find(
            (op) => op.value === rule.operator,
          )}
          selectedField={selectedField}
          value={rule.value}
          onChange={(value) => handleChange('value', value)}
        />
      </div>

      <Button
        variant="destructive"
        size="icon"
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={remove}
      >
        <IconTrash size={16} />
      </Button>
    </div>
  );
};

export const ManageProperties = ({
  currentActionIndex,
  currentAction,
  handleSave,
}: IActionProps) => {
  const fieldName: IFieldName = `detail.actions.${currentActionIndex}.config`;
  const { setValue, watch, control } = useFormContext<TAutomationProps>();
  const { actions = [], triggers = [] } = watch('detail');
  const propertyType = getContentType(currentAction, actions, triggers);

  useEffect(() => {
    if (watch(fieldName)?.module !== propertyType) {
      setValue(`${fieldName}.module`, propertyType);
    }
  }, [propertyType]);
  const { propertyTypes, fields } = getFieldsProperties(propertyType);

  const groups = groupByType(fields);
  const config = watch(fieldName) as IConfig;
  const { rules = [{ field: '', operator: '' }] } = config || {};

  const addRule = () => {
    setValue(fieldName, {
      ...config,
      rules: [...rules, { field: '', operator: '' }],
    });
  };

  return (
    <Card.Content className="!w-2xl">
      <Form.Field
        control={control}
        name={`${fieldName}.module`}
        render={({ field }) => (
          <FieldWithError>
            <Form.Item>
              <Form.Label>Property Type</Form.Label>
              <Form.Control>
                <Select
                  value={field.value || propertyType}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select a property type" />
                  </Select.Trigger>
                  <Select.Content>
                    {propertyTypes.map(({ value, description }) => (
                      <Select.Item key={value} value={value}>
                        {description}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Control>
            </Form.Item>
          </FieldWithError>
        )}
      />

      <div className="py-4">
        <Label className="pb-4">Rules</Label>

        {rules.map((rule, index) => {
          const handleChange = (name: string, value: any) => {
            const updatedRules = [...rules];
            updatedRules[index] = { ...updatedRules[index], [name]: value };
            setValue(`${fieldName}.rules` as any, updatedRules);
          };

          const selectedField = fields.find(
            (field) => field.name === rule.field,
          );

          const handleRemove = () => {
            setValue(
              `${fieldName}.rules` as any,
              rules.filter((_, ruleIndex) => index !== ruleIndex),
            );
          };

          const operatorType = selectedField?.name.includes('customFieldsData')
            ? capitalizeFirstLetter(selectedField?.validation || 'String')
            : selectedField?.type || '';

          const operators =
            PROPERTY_OPERATOR[operatorType as OperatorType] ||
            PROPERTY_OPERATOR.Default;

          return (
            <Rule
              key={index}
              rule={rule}
              handleChange={handleChange}
              remove={handleRemove}
              groups={groups}
              selectedField={selectedField}
              operatorOptions={operators}
            />
          );
        })}

        <Button className="w-full" variant="secondary" onClick={addRule}>
          <Label>Add Rule</Label>
        </Button>
      </div>
    </Card.Content>
  );
};

export const NodeContent = ({ config }: any) => {
  const { module, rules } = config || {};
  return (
    <>
      <div className="flex justify-between text-slate-600 text-xs">
        <span className="font-mono">Content Type:</span>
        <span className="font-mono capitalize">{`${
          (module || '').split(':')[1]
        }`}</span>
      </div>
      {rules.map(({ field, value }: any, index: number) => (
        <div
          key={index}
          className="flex justify-between text-slate-600 text-xs"
        >
          <span className="font-mono">{field}:</span>
          <span className="font-mono">{value}</span>
        </div>
      ))}
    </>
  );
};
