"use client"

import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { Button, Input, Label, Select } from "erxes-ui"
import { useSearchParams } from "react-router-dom"

export default function EcommerceForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brands: "",
    types: [],
    brunch1: "",
    department1: "",
    brunch2: "",
    department2: "",
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
            <p className="text-sm text-gray-500">Which specific Brand does this integration belongs to?</p>
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
        <div className="space-y-2">
          <div className="flex items-center">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">SLOTS</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="ml-2 h-6 w-6 p-0 rounded-md bg-indigo-500 hover:bg-indigo-600"
            >
              <IconPlus size={16} className="text-white" />
              <span className="sr-only">Add slot</span>
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">TYPE</Label>
          <p className="text-sm text-gray-500">How use types ?</p>
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-300 rounded">
                <Select>
                  <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                    <Select.Value placeholder="" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="type1">Type 1</Select.Item>
                    <Select.Item value="type2">Type 2</Select.Item>
                    <Select.Item value="type3">Type 3</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            ))}
          </div>
        </div>


        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">CHOOSE BRUNCH</Label>
            <div className="border border-gray-300 rounded">
              <Select onValueChange={(value) => handleSelectChange("brunch1", value)}>
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

          <div className="space-y-1">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">CHOOSE DEPARTMENT</Label>
            <div className="border border-gray-300 rounded">
              <Select onValueChange={(value) => handleSelectChange("department1", value)}>
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Choose department" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="dept1">Department 1</Select.Item>
                  <Select.Item value="dept2">Department 2</Select.Item>
                  <Select.Item value="dept3">Department 3</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">CHOOSE BRUNCH</Label>
            <div className="border border-gray-300 rounded">
              <Select onValueChange={(value) => handleSelectChange("brunch2", value)}>
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

          <div className="space-y-1">
            <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">CHOOSE DEPARTMENT</Label>
            <div className="border border-gray-300 rounded">
              <Select onValueChange={(value) => handleSelectChange("department2", value)}>
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Choose department" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="dept1">Department 1</Select.Item>
                  <Select.Item value="dept2">Department 2</Select.Item>
                  <Select.Item value="dept3">Department 3</Select.Item>
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
        <Button type="submit" onClick={() => {
            const newParams = new URLSearchParams(searchParams)
            newParams.set("tab", "properties")
            setSearchParams(newParams)
          }}>
          Next step
        </Button>
      </div>
    </form>
  )
}
