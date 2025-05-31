"use client"

import { Button, Input } from "erxes-ui"
import { Upload } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { IconUpload } from "@tabler/icons-react"
import { useState } from "react"

export default function AppearanceForm() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [formData, setFormData] = useState({
    logoImage: "",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    accentColor: "#6366F1",
    fontFamily: "Inter",
    showLogo: true,
  })

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log("Appearance form submitted:", formData)

    const newParams = new URLSearchParams(searchParams)
    newParams.set("tab", "screen")
    setSearchParams(newParams)
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">Logo and favicon</h2>
          <p className="text-[#A1A1AA] text-xs font-semibold uppercase">Main logo</p>
          <div className="mb-5">
            <label className="block mb-2 font-medium text-[#71717A]">Image can be shown on the top of the post also</label>
            <Upload.Root value={formData.logoImage} onChange={(value) => handleInputChange("logoImage", typeof value === 'string' ? value : '')} className="h-[128px]">
              <Upload.Preview className="hidden" />
              <Upload.Button
                size="sm"
                variant="secondary"
                type="button"
                className="w-full h-[128px] flex flex-col items-center justify-center border border-dashed border-muted-foreground text-muted-foreground"
              >
                <div className="flex flex-col gap-3 justify-center">
                <div className="flex justify-center">
                 <IconUpload />
                </div>
                    <Button>Upload</Button>
                    <span className="font-medium text-sm">Upload Image</span>
                </div>
              </Upload.Button>
            </Upload.Root>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">Main colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[#A1A1AA] text-xs font-semibold">Primary</label>
              <div className="flex items-center">
                <Input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                  className="w-10 h-10 p-1 mr-2"
                />
                <Input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#A1A1AA] text-xs font-semibold">Secondary</label>
              <div className="flex items-center">
                <Input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => handleInputChange("textColor", e.target.value)}
                  className="w-10 h-10 p-1 mr-2"
                />
                <Input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => handleInputChange("textColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#A1A1AA] text-xs font-semibold">Third</label>
              <div className="flex items-center">
                <Input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => handleInputChange("accentColor", e.target.value)}
                  className="w-10 h-10 p-1 mr-2"
                />
                <Input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => handleInputChange("accentColor", e.target.value)}
                  className="flex-1"
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
            newParams.set("tab", "product")
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
