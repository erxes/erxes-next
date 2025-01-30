import { motion } from 'motion/react';

import { FormField,RadioGroup } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';

import { uploadServiceData } from '@/settings/file-upload/constants/serviceData';

export function UploadServiceRadioGroup({ form, selected }) {
  return (
    <div>
      <FormField
        control={form.control}
        name="UPLOAD_SERVICE_TYPE"
        key={'UPLOAD_SERVICE_TYPE'}
        render={({ field }) => (
          <RadioGroup
            role="tablist"
            className="grid-cols-3"
            defaultValue={field.value}
            onValueChange={field.onChange}
          >
            {uploadServiceData &&
              uploadServiceData.map((config, idx) => (
                <motion.label
                  key={idx}
                  tabIndex={0}
                  whileTap={{ scale: 0.975 }}
                  whileHover={{ scale: 1.0175 }}
                  className="relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-input hover:bg-accent px-2 py-3 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary-foreground has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring/70"
                >
                  <RadioGroup.Item
                    id={config.value}
                    value={config.value}
                    className="sr-only after:absolute after:inset-0"
                  />
                  <config.icon
                    className={cn(
                      selected === config.value
                        ? 'stroke-primary'
                        : 'stroke-primary/40',
                      ''
                    )}
                  />
                  <span
                    className={cn(
                      selected === config.value ? 'opacity-100' : 'opacity-40',
                      ''
                    )}
                  >
                    {config.label}
                  </span>
                </motion.label>
              ))}
          </RadioGroup>
        )}
      />
    </div>
  );
}
