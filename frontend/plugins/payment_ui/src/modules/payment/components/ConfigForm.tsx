import { Input, Label } from 'erxes-ui/components';
import React from 'react';

type InputItem = {
  key: string;
  label: string;
  type?: string;
  description?: string;
};

type Props = {
  inputs: InputItem[];
};

const ConfigForm = ({ inputs }: Props) => {
  const renderInput = (
    key: string,
    title: string,
    type?: string,
    description?: string
  ) => {
    return (
      <div key={key} className="mb-6">
        <Label className="block text-sm font-medium text-gray-700 mb-1">
          {title}
        </Label>
        {description && (
          <p className="text-xs text-gray-500 mb-2">{description}</p>
        )}
        <Input
          name={key}
          placeholder={title}
          type={type || 'text'}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {inputs.map((input) =>
        renderInput(input.key, input.label, input.type, input.description)
      )}
    </div>
  );
};

export default ConfigForm;
