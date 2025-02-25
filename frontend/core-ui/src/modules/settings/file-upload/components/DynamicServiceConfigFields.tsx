import { AnimatePresence, motion } from 'motion/react';

import {
  Checkbox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'erxes-ui/components';

import { UPLOAD_SERVICE_DATA } from '@/settings/file-upload/constants/serviceData';
import {
  DynamicFieldsT,
  UploadConfigFormT,
} from '@/settings/file-upload/types';
import { FormProps, Path } from 'react-hook-form';

interface TField {
  label: string;
  name: string;
  type: string;
}

type Props = {
  dynamicFields: TField[];
  selected: string;
  form: FormProps<UploadConfigFormT>;
};

export function DynamicServiceConfigFields({
  dynamicFields,
  selected,
  form,
}: Props) {
  return (
    <AnimatePresence mode="popLayout">
      {dynamicFields.length > 0 && (
        <motion.div
          key={selected}
          initial={false}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex flex-col bg-background rounded-lg h-auto shadow-sm overflow-hidden mb-4"
        >
          <h4 className="font-semibold text-base p-3">
            {UPLOAD_SERVICE_DATA.find((item) => item.value === selected)?.label}
          </h4>
          <div className="grid grid-cols-4 gap-1 p-4">
            {dynamicFields.map((fieldData: TField) =>
              fieldData.type === 'checkbox' ? (
                <FormField
                  control={form.control}
                  name={fieldData.name as Path<UploadConfigFormT>}
                  key={fieldData.name}
                  render={({ field }) => (
                    <FormItem className="col-span-4 flex items-center justify-start gap-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          id={fieldData.name}
                        />
                      </FormControl>
                      <FormLabel className="text-xs">
                        {fieldData.label}
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name={fieldData.name as keyof DynamicFieldsT}
                  key={fieldData.name}
                  render={({ field }) => (
                    <FormItem
                      className={
                        selected === 'GCS' ? 'col-span-4' : 'col-span-2'
                      }
                    >
                      <FormLabel className="text-xs">
                        {fieldData.label}
                      </FormLabel>
                      <FormControl>
                        <Input type={'text'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ),
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
