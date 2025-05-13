"use client"
import { Button, Label, Select } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { deliveryConfigSettingsAtom } from "../../states/posCategory"
import { useAtom } from "jotai"

export default function DeliveryConfigForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [deliveryConfig, setDeliveryConfig] = useAtom(deliveryConfigSettingsAtom)

  const handleSelectChange = (field: keyof typeof deliveryConfig, value: string) => {
    setDeliveryConfig({
      ...deliveryConfig,
      [field]: value,
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log("Delivery config form submitted:", deliveryConfig)

    const newParams = new URLSearchParams(searchParams)
    newParams.set("tab", "sync")
    setSearchParams(newParams)
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">STAGE</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">BOARD</Label>
              <Select value={deliveryConfig.board} onValueChange={(value) => handleSelectChange("board", value)}>
                <Select.Trigger>
                  <Select.Value placeholder="Choose board" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="board1">Board 1</Select.Item>
                  <Select.Item value="board2">Board 2</Select.Item>
                  <Select.Item value="board3">Board 3</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">PIPELINE</Label>
              <Select value={deliveryConfig.pipeline} onValueChange={(value) => handleSelectChange("pipeline", value)}>
                <Select.Trigger>
                  <Select.Value placeholder="Choose pipeline" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="pipeline1">Pipeline 1</Select.Item>
                  <Select.Item value="pipeline2">Pipeline 2</Select.Item>
                  <Select.Item value="pipeline3">Pipeline 3</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">STAGE</Label>
              <Select value={deliveryConfig.stage} onValueChange={(value) => handleSelectChange("stage", value)}>
                <Select.Trigger>
                  <Select.Value placeholder="Choose stage" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="stage1">Stage 1</Select.Item>
                  <Select.Item value="stage2">Stage 2</Select.Item>
                  <Select.Item value="stage3">Stage 3</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">DEAL USER</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">WATCHED USERS</Label>
              <Select
                value={deliveryConfig.watchedUsers}
                onValueChange={(value) => handleSelectChange("watchedUsers", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Choose team member" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="user1">User 1</Select.Item>
                  <Select.Item value="user2">User 2</Select.Item>
                  <Select.Item value="user3">User 3</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">ASSIGNED USERS</Label>
              <Select
                value={deliveryConfig.assignedUsers}
                onValueChange={(value) => handleSelectChange("assignedUsers", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Choose team member" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="user1">User 1</Select.Item>
                  <Select.Item value="user2">User 2</Select.Item>
                  <Select.Item value="user3">User 3</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">DELIVERY PRODUCT</h2>

          <div className="space-y-2">
            <Select
              value={deliveryConfig.deliveryProduct}
              onValueChange={(value) => handleSelectChange("deliveryProduct", value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Choose delivery product" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="product1">Product 1</Select.Item>
                <Select.Item value="product2">Product 2</Select.Item>
                <Select.Item value="product3">Product 3</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>
      </div>
    </form>
  )
}
