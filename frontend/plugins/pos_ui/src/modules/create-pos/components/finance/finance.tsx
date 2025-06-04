'use client';
import { Input, Label, Select, Switch } from 'erxes-ui';
import { useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { financeConfigSettingsAtom } from '../../states/posCategory';
import { useEffect, useState } from 'react';
import { IPosDetail } from '~/modules/pos-detail.tsx/types/IPos';

interface FinanceConfigFormProps {
  posDetail?: IPosDetail;
  isReadOnly?: boolean;
  onSubmit?: (data: any) => Promise<void>;
}

export default function FinanceConfigForm({ 
  posDetail, 
  isReadOnly = false, 
  onSubmit 
}: FinanceConfigFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [financeConfig, setFinanceConfig] = useAtom(financeConfigSettingsAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (posDetail) {
      setFinanceConfig({
        isSyncErkhet: posDetail.erkhetConfig?.isSyncErkhet ?? false,
        checkErkhet: posDetail.erkhetConfig?.checkErkhet ?? false,
        checkInventories: posDetail.isCheckRemainder ?? false, 
        userEmail: posDetail.erkhetConfig?.userEmail || '',
        beginBillNumber: posDetail.beginNumber || '', 
        defaultPay: posDetail.erkhetConfig?.defaultPay || '',
        account: posDetail.erkhetConfig?.account || '',
        location: posDetail.erkhetConfig?.location || '',
      });
    }
  }, [posDetail, setFinanceConfig]);

  const handleSwitchChange = (
    field: keyof typeof financeConfig,
    value: boolean,
  ) => {
    if (isReadOnly) return;
    setFinanceConfig({
      ...financeConfig,
      [field]: value,
    });
  };

  const handleInputChange = (
    field: keyof typeof financeConfig,
    value: string,
  ) => {
    if (isReadOnly) return;
    setFinanceConfig({
      ...financeConfig,
      [field]: value,
    });
  };

  const handleSelectChange = (
    field: keyof typeof financeConfig,
    value: string,
  ) => {
    if (isReadOnly) return;
    setFinanceConfig({
      ...financeConfig,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(financeConfig);
      } catch (error) {
        console.error('Finance config form submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Finance config form submitted:', financeConfig);
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', 'delivery');
      setSearchParams(newParams);
    }
  };

  const getFormTitle = () => {
    if (isReadOnly) return 'View Finance Configuration';
    return posDetail ? 'Edit Finance Configuration' : 'Configure Finance Settings';
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {getFormTitle()}
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">MAIN</h2>

          <div className="flex flex-col gap-3">
            <span className="text-gray-600">IS SYNC ERKHET</span>
            <Switch
              className="scale-150 w-7"
              checked={financeConfig.isSyncErkhet}
              onCheckedChange={(checked) =>
                handleSwitchChange('isSyncErkhet', checked)
              }
              disabled={isReadOnly}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">REMAINDER</h2>

          <div className="flex flex-col gap-3">
            <span className="text-gray-600">CHECK ERKHET</span>
            <Switch
              className="scale-150 w-7"
              checked={financeConfig.checkErkhet}
              onCheckedChange={(checked) =>
                handleSwitchChange('checkErkhet', checked)
              }
              disabled={isReadOnly}
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-gray-600">CHECK INVENTORIES</span>
            <Switch
              className="scale-150 w-7"
              checked={financeConfig.checkInventories}
              onCheckedChange={(checked) =>
                handleSwitchChange('checkInventories', checked)
              }
              disabled={isReadOnly}
            />
          </div>
        </div>
        
        {financeConfig.isSyncErkhet && (
          <div className="space-y-6">
            <h2 className="text-indigo-600 text-xl font-medium">OTHER</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">USER EMAIL</Label>
                <Input
                  type='email'
                  value={financeConfig.userEmail}
                  onChange={(e) =>
                    handleInputChange('userEmail', e.target.value)
                  }
                  placeholder="Enter email"
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">
                  BEGIN BILL NUMBER
                </Label>
                <Input
                  value={financeConfig.beginBillNumber}
                  onChange={(e) =>
                    handleInputChange('beginBillNumber', e.target.value)
                  }
                  placeholder="Enter bill number"
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">DEFAULTPAY</Label>
                <Select
                  value={financeConfig.defaultPay}
                  onValueChange={(value) =>
                    handleSelectChange('defaultPay', value)
                  }
                  disabled={isReadOnly}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select..." />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="option1">Option 1</Select.Item>
                    <Select.Item value="option2">Option 2</Select.Item>
                    <Select.Item value="option3">Option 3</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">ACCOUNT</Label>
                <Input
                  value={financeConfig.account}
                  onChange={(e) => handleInputChange('account', e.target.value)}
                  placeholder="Enter account"
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">LOCATION</Label>
                <Input
                  value={financeConfig.location}
                  onChange={(e) =>
                    handleInputChange('location', e.target.value)
                  }
                  placeholder="Enter location"
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {!isReadOnly && onSubmit && (
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : posDetail ? 'Update' : 'Save'}
          </button>
        </div>
      )}
    </form>
  );
}