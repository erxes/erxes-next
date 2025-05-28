'use client';
import { Input, Label, Switch } from 'erxes-ui';
import { SelectMember } from 'ui-modules';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PermissionFormValues, permissionSchema } from '../formSchema';
import { useEffect, useState } from 'react';

interface PermissionFormProps {
  form?: UseFormReturn<PermissionFormValues>;
  onFormSubmit?: (data: PermissionFormValues) => void;
}

export default function PermissionForm({ form: externalForm, onFormSubmit }: PermissionFormProps) {
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');
  const [selectedCashierId, setSelectedCashierId] = useState<string>('');

  const internalForm = useForm({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      adminTeamMember: '',
      adminPrintTempBill: false,
      adminDirectSales: false,
      adminDirectDiscountLimit: '',
      cashierTeamMember: '',
      cashierPrintTempBill: false,
      cashierDirectSales: false,
      cashierDirectDiscountLimit: '',
      adminIds: [],
      cashierIds: [],
      permissionConfig: {},
    },
  });

  const form = externalForm || internalForm;

  // Helper function to get current adminIds and cashierIds
  const getCurrentIds = () => {
    return {
      adminIds: selectedAdminId ? [selectedAdminId] : [],
      cashierIds: selectedCashierId ? [selectedCashierId] : [],
    };
  };

  // Helper function to transform form data
  const transformFormData = (values: any): PermissionFormValues => {
    const { adminIds, cashierIds } = getCurrentIds();
    
    return {
      ...values,
      adminIds,
      cashierIds,
      permissionConfig: {
        admin: {
          printTempBill: values.adminPrintTempBill || false,
          directSales: values.adminDirectSales || false,
          directDiscountLimit: values.adminDirectDiscountLimit || '',
        },
        cashier: {
          printTempBill: values.cashierPrintTempBill || false,
          directSales: values.cashierDirectSales || false,
          directDiscountLimit: values.cashierDirectDiscountLimit || '',
        },
      },
    };
  };

  // Auto-save functionality when form values change
  useEffect(() => {
    if (onFormSubmit) {
      const subscription = form.watch((values) => {
        const transformedData = transformFormData(values);
        console.log('Auto-save transformed data:', transformedData);
        console.log('Admin IDs:', transformedData.adminIds);
        console.log('Cashier IDs:', transformedData.cashierIds);
        onFormSubmit(transformedData);
      });
      
      return () => subscription.unsubscribe();
    }
  }, [form, onFormSubmit, selectedAdminId, selectedCashierId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await form.trigger();
    if (!isValid) {
      console.log('Form validation failed');
      return;
    }

    const formData = form.getValues();
    const transformedData = transformFormData(formData);

    console.log('Form submit - Permission form data:', transformedData);
    console.log('Form submit - Admin IDs:', transformedData.adminIds);
    console.log('Form submit - Cashier IDs:', transformedData.cashierIds);
    
    if (onFormSubmit) {
      onFormSubmit(transformedData);
    }
  };

  // Function to get adminIds directly (for external use)
  const getAdminIds = () => {
    return selectedAdminId ? [selectedAdminId] : [];
  };

  // Function to get cashierIds directly (for external use)
  const getCashierIds = () => {
    return selectedCashierId ? [selectedCashierId] : [];
  };

  // Handle admin member selection - FIXED VERSION
  const handleAdminMemberChange = (value: string | string[]) => {
    // Handle both single string and array cases
    const userId = Array.isArray(value) ? value[0] : value;
    const finalUserId = userId || '';
    
    console.log('Admin member selected:', finalUserId);
    
    setSelectedAdminId(finalUserId);
    form.setValue('adminTeamMember', finalUserId, { shouldValidate: true });
    form.setValue('adminIds', finalUserId ? [finalUserId] : [], { shouldValidate: true });
    
    console.log('Updated adminIds:', finalUserId ? [finalUserId] : []);
  };

  // Handle cashier member selection - FIXED VERSION
  const handleCashierMemberChange = (value: string | string[]) => {
    // Handle both single string and array cases
    const userId = Array.isArray(value) ? value[0] : value;
    const finalUserId = userId || '';
    
    console.log('Cashier member selected:', finalUserId);
    
    setSelectedCashierId(finalUserId);
    form.setValue('cashierTeamMember', finalUserId, { shouldValidate: true });
    form.setValue('cashierIds', finalUserId ? [finalUserId] : [], { shouldValidate: true });
    
    console.log('Updated cashierIds:', finalUserId ? [finalUserId] : []);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <h2 className="text-[#4F46E5] text-lg font-semibold">ADMINS</h2>
            <p className="text-[#A1A1AA] text-xs font-semibold">POS ADMIN</p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">Select admin team member</p>
            <div>
              {/* FIXED: Proper SelectMember usage */}
              <SelectMember.Detail
                value={selectedAdminId || undefined}
                onValueChange={handleAdminMemberChange}
                className="w-full h-10 justify-start border border-gray-300 bg-white hover:bg-gray-50"
              />
              {form.formState.errors.adminTeamMember && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.adminTeamMember.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex gap-4 flex-col">
              <span className="text-[#71717A] text-sm font-medium uppercase">
                IS PRINT TEMP BILL
              </span>
              <Switch
                className="scale-150 w-7"
                checked={form.watch('adminPrintTempBill')}
                onCheckedChange={(checked) => {
                  console.log('Admin print temp bill changed:', checked);
                  form.setValue('adminPrintTempBill', checked, { shouldValidate: true });
                }}
              />
            </div>
            <div className="flex gap-4 flex-col">
              <span className="text-[#71717A] text-sm font-medium uppercase">
                DIRECT SALES
              </span>
              <Switch
                className="scale-150 w-7"
                checked={form.watch('adminDirectSales')}
                onCheckedChange={(checked) => {
                  console.log('Admin direct sales changed:', checked);
                  form.setValue('adminDirectSales', checked, { shouldValidate: true });
                }}
              />
            </div>
          </div>
          
          {form.watch('adminDirectSales') && (
            <div className="space-y-2">
              <Label className="text-gray-500 text-sm">
                DIRECT DISCOUNT LIMIT
              </Label>
              <Input
                value={form.watch('adminDirectDiscountLimit')}
                onChange={(e) => {
                  console.log('Admin discount limit changed:', e.target.value);
                  form.setValue('adminDirectDiscountLimit', e.target.value, { shouldValidate: true });
                }}
                placeholder="Write here"
                className="h-10"
              />
            </div>
          )}
        </div>

        <div className="space-y-4 pt-6 border-t">
          <div className="flex flex-col gap-3">
            <h2 className="text-[#4F46E5] text-lg font-semibold">Cashiers</h2>
            <p className="text-[#A1A1AA] text-xs font-semibold">Pos Cashier</p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">Choose cashier team member</p>
            <div>
              {/* FIXED: Proper SelectMember usage */}
              <SelectMember.Detail
                value={selectedCashierId || undefined}
                onValueChange={handleCashierMemberChange}
                className="w-full h-10 justify-start border border-gray-300 bg-white hover:bg-gray-50"
              />
              {form.formState.errors.cashierTeamMember && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.cashierTeamMember.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex gap-4 flex-col">
              <span className="text-[#71717A] text-sm font-medium uppercase">
                IS PRINT TEMP BILL
              </span>
              <Switch
                className="scale-150 w-7"
                checked={form.watch('cashierPrintTempBill')}
                onCheckedChange={(checked) => {
                  console.log('Cashier print temp bill changed:', checked);
                  form.setValue('cashierPrintTempBill', checked, { shouldValidate: true });
                }}
              />
            </div>
            <div className="flex gap-4 flex-col">
              <span className="text-[#71717A] text-sm font-medium uppercase">
                DIRECT SALES
              </span>
              <Switch
                className="scale-150 w-7"
                checked={form.watch('cashierDirectSales')}
                onCheckedChange={(checked) => {
                  console.log('Cashier direct sales changed:', checked);
                  form.setValue('cashierDirectSales', checked, { shouldValidate: true });
                }}
              />
            </div>
          </div>

          {form.watch('cashierDirectSales') && (
            <div className="space-y-2">
              <Label className="text-gray-500 text-sm">
                DIRECT DISCOUNT LIMIT
              </Label>
              <Input
                value={form.watch('cashierDirectDiscountLimit')}
                onChange={(e) => {
                  console.log('Cashier discount limit changed:', e.target.value);
                  form.setValue('cashierDirectDiscountLimit', e.target.value, { shouldValidate: true });
                }}
                placeholder="Write here"
                className="h-10"
              />
            </div>
          )}
        </div>

        {/* Debug section - remove in production */}
        <div className="p-4 bg-gray-100 rounded text-xs">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <div className="space-y-1">
            <div><strong>Selected Admin ID:</strong> {selectedAdminId || 'None'}</div>
            <div><strong>Selected Cashier ID:</strong> {selectedCashierId || 'None'}</div>
            <div><strong>Current Admin IDs:</strong> {JSON.stringify(getAdminIds())}</div>
            <div><strong>Current Cashier IDs:</strong> {JSON.stringify(getCashierIds())}</div>
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer font-bold">Full Form Data</summary>
            <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(form.watch(), null, 2)}</pre>
          </details>
        </div>

        {/* Utility functions for external access */}
        <div className="hidden">
          {/* These can be accessed via ref if needed */}
          <button type="button" onClick={() => console.log('Admin IDs:', getAdminIds())}>
            Get Admin IDs
          </button>
          <button type="button" onClick={() => console.log('Cashier IDs:', getCashierIds())}>
            Get Cashier IDs
          </button>
        </div>
      </div>
    </form>
  );
}

// Export utility functions for external use
export const getPermissionFormIds = (formRef: React.RefObject<any>) => {
  if (!formRef.current) return { adminIds: [], cashierIds: [] };
  
  return {
    adminIds: formRef.current.getAdminIds?.() || [],
    cashierIds: formRef.current.getCashierIds?.() || [],
  };
};