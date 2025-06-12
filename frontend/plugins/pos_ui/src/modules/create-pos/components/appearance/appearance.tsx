"use client"

import { Button, Input } from "erxes-ui"
import { Upload } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { IconUpload } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { UiConfigFormValues } from "../formSchema"
import { IPosDetail } from "~/modules/pos-detail.tsx/types/IPos"

interface AppearanceFormProps {
  posDetail?: IPosDetail;
  isReadOnly?: boolean;
  onSubmit?: (data: UiConfigFormValues) => Promise<void>;
}

export default function AppearanceForm({ 
  posDetail, 
  isReadOnly = false, 
  onSubmit 
}: AppearanceFormProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    logoImage: "",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    accentColor: "#6366F1",
    fontFamily: "Inter",
    showLogo: true,
  })

  useEffect(() => {
    if (posDetail?.uiOptions) {
      setFormData({
        logoImage: posDetail.uiOptions.logoImage || "",
        backgroundColor: posDetail.uiOptions.backgroundColor || "#FFFFFF",
        textColor: posDetail.uiOptions.textColor || "#000000",
        accentColor: posDetail.uiOptions.accentColor || "#6366F1",
        fontFamily: posDetail.uiOptions.fontFamily || "Inter",
        showLogo: posDetail.uiOptions.showLogo ?? true,
      })
    }
  }, [posDetail])

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    if (isReadOnly) return
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    
    if (onSubmit) {
      try {
        await onSubmit({
          uiOptions: {
            colors: {
              bodyColor: formData.backgroundColor,
              headerColor: formData.accentColor,
              footerColor: formData.textColor,
            },
            logo: formData.logoImage,
            bgImage: '',
            favIcon: '',
            receiptIcon: '',
            kioskHeaderImage: '',
            mobileAppImage: '',
            qrCodeImage: '',
          },
          beginNumber: '',
          maxSkipNumber: 0,
          checkRemainder: false,
        })
      } catch (error) {
        console.error("Appearance form submission failed:", error)
      }
    } else {
      console.log("Appearance form submitted:", formData)
      const newParams = new URLSearchParams(searchParams)
      newParams.set("tab", "screen")
      setSearchParams(newParams)
    }
  }

  const getFormTitle = () => {
    if (isReadOnly) return 'View Appearance Settings';
    return posDetail ? 'Edit Appearance Settings' : 'Configure Appearance Settings';
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {getFormTitle()}
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">Logo and favicon</h2>
          <p className="text-[#A1A1AA] text-xs font-semibold uppercase">Main logo</p>
          <div className="mb-5">
            <label className="block mb-2 font-medium text-[#71717A]">Image can be shown on the top of the post also</label>
            <Upload.Root 
              value={formData.logoImage} 
              onChange={(value) => handleInputChange("logoImage", typeof value === 'string' ? value : '')} 
              className="h-[128px]"
            >
              <Upload.Preview className="hidden" />
              <Upload.Button
                size="sm"
                variant="secondary"
                type="button"
                className="w-full h-[128px] flex flex-col items-center justify-center border border-dashed border-muted-foreground text-muted-foreground"
                disabled={isReadOnly}
              >
                <div className="flex flex-col gap-3 justify-center">
                <div className="flex justify-center">
                 <IconUpload />
                </div>
                    <Button disabled={isReadOnly}>Upload</Button>
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
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
                />
                <Input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                  className="flex-1"
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
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
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
                />
                <Input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => handleInputChange("textColor", e.target.value)}
                  className="flex-1"
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
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
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
                />
                <Input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => handleInputChange("accentColor", e.target.value)}
                  className="flex-1"
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {!isReadOnly && (
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
      )}
    </form>
  )
}