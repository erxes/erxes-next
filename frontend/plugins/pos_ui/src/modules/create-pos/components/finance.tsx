"use client"
import { Button, Input, Label, Select, Switch } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { useAtom } from "jotai"
import { financeConfigSettingsAtom } from "../states/posCategory"

export default function FinanceConfigForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [financeConfig, setFinanceConfig] = useAtom(financeConfigSettingsAtom)

  const handleSwitchChange = (field: keyof typeof financeConfig, value: boolean) => {
    setFinanceConfig({
      ...financeConfig,
      [field]: value,
    })
  }

  const handleInputChange = (field: keyof typeof financeConfig, value: string) => {
    setFinanceConfig({
      ...financeConfig,
      [field]: value,
    })
  }

  const handleSelectChange = (field: keyof typeof financeConfig, value: string) => {
    setFinanceConfig({
      ...financeConfig,
      [field]: value,
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log("Finance config form submitted:", financeConfig)

    const newParams = new URLSearchParams(searchParams)
    newParams.set("tab", "delivery")
    setSearchParams(newParams)
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">MAIN</h2>

          <div className="flex flex-col gap-3">
            <span className="text-gray-600">IS SYNC ERKHET</span>
            <Switch
              className="scale-150 w-7"
              checked={financeConfig.isSyncErkhet}
              onCheckedChange={(checked) => handleSwitchChange("isSyncErkhet", checked)}
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
              onCheckedChange={(checked) => handleSwitchChange("checkErkhet", checked)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-gray-600">CHECK INVENTORIES</span>
            <Switch
              className="scale-150 w-7"
              checked={financeConfig.checkInventories}
              onCheckedChange={(checked) => handleSwitchChange("checkInventories", checked)}
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
                  value={financeConfig.userEmail}
                  onChange={(e) => handleInputChange("userEmail", e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">BEGIN BILL NUMBER</Label>
                <Input
                  value={financeConfig.beginBillNumber}
                  onChange={(e) => handleInputChange("beginBillNumber", e.target.value)}
                  placeholder="Enter bill number"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">DEFAULTPAY</Label>
                <Select
                  value={financeConfig.defaultPay}
                  onValueChange={(value) => handleSelectChange("defaultPay", value)}
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
                  onChange={(e) => handleInputChange("account", e.target.value)}
                  placeholder="Enter account"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">LOCATION</Label>
                <Input
                  value={financeConfig.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter location"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-12 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const newParams = new URLSearchParams(searchParams)
            newParams.set("tab", "ebarimt")
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
