import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Select,
  ScrollArea
} from 'erxes-ui/components';
import MultipleSelector from 'erxes-ui/components/multiselect';
import { FILE_SYSTEM_TYPES } from '../constants/serviceData';

export default function FileUploadMainFields({ form, modifiedArray }: { form: any, modifiedArray: any[] }) {
  return (
    <div className='grid grid-cols-1 gap-4'>
      <FormItem className='w-full'>
        <FormField
          name='UPLOAD_FILE_TYPES'
          key={'UPLOAD_FILE_TYPES'}
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel>Upload File Types</FormLabel>
              <MultipleSelector
                {...field}
                options={modifiedArray}
                placeholder="Select option"
                hideClearAllButton
                hidePlaceholderWhenSelected
                emptyIndicator={<p className="text-center text-sm">No results found</p>}
              />
            </div>
          )}
        />
        <FormMessage />
      </FormItem>
      <FormItem>
        <FormField
          name='WIDGETS_UPLOAD_FILE_TYPES'
          key={'WIDGETS_UPLOAD_FILE_TYPES'}
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel>Upload File Types of Widget</FormLabel>
              <MultipleSelector
                {...field}
                options={modifiedArray}
                placeholder="Select option"
                hideClearAllButton
                hidePlaceholderWhenSelected
                emptyIndicator={<p className="text-center text-sm">No results found</p>}
              />
            </div>
          )}
        />
        <FormMessage />
      </FormItem>
      <FormField
        control={form.control}
        name='FILE_SYSTEM_PUBLIC'
        key='FILE_SYSTEM_PUBLIC'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bucket file system type</FormLabel>
            <FormControl>
              <Select name={field.name} onValueChange={field.onChange} value={field.value}>
                <Select.Trigger>
                  <Select.Value placeholder={'-'} />
                </Select.Trigger>
                <Select.Content>
                  {
                    FILE_SYSTEM_TYPES.map((type) => (
                      <Select.Item key={type.value} value={type.value}>{type.label}</Select.Item>
                    ))
                  }
                </Select.Content>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
