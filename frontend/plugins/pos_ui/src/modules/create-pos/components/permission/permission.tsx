"use client"
import { Input, Label, Select, Switch } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { useAtom } from "jotai"
import { cashierSettingsAtom, permissionSettingsAtom } from "../../states/posCategory"

export default function PermissionForm() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [permissions, setPermissions] = useAtom(permissionSettingsAtom)
    const [cashierPermission, setCashierPermission] = useAtom(cashierSettingsAtom)

  const handleSwitchChange = (field: keyof typeof permissions, value: boolean) => {
    setPermissions({
      ...permissions,
      [field]: value,
    })

  }

  const handleInputChange = (field: keyof typeof permissions, value: string) => {
    setPermissions({
      ...permissions,
      [field]: value,
    })
  }

  const handleSelectChange = (field: keyof typeof permissions, value: string) => {
    setPermissions({
      ...permissions,
      [field]: value,
    })
  }

  const handleCashierSwitchChange = (field: keyof typeof cashierPermission, value: boolean) => {
    setCashierPermission({
      ...cashierPermission,
      [field]: value,
    })
  }

  const handleCashierInputChange = (field: keyof typeof cashierPermission, value: string) => {
    setCashierPermission({
      ...cashierPermission,
      [field]: value,
    })
  }

  const handleCashierSelectChange = (field: keyof typeof cashierPermission, value: string) => {
    setCashierPermission({
      ...cashierPermission,
      [field]: value,
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    newParams.set("tab", "product")
    setSearchParams(newParams)
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <h2 className="text-[#4F46E5] text-lg font-semibold">ADMINS</h2>
            <p className="text-[#A1A1AA] text-xs font-semibold">POS ADMIN</p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">Select payments that you want to use</p>
            <div>
              <Select
                value={permissions.adminTeamMember}
                onValueChange={(value) => handleSelectChange("adminTeamMember", value)}
              >
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Choose team member" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="admin1">Admin 1</Select.Item>
                  <Select.Item value="admin2">Admin 2</Select.Item>
                  <Select.Item value="admin3">Admin 3</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex gap-4 flex-col">
              <span className="text-[#71717A] text-sm font-medium uppercase">IS PRINT TEMP BILL</span>
              <Switch
                className="scale-150 w-7"
                checked={permissions.adminPrintTempBill}
                onCheckedChange={(checked) => handleSwitchChange("adminPrintTempBill", checked)}
              />
            </div>
            <div className="flex gap-4 flex-col">
              <span className="text-[#71717A] text-sm font-medium uppercase">DIRECT SALES</span>
              <Switch
                className="scale-150 w-7"
                checked={permissions.adminDirectSales}
                onCheckedChange={(checked) => handleSwitchChange("adminDirectSales", checked)}
              />
            </div>
          </div>
          {permissions.adminDirectSales && (
            <div className="space-y-2">
              <Label className="text-gray-500 text-sm">DIRECT DISCOUNT LIMIT</Label>
              <Input
                value={permissions.adminDirectDiscountLimit}
                onChange={(e) => handleInputChange("adminDirectDiscountLimit", e.target.value)}
                placeholder="Write here"
                className=" h-10"
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
            <p className="text-gray-600">Choose cashier that you want to use</p>
            <div>
              <Select
                value={cashierPermission.cashierTeamMember}
                onValueChange={(value) => handleCashierSelectChange("cashierTeamMember", value)}
              >
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Choose team member" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="cashier1">Cashier 1</Select.Item>
                  <Select.Item value="cashier2">Cashier 2</Select.Item>
                  <Select.Item value="cashier3">Cashier 3</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex gap-4 flex-col">
              <span className="text-[#71717A] text-sm font-medium uppercase">IS PRINT TEMP BILL</span>
              <Switch
                className="scale-150 w-7"
                checked={permissions.adminPrintTempBill}
                onCheckedChange={(checked) => handleSwitchChange("adminPrintTempBill", checked)}
              />
            </div>
            <div className="flex gap-4 flex-col">
              <span className="text-[#71717A] text-sm font-medium uppercase">DIRECT SALES</span>
              <Switch
                className="scale-150 w-7"
                checked={cashierPermission.cashierDirectSales}
                onCheckedChange={(checked) => handleCashierSwitchChange("cashierDirectSales", checked)}
              />
            </div>
          </div>

          {cashierPermission.cashierDirectSales && (
            <div className="space-y-2">
              <Label className="text-gray-500 text-sm">DIRECT DISCOUNT LIMIT</Label>
              <Input
                value={cashierPermission.cashierDirectDiscountLimit}
                onChange={(e) => handleCashierInputChange("cashierDirectDiscountLimit", e.target.value)}
                placeholder="Write here"
                className=" h-10"
              />
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
