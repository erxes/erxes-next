"use client"
import { Button, Input, Select, Checkbox, Label } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { useAtom } from "jotai"
import { IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import { ProductGroup, productServiceSettingsAtom } from "../../states/posCategory"

export default function ProductServiceForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [productSettings, setProductSettings] = useAtom(productServiceSettingsAtom)
  const [showProductGroups, setShowProductGroups] = useState(false)
  const [showMappings, setShowMappings] = useState(false)

  const [productGroups, setProductGroups] = useState<ProductGroup[]>([
    {
      name: "",
      description: "",
      productCategory: "",
      excludeProductCategory: "",
      excludeProducts: "",
    },
  ])

  const [mappings, setMappings] = useState([
    {
      sourceProduct: "",
      targetCategory: "",
    },
  ])

  const handleToggleProductGroups = () => {
    setShowProductGroups(!showProductGroups)
  }

  const handleToggleMappings = () => {
    setShowMappings(!showMappings)
  }

  const handleAddGroup = () => {
    setProductGroups([
      ...productGroups,
      {
        name: "",
        description: "",
        productCategory: "",
        excludeProductCategory: "",
        excludeProducts: "",
      },
    ])
  }

  const handleAddMapping = () => {
    setMappings([
      ...mappings,
      {
        sourceProduct: "",
        targetCategory: "",
      },
    ])
  }

  const handleGroupChange = (index: number, field: keyof ProductGroup, value: string) => {
    const updatedGroups = [...productGroups]
    updatedGroups[index] = {
      ...updatedGroups[index],
      [field]: value,
    }
    setProductGroups(updatedGroups)
  }

  const handleMappingChange = (index: number, field: string, value: string) => {
    const updatedMappings = [...mappings]
    updatedMappings[index] = {
      ...updatedMappings[index],
      [field]: value,
    }
    setMappings(updatedMappings)
  }

  const handleSettingChange = <K extends keyof typeof productSettings>(
    field: K,
    value: (typeof productSettings)[K],
  ) => {
    setProductSettings({
      ...productSettings,
      [field]: value,
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setProductSettings({
      ...productSettings,
      productGroups: productGroups,
    })

    console.log("Product & Service form submitted:", {
      ...productSettings,
      productGroups,
      mappings,
    })

    const newParams = new URLSearchParams(searchParams)
    newParams.set("tab", "appearance")
    setSearchParams(newParams)
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">PRODUCT GROUPS</h2>

          <Button
            onClick={handleToggleProductGroups}
            className="hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            <IconPlus size={16} />
            Add group
          </Button>

          {showProductGroups && (
            <div className="space-y-4">
              {productGroups.map((group, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">GROUP NAME</Label>
                    <Input
                      value={group.name}
                      onChange={(e) => handleGroupChange(index, "name", e.target.value)}
                      placeholder="Write here"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">GROUP DESCRIPTION</Label>
                    <Select
                      value={group.description}
                      onValueChange={(value) => handleGroupChange(index, "description", value)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Kiosk" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="kiosk">Kiosk</Select.Item>
                        <Select.Item value="pos">POS</Select.Item>
                        <Select.Item value="mobile">Mobile</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>
                  <div className="flex w-full justify-between gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">PRODUCT CATEGORY</Label>
                    <Select
                      value={group.productCategory}
                      onValueChange={(value) => handleGroupChange(index, "productCategory", value)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Choose product category" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="food">Food</Select.Item>
                        <Select.Item value="beverage">Beverage</Select.Item>
                        <Select.Item value="merchandise">Merchandise</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">EXCLUDE PRODUCT CATEGORY</Label>
                    <Select
                      value={group.excludeProductCategory}
                      onValueChange={(value) => handleGroupChange(index, "excludeProductCategory", value)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Choose module category" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="category1">Category 1</Select.Item>
                        <Select.Item value="category2">Category 2</Select.Item>
                        <Select.Item value="category3">Category 3</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">EXCLUDE PRODUCTS</Label>
                    <Select
                      value={group.excludeProducts}
                      onValueChange={(value) => handleGroupChange(index, "excludeProducts", value)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Choose module category" />
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
              ))}

              <div className="flex justify-end mt-4">
                <Button>Save</Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">INITIAL PRODUCT CATEGORIES</h2>
          <div className="space-y-2">
            <Label className="text-sm text-gray-500">PRODUCT CATEGORY</Label>
            <Select
              value={productSettings.initialProductCategory}
              onValueChange={(value) => handleSettingChange("initialProductCategory", value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Choose product catergory" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="category1">Category 1</Select.Item>
                <Select.Item value="category2">Category 2</Select.Item>
                <Select.Item value="category3">Category 3</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">KIOSK EXCLUDE PRODUCTS</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">CATEGORIES</Label>
              <Select
                value={productSettings.kioskExcludeCategories}
                onValueChange={(value) => handleSettingChange("kioskExcludeCategories", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="kiosk">Kiosk</Select.Item>
                  <Select.Item value="pos">POS</Select.Item>
                  <Select.Item value="mobile">Mobile</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">PRODUCTS</Label>
              <Select
                value={productSettings.kioskExcludeProducts}
                onValueChange={(value) => handleSettingChange("kioskExcludeProducts", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
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

        <div className="space-y-4">
          <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">PRODUCT & CATEGORY MAPPING</h2>
          <p className="text-sm text-gray-500">
            MAP A PRODUCT TO CATEGORY.WHEN A PRODUCT WHITHIN THAT CATEGORY IS SOLD IN POS SYSTEM WITH TAKE OPTION,THEN
            THE MAPPED PRODUCT WILL BE ADDED TO TE PRICE
          </p>

          <Button
            onClick={handleToggleMappings}
            className=" hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            <IconPlus size={16} />
            Mapping
          </Button>

          {showMappings && (
            <div className="space-y-4 p-4 mt-4">
              {mappings.map((mapping, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">SOURCE PRODUCT</Label>
                    <Select
                      value={mapping.sourceProduct}
                      onValueChange={(value) => handleMappingChange(index, "sourceProduct", value)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Choose product" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="product1">Product 1</Select.Item>
                        <Select.Item value="product2">Product 2</Select.Item>
                        <Select.Item value="product3">Product 3</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">TARGET CATEGORY</Label>
                    <Select
                      value={mapping.targetCategory}
                      onValueChange={(value) => handleMappingChange(index, "targetCategory", value)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Choose category" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="category1">Category 1</Select.Item>
                        <Select.Item value="category2">Category 2</Select.Item>
                        <Select.Item value="category3">Category 3</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-4">
                <Button type="button" onClick={handleAddMapping} className="bg-green-600 hover:bg-green-700 text-white">
                  <IconPlus size={16} className="mr-1" />
                  Add Another Mapping
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">REMAINDER CONFIGS</h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={productSettings.remainderConfigEnabled}
              onCheckedChange={(checked) => handleSettingChange("remainderConfigEnabled", Boolean(checked))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">EXCLUDE CATEGORIES</Label>
              <Select
                value={productSettings.excludeCategories}
                onValueChange={(value) => handleSettingChange("excludeCategories", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Kiosk" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="category1">Category 1</Select.Item>
                  <Select.Item value="category2">Category 2</Select.Item>
                  <Select.Item value="category3">Category 3</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">BAN FRACTIONS</Label>
              <div className="flex items-center h-10">
                <Checkbox
                  checked={productSettings.banFractions}
                  onCheckedChange={(checked) => handleSettingChange("banFractions", Boolean(checked))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
