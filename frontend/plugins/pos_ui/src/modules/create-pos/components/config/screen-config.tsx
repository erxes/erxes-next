'use client';
import { Button, Input, Label, Select, Switch } from 'erxes-ui';
import { useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { screenConfigSettingsAtom } from '../../states/posCategory';
import { useEffect, useState } from 'react';
import { IPosDetail, IScreenConfig } from '@/pos-detail.tsx/types/IPos';
import {
  KITCHEN_TYPE_OPTIONS,
  SHOW_TYPE_OPTIONS,
  WAITING_TYPE_OPTIONS,
} from '@/constants';

interface ScreenConfigFormProps {
  posDetail?: IPosDetail;
  isReadOnly?: boolean;
  onSubmit?: (data: IScreenConfig) => Promise<void>;
}

export default function ScreenConfigForm({
  posDetail,
  isReadOnly = false,
  onSubmit,
}: ScreenConfigFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [screenConfig, setScreenConfig] = useAtom(screenConfigSettingsAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (posDetail) {
      setScreenConfig({
        kitchenScreenEnabled: posDetail.kitchenScreen?.isActive ?? false,
        showTypes: posDetail.kitchenScreen?.showType || '',
        statusChange: posDetail.kitchenScreen?.type || '',
        watchingScreenEnabled: posDetail.waitingScreen?.isActive ?? false,
        changeType: posDetail.waitingScreen?.type || '',
        changeCount: posDetail.waitingScreen?.value?.toString() || '',
        contentUrl: posDetail.waitingScreen?.contentUrl || '',
        printEnabled: posDetail.kitchenScreen?.isPrint ?? false,
      });
    }
  }, [posDetail, setScreenConfig]);

  const handleSwitchChange = (
    field: keyof typeof screenConfig,
    value: boolean,
  ) => {
    if (isReadOnly) return;
    setScreenConfig({
      ...screenConfig,
      [field]: value,
    });
  };

  const handleInputChange = (
    field: keyof typeof screenConfig,
    value: string,
  ) => {
    if (isReadOnly) return;
    setScreenConfig({
      ...screenConfig,
      [field]: value,
    });
  };

  const handleSelectChange = (
    field: keyof typeof screenConfig,
    value: string,
  ) => {
    if (isReadOnly) return;
    setScreenConfig({
      ...screenConfig,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onSubmit) {
      try {
        setIsSubmitting(true);
        const transformedConfig: IScreenConfig = {
          isActive: screenConfig.kitchenScreenEnabled,
          type: screenConfig.statusChange,
          value: parseInt(screenConfig.changeCount) || 0,
          contentUrl: screenConfig.contentUrl,
          showType: screenConfig.showTypes,
          isPrint: screenConfig.printEnabled,
        };
        await onSubmit(transformedConfig);
      } catch (error) {
        console.error('Screen config form submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', 'ebarimt');
      setSearchParams(newParams);
    }
  };

  const getFormTitle = () => {
    if (isReadOnly) return 'View Screen Configuration';
    return posDetail
      ? 'Edit Screen Configuration'
      : 'Configure Screen Settings';
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {getFormTitle()}
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-[#4F46E5] text-base font-semibold">MAIN</h2>

          <div className="space-y-2">
            <div className="flex flex-col gap-3">
              <span className="text-gray-600 text-sm">KITCHEN SCREEN</span>
              <Switch
                className="scale-150 w-7"
                checked={screenConfig.kitchenScreenEnabled}
                onCheckedChange={(checked) =>
                  handleSwitchChange('kitchenScreenEnabled', checked)
                }
                disabled={isReadOnly}
              />
            </div>

            {screenConfig.kitchenScreenEnabled && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">SHOW TYPES</Label>
                  <Select
                    value={screenConfig.showTypes}
                    onValueChange={(value) =>
                      handleSelectChange('showTypes', value)
                    }
                    disabled={isReadOnly}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Select show type" />
                    </Select.Trigger>
                    <Select.Content>
                      {SHOW_TYPE_OPTIONS.map((option) => (
                        <Select.Item key={option.value} value={option.value}>
                          {option.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">
                    STATUS CHANGE/LEAVE/
                  </Label>
                  <Select
                    value={screenConfig.statusChange}
                    onValueChange={(value) =>
                      handleSelectChange('statusChange', value)
                    }
                    disabled={isReadOnly}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Select status change type" />
                    </Select.Trigger>
                    <Select.Content>
                      {KITCHEN_TYPE_OPTIONS.map((option) => (
                        <Select.Item key={option.value} value={option.value}>
                          {option.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-col gap-3">
              <span className="text-gray-600">WATCHING SCREEN</span>
              <Switch
                className="scale-150 w-7"
                checked={screenConfig.watchingScreenEnabled}
                onCheckedChange={(checked) =>
                  handleSwitchChange('watchingScreenEnabled', checked)
                }
                disabled={isReadOnly}
              />
            </div>

            {screenConfig.watchingScreenEnabled && (
              <div className="grid grid-cols-2 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">CHANGE TYPE</Label>
                  <Select
                    value={screenConfig.changeType}
                    onValueChange={(value) =>
                      handleSelectChange('changeType', value)
                    }
                    disabled={isReadOnly}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Select change type" />
                    </Select.Trigger>
                    <Select.Content>
                      {WAITING_TYPE_OPTIONS.map((option) => (
                        <Select.Item key={option.value} value={option.value}>
                          {option.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">CHANGE COUNT</Label>
                  <Input
                    type="number"
                    value={screenConfig.changeCount}
                    onChange={(e) =>
                      handleInputChange('changeCount', e.target.value)
                    }
                    placeholder="Enter count"
                    disabled={isReadOnly}
                    readOnly={isReadOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">CONTENT URL</Label>
                  <Input
                    type="url"
                    value={screenConfig.contentUrl}
                    onChange={(e) =>
                      handleInputChange('contentUrl', e.target.value)
                    }
                    placeholder="Enter URL"
                    disabled={isReadOnly}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-col gap-3">
              <span className="text-gray-600">PRINT</span>
              <Switch
                className="scale-150 w-7"
                checked={screenConfig.printEnabled}
                onCheckedChange={(checked) =>
                  handleSwitchChange('printEnabled', checked)
                }
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>
      </div>

      {!isReadOnly && onSubmit && (
        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="default"
            size="default"
          >
            {isSubmitting ? 'Saving...' : posDetail ? 'Update' : 'Save'}
          </Button>
        </div>
      )}
    </form>
  );
}
