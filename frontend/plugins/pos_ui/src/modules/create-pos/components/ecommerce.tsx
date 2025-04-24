"use client"

import { useState } from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { Button, Input, Label, Select } from "erxes-ui"
import { useSearchParams } from "react-router-dom"

export default function RestaurantForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brands: "",
    posDomain: "",
    beginNumber: "",
    brunch: "",
    allowBranches: "",
  })

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    newParams.set("tab", "payments")
    setSearchParams(newParams)
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="space-y-6">
        <div className="space-y-1">
          <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
            NAME <span className="text-red-500">*</span>
          </Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Write here"
            className="border border-gray-300 h-10"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1 flex flex-col gap-1">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">DESCRIPTION</Label>
            <p className="text-sm font-medium text-[#71717A]">What is description ?</p>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 h-10"
            />
          </div>
          <div className="space-y-1 flex flex-col gap-1">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">BRANDS</Label>
            <p className="text-sm font-medium text-[#71717A]">Which specific Brand does this integration belongs to?</p>
            <div className="border border-gray-300">
              <Select onValueChange={(value) => handleSelectChange("brands", value)}>
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Choose brands" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="brand1">Brand 1</Select.Item>
                  <Select.Item value="brand2">Brand 2</Select.Item>
                  <Select.Item value="brand3">Brand 3</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
              POS DOMAIN <span className="text-red-500">*</span>
            </Label>
            <Input
              name="posDomain"
              value={formData.posDomain}
              onChange={handleChange}
              placeholder="Write here"
              className="border border-gray-300 h-10"
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
              BEGIN NUMBER <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                name="beginNumber"
                value={formData.beginNumber}
                onChange={handleChange}
                placeholder="Write here"
                className="border border-gray-300 h-10 pr-10"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <IconChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1 flex flex-col gap-1">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">CHOOSE BRUNCH</Label>
            <p className="text-sm font-medium text-[#71717A]">If the pos has real,goods,select the brunch</p>
            <div className="border border-gray-300">
              <Select onValueChange={(value) => handleSelectChange("brunch", value)}>
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Choose brunch" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="brunch1">Brunch 1</Select.Item>
                  <Select.Item value="brunch2">Brunch 2</Select.Item>
                  <Select.Item value="brunch3">Brunch 3</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
          <div className="space-y-1 flex flex-col gap-1">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">ALLOW BRANCHES</Label>
            <p className="text-sm font-medium text-[#71717A]">Select the potential branches for sales rom this pos</p>
            <div className="border border-gray-300">
              <Select onValueChange={(value) => handleSelectChange("allowBranches", value)}>
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Chooose brunch" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="branch1">Branch 1</Select.Item>
                  <Select.Item value="branch2">Branch 2</Select.Item>
                  <Select.Item value="branch3">Branch 3</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-12 pt-6 border-t">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Next step
        </Button>
      </div>
    </form>
  )
}