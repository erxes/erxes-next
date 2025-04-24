"use client"
import { Button, Input, Select, Checkbox, Label } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { useAtom } from "jotai"
import { ebarimtConfigSettingsAtom } from "../states/posCategory"

export default function EbarimtConfigForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [ebarimtConfig, setEbarimtConfig] = useAtom(ebarimtConfigSettingsAtom)

  const handleCheckboxChange = (field: keyof typeof ebarimtConfig, checked: boolean) => {
    setEbarimtConfig({
      ...ebarimtConfig,
      [field]: checked,
    })
  }

  const handleInputChange = (field: keyof typeof ebarimtConfig, value: string) => {
    setEbarimtConfig({
      ...ebarimtConfig,
      [field]: value,
    })
  }

  const handleSelectChange = (field: keyof typeof ebarimtConfig, value: string) => {
    setEbarimtConfig({
      ...ebarimtConfig,
      [field]: value,
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log("Ebarimt config form submitted:", ebarimtConfig)

    const newParams = new URLSearchParams(searchParams)
    newParams.set("tab", "finance")
    setSearchParams(newParams)
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">MAIN</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">COMPANY NAME</Label>
              <Select
                value={ebarimtConfig.companyName}
                onValueChange={(value) => handleSelectChange("companyName", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Kiosk">Kiosk</Select.Item>
                  <Select.Item value="Restaurant">Restaurant</Select.Item>
                  <Select.Item value="Retail">Retail</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">EBARIMT URL</Label>
              <Select
                value={ebarimtConfig.ebarimtUrl}
                onValueChange={(value) => handleSelectChange("ebarimtUrl", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Kiosk">Kiosk</Select.Item>
                  <Select.Item value="Custom">Custom</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">CHECK TAXPAYER URL</Label>
              <Select
                value={ebarimtConfig.checkTaxpayerUrl}
                onValueChange={(value) => handleSelectChange("checkTaxpayerUrl", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Kiosk">Kiosk</Select.Item>
                  <Select.Item value="Custom">Custom</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">OTHER</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">COMPANYRD</Label>
              <Select value={ebarimtConfig.companyRd} onValueChange={(value) => handleSelectChange("companyRd", value)}>
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Kiosk">Kiosk</Select.Item>
                  <Select.Item value="Custom">Custom</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">MERCHANTIN</Label>
              <Select
                value={ebarimtConfig.merchantin}
                onValueChange={(value) => handleSelectChange("merchantin", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Kiosk">Kiosk</Select.Item>
                  <Select.Item value="Custom">Custom</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">POSNO</Label>
              <Select value={ebarimtConfig.posno} onValueChange={(value) => handleSelectChange("posno", value)}>
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Kiosk">Kiosk</Select.Item>
                  <Select.Item value="Custom">Custom</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">DISTRICTCODE</Label>
              <Select
                value={ebarimtConfig.districtCode}
                onValueChange={(value) => handleSelectChange("districtCode", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Kiosk">Kiosk</Select.Item>
                  <Select.Item value="Custom">Custom</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">BRANCHNO</Label>
              <Select value={ebarimtConfig.branchNo} onValueChange={(value) => handleSelectChange("branchNo", value)}>
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Kiosk">Kiosk</Select.Item>
                  <Select.Item value="Custom">Custom</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">DEFAULTGSCODE</Label>
              <Select
                value={ebarimtConfig.defaultGsCode}
                onValueChange={(value) => handleSelectChange("defaultGsCode", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Kiosk">Kiosk</Select.Item>
                  <Select.Item value="Custom">Custom</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">VAT</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">HAS VAT</Label>
              <div className="h-10 flex items-center">
                <Checkbox
                  checked={ebarimtConfig.hasVat}
                  onCheckedChange={(checked) => handleCheckboxChange("hasVat", Boolean(checked))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">VAT PERCENT</Label>
              <Input
                value={ebarimtConfig.vatPercent}
                onChange={(e) => handleInputChange("vatPercent", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">UB CITY TAX</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">HAS UB CITY TAX</Label>
              <div className="h-10 flex items-center">
                <Checkbox
                  checked={ebarimtConfig.hasUbCityTax}
                  onCheckedChange={(checked) => handleCheckboxChange("hasUbCityTax", Boolean(checked))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">UB CITY TAX PERCENT</Label>
              <Input
                value={ebarimtConfig.ubCityTaxPercent}
                onChange={(e) => handleInputChange("ubCityTaxPercent", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-500">ANOTHER RULE OF PRODUCTS ON CITY TAX</Label>
            <Input
              value={ebarimtConfig.anotherRuleOfProductsOnCityTax}
              onChange={(e) => handleInputChange("anotherRuleOfProductsOnCityTax", e.target.value)}
              placeholder="reserveCtaxRules"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">UI CONFIG</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">HEADER TEXT</Label>
              <Input
                value={ebarimtConfig.headerText}
                onChange={(e) => handleInputChange("headerText", e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">FOOTER TEXT</Label>
              <Input
                value={ebarimtConfig.footerText}
                onChange={(e) => handleInputChange("footerText", e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">HAS COPY</Label>
              <div className="h-10 flex items-center">
                <Checkbox
                  checked={ebarimtConfig.hasCopy}
                  onCheckedChange={(checked) => handleCheckboxChange("hasCopy", Boolean(checked))}
                />
              </div>
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
            newParams.set("tab", "screen")
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
