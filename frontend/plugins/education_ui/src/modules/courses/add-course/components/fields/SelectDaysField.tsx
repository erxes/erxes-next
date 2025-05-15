import { Form } from 'erxes-ui';
import { Control } from 'react-hook-form';
import { CourseFormType } from '@/courses/add-course/components/formSchema';

export const daysAsString = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const SelectDaysField = ({
  control,
}: {
  control: Control<CourseFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name={'dayOfWeek'}
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Хичээллэх өдрүүд</Form.Label>
          <Form.Control>
            <div className="flex flex-row gap-2 w-full">
              {daysAsString.map((day) => {
                const value: (typeof daysAsString)[number][] = Array.isArray(
                  field.value,
                )
                  ? field.value
                  : field.value
                  ? [field.value]
                  : [];
                const isSelected = value.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    className={`flex-1 text-center px-3 py-1 rounded cursor-pointer border transition-colors select-none flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                    onClick={() => {
                      let newValue: (typeof daysAsString)[number][] =
                        Array.isArray(field.value)
                          ? [...field.value]
                          : field.value
                          ? [field.value]
                          : [];
                      if (isSelected) {
                        newValue = newValue.filter((d) => d !== day);
                      } else {
                        newValue = [...newValue, day];
                      }
                      field.onChange(newValue);
                    }}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </Form.Control>
        </Form.Item>
      )}
    />
  );
};
