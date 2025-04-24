"use client"
import { Button, Input, Label, Select, Switch } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { useAtom } from "jotai"
import { screenConfigSettingsAtom } from "../states/posCategory"

export default function ScreenConfigForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [screenConfig, setScreenConfig] = useAtom(screenConfigSettingsAtom)

  const handleSwitchChange = (field: keyof typeof screenConfig, value: boolean) => {
    setScreenConfig({
      ...screenConfig,
      [field]: value,
    })
  }

  const handleInputChange = (field: keyof typeof screenConfig, value: string) => {
    setScreenConfig({
      ...screenConfig,
      [field]: value,
    })
  }

  const handleSelectChange = (field: keyof typeof screenConfig, value: string) => {
    setScreenConfig({
      ...screenConfig,
      [field]: value,
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log("Screen config form submitted:", screenConfig)

    const newParams = new URLSearchParams(searchParams)
    newParams.set("tab", "ebarimt")
    setSearchParams(newParams)
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
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
              />
            </div>

            {screenConfig.kitchenScreenEnabled && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">SHOW TYPES</Label>
                  <Select
                    value={screenConfig.showTypes}
                    onValueChange={(value) => handleSelectChange("showTypes", value)}
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
              />
            </div>

            {screenConfig.watchingScreenEnabled && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">CHANGE TYPE</Label>
                  <Select
                    value={screenConfig.changeType}
                    onValueChange={(value) => handleSelectChange("changeType", value)}
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
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">CONTENT URL</Label>
                  <Input
                    value={screenConfig.contentUrl}
                    onChange={(e) => handleInputChange("contentUrl", e.target.value)}
                    placeholder="Write here"
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
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-12 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const newParams = new URLSearchParams(searchParams)
            newParams.set("tab", "appearance")
            setSearchParams(newParams)
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Next step</Button>
      </div>
    </form>
  )
}
