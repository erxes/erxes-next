import { SelectDepartments } from 'ui-modules';
import { useState } from 'react';

const ChooseDepartment = () => {
  const [departmentId, setDepartmentId] = useState<
    string | string[] | undefined
  >('');

  const handleDepartmentChange = (value: string | string[] | undefined) => {
    console.log('aaa', value);
    // setDepartmentId(value);
  };

  return (
    <div>
      <SelectDepartments.FormItem
        value={departmentId}
        onValueChange={handleDepartmentChange}
        className="w-full h-10"
        mode="single"
      />
    </div>
  );
};

export default ChooseDepartment;
