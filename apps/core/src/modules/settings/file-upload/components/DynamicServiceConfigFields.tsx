import { motion, AnimatePresence } from 'motion/react';
import {
  FormField,
  FormItem,
  FormControl,
  Checkbox,
  FormLabel,
  FormMessage,
  Input
} from 'erxes-ui/components';
import { uploadServiceData } from '@/settings/file-upload/constants/serviceData';
import { DynamicFieldsT } from '@/settings/file-upload/types';

export default function DynamicServiceConfigFields({ dynamicFields, selected, form }) {
  return (
    <AnimatePresence mode='popLayout'>
      {
        dynamicFields.length > 0 && (
          <motion.div
            key={selected}
            initial={false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='flex flex-col bg-primary-foreground rounded-lg h-auto shadow-sm overflow-hidden mb-4'
          >
            <h4 className='font-semibold text-base p-3'>{uploadServiceData.find((item) => item.value === selected)?.label}</h4>
            <div className='grid grid-cols-4 gap-1 p-4'>
              {
                dynamicFields.map((fieldData) =>
                  fieldData.type === 'checkbox' ? (
                    <FormField
                      control={form.control}
                      name={fieldData.name}
                      key={fieldData.name}
                      render={({ field }) => (
                        <FormItem className='col-span-4 flex items-center justify-start gap-x-2'>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id={fieldData.name}
                            />
                          </FormControl>
                          <FormLabel className='text-xs'>{fieldData.label}</FormLabel>
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
                          <FormLabel className='text-xs'>{fieldData.label}</FormLabel>
                          <FormControl>
                            <Input type={'text'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
            </div>
          </motion.div>
        )
      }
    </AnimatePresence>
  )
}
