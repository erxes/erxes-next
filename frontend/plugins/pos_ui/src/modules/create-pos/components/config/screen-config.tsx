"use client"
import { Button, Input, Label, Select, Switch } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { useAtom } from "jotai"
import { screenConfigSettingsAtom } from "../../states/posCategory"
import { useEffect, useState } from "react"

interface ScreenConfigFormProps {
  posDetail?: any;
  isReadOnly?: boolean;
  onSubmit?: (data: any) => Promise<void>;
}

export default function ScreenConfigForm({ 
  posDetail, 
  isReadOnly = false, 
  onSubmit 
}: ScreenConfigFormProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [screenConfig, setScreenConfig] = useAtom(screenConfigSettingsAtom)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (posDetail) {
      setScreenConfig({
        kitchenScreenEnabled: posDetail.kitchenScreenEnabled ?? false,
        showTypes: posDetail.showTypes || '',
        statusChange: posDetail.statusChange || '',
        watchingScreenEnabled: posDetail.watchingScreenEnabled ?? false,
        changeType: posDetail.changeType || '',
        changeCount: posDetail.changeCount || '',
        contentUrl: posDetail.contentUrl || '',
        printEnabled: posDetail.printEnabled ?? false,
      })
    }
  }, [posDetail, setScreenConfig])

  const handleSwitchChange = (field: keyof typeof screenConfig, value: boolean) => {
    if (isReadOnly) return
    setScreenConfig({
      ...screenConfig,
      [field]: value,
    })
  }

  const handleInputChange = (field: keyof typeof screenConfig, value: string) => {
    if (isReadOnly) return
    setScreenConfig({
      ...screenConfig,
      [field]: value,
    })
  }

  const handleSelectChange = (field: keyof typeof screenConfig, value: string) => {
    if (isReadOnly) return
    setScreenConfig({
      ...screenConfig,
      [field]: value,
    })
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    
    if (onSubmit) {
      try {
        setIsSubmitting(true)
        await onSubmit(screenConfig)
      } catch (error) {
        console.error("Screen config form submission failed:", error)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      console.log("Screen config form submitted:", screenConfig)
      const newParams = new URLSearchParams(searchParams)
      newParams.set("tab", "ebarimt")
      setSearchParams(newParams)
    }
  }

  const getFormTitle = () => {
    if (isReadOnly) return 'View Screen Configuration';
    return posDetail ? 'Edit Screen Configuration' : 'Configure Screen Settings';
  }

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
                onCheckedChange={(checked) => handleSwitchChange("kitchenScreenEnabled", checked)}
                disabled={isReadOnly}
              />
            </div>

            {screenConfig.kitchenScreenEnabled && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">SHOW TYPES</Label>
                  <Select
                    value={screenConfig.showTypes}
                    onValueChange={(value) => handleSelectChange("showTypes", value)}
                    disabled={isReadOnly}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Defined orders only" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="defined">Defined orders only</Select.Item>
                      <Select.Item value="all">All orders</Select.Item>
                      <Select.Item value="custom">Custom</Select.Item>
                    </Select.Content>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">STATUS CHANGE/LEAVE/</Label>
                  <Select
                    value={screenConfig.statusChange}
                    onValueChange={(value) => handleSelectChange("statusChange", value)}
                    disabled={isReadOnly}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Choose status" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="pending">Pending</Select.Item>
                      <Select.Item value="processing">Processing</Select.Item>
                      <Select.Item value="completed">Completed</Select.Item>
                      <Select.Item value="cancelled">Cancelled</Select.Item>
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
                onCheckedChange={(checked) => handleSwitchChange("watchingScreenEnabled", checked)}
                disabled={isReadOnly}
              />
            </div>

            {screenConfig.watchingScreenEnabled && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">CHANGE TYPE</Label>
                  <Select
                    value={screenConfig.changeType}
                    onValueChange={(value) => handleSelectChange("changeType", value)}
                    disabled={isReadOnly}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Choose product category" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="category1">Category 1</Select.Item>
                      <Select.Item value="category2">Category 2</Select.Item>
                      <Select.Item value="category3">Category 3</Select.Item>
                    </Select.Content>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">CHANGE COUNT</Label>
                  <Input
                    value={screenConfig.changeCount}
                    onChange={(e) => handleInputChange("changeCount", e.target.value)}
                    placeholder="Write here"
                    disabled={isReadOnly}
                    readOnly={isReadOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">CONTENT URL</Label>
                  <Input
                    value={screenConfig.contentUrl}
                    onChange={(e) => handleInputChange("contentUrl", e.target.value)}
                    placeholder="Write here"
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
                onCheckedChange={(checked) => handleSwitchChange("printEnabled", checked)}
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? 'Saving...' : posDetail ? 'Update' : 'Save'}
          </Button>
        </div>
      )}
    </form>
  )
}