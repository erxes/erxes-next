"use client"

import { useState, useEffect } from "react"
import { Button, Label, Select, Input } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { useAtom } from "jotai"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { paymentMethodsAtom } from "../../states/posCategory"
import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PaymentFormValues, paymentSchema } from "../formSchema"
import { PosDetailQueryResponse } from "~/modules/pos-detail.tsx/types/detail"

interface PaymentMethod {
  _id?: string 
  type: string
  title: string
  icon: string
  config: string 
}

interface RestaurantPaymentsFormProps {
  posDetail?: PosDetailQueryResponse['posDetail'];
  form?: UseFormReturn<PaymentFormValues>
  onFormSubmit?: (data: PaymentFormValues) => void
}

export default function RestaurantPaymentsForm({ 
  posDetail,
  form: externalForm,
  onFormSubmit
}: RestaurantPaymentsFormProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [paymentMethods, setPaymentMethods] = useAtom(paymentMethodsAtom)
  const [appToken, setAppToken] = useState("")

  const internalForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentIds: [],
      paymentTypes: [],
    },
  })

  const form = externalForm || internalForm

  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>({
    type: "",
    title: "",
    icon: "",
    config: "",
  })

  useEffect(() => {
    if (posDetail) {
      const paymentTypesData = posDetail.paymentTypes || []
      
      form.reset({
        paymentIds: posDetail.paymentIds || [],
        paymentTypes: paymentTypesData.map((type: string) => ({ type, title: '', icon: '', config: '', _id: '' })),
      })
      setPaymentMethods(paymentTypesData.map((type: string) => ({ type, title: '', icon: '', config: '', _id: '' })))
      setAppToken(posDetail.erxesAppToken || "")
    }
  }, [posDetail, form])

  const handleInputChange = (field: keyof PaymentMethod, value: string) => {
    setNewPaymentMethod({
      ...newPaymentMethod,
      [field]: value,
    })
  }

  const generateId = () => Math.random().toString()

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.type || !newPaymentMethod.title) {
      alert('Please fill in both type and title fields')
      return
    }

    const paymentType: PaymentMethod = {
      _id: generateId(),
      type: newPaymentMethod.type,
      title: newPaymentMethod.title,
      icon: newPaymentMethod.icon,
      config: newPaymentMethod.config, 
    }

    const updatedPaymentMethods = [...paymentMethods, paymentType]
    setPaymentMethods(updatedPaymentMethods)
    
    form.setValue('paymentTypes', updatedPaymentMethods)

    if (onFormSubmit) {
      onFormSubmit({
        paymentIds: form.getValues('paymentIds'),
        paymentTypes: updatedPaymentMethods
      })
    }

    setNewPaymentMethod({
      type: "",
      title: "",
      icon: "",
      config: "",
    })
  }

  const handleRemovePaymentMethod = (index: number) => {
    const updatedMethods = [...paymentMethods]
    updatedMethods.splice(index, 1)
    setPaymentMethods(updatedMethods)
    
    form.setValue('paymentTypes', updatedMethods)

    if (onFormSubmit) {
      onFormSubmit({
        paymentIds: form.getValues('paymentIds'),
        paymentTypes: updatedMethods
      })
    }
  }

  const handlePaymentIdsChange = (selectedIds: string[]) => {
    form.setValue('paymentIds', selectedIds)
    
    if (onFormSubmit) {
      onFormSubmit({
        paymentIds: selectedIds,
        paymentTypes: form.getValues('paymentTypes')
      })
    }
  }

  const displayConfig = (config: string): string => {
    return config || ''
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    
    const formData: PaymentFormValues = {
      paymentIds: form.getValues('paymentIds'),
      paymentTypes: paymentMethods
    }
    
    if (onFormSubmit) {
      onFormSubmit(formData)
    }
    
    const newParams = new URLSearchParams(searchParams)
    newParams.set("tab", "permission")
    setSearchParams(newParams)
  }

  const { formState: { errors } } = form

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="space-y-6">
        <div className="space-y-1">
          <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">PAYMENTS</Label>
          <p className="text-sm text-gray-500">Select payments that you want to use</p>
          <div>
            <Select>
              <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                <Select.Value placeholder="Choose payments" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="cash">Cash</Select.Item>
                <Select.Item value="card">Card</Select.Item>
                <Select.Item value="mobile">Mobile Payment</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>
        
        <div className="space-y-1">
          <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">ERXES APP TOKEN</Label>
          <Input
            value={appToken}
            onChange={(e) => setAppToken(e.target.value)}
            className="h-10"
            placeholder="Enter your Erxes app token"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-indigo-600 font-medium uppercase">OTHER PAYMENTS</Label>
          <p className="text-sm text-gray-500">
            Type is must latin, some default types: golomtCard, khaanCard, TDBCard
            <br />
            Хэрэв тухайн талбэрт ебаримт хавлагүй бол: "skipEbarimt: true", Харилцагч сонгосон үед л харагдах бол:
            "mustCustomer: true", Харав хуваах боломжгүй бол: "notSplit: true" Үрэдчилж төлсөн төлбөрөөр
            <br />
            (Татвар тооцсон) бол: "preTax: true
          </p>
        </div>

        <div className="">
          <div className="p-4 flex justify-end">
            <Button
              type="button"
              onClick={handleAddPaymentMethod}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
              <IconPlus size={16} />
              Add payments method
            </Button>
          </div>
          
          {paymentMethods.map((method: PaymentMethod, index: number) => (
            <div key={method._id || index} className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-2">
              <div>
                <Label className="text-xs text-gray-500">Type</Label>
                <div className="font-medium">{method.type}</div>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Title</Label>
                <div className="font-medium">{method.title}</div>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Icon</Label>
                <div className="font-medium">{method.icon}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs text-gray-500">Config</Label>
                  <div className="font-medium text-sm">{displayConfig(method.config)}</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePaymentMethod(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <IconTrash size={16} />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Type *</Label>
              <Input
                value={newPaymentMethod.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="h-10"
                placeholder="e.g. golomtCard, khaanCard, TDBCard"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Title *</Label>
              <Input
                value={newPaymentMethod.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="h-10"
                placeholder="e.g. Visa, Mastercard"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Icon</Label>
              <Select 
                value={newPaymentMethod.icon} 
                onValueChange={(value: string) => handleInputChange("icon", value)}
              >
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Select icon" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="credit-card">Credit Card</Select.Item>
                  <Select.Item value="cash">Cash</Select.Item>
                  <Select.Item value="bank">Bank</Select.Item>
                  <Select.Item value="mobile">Mobile</Select.Item>
                  <Select.Item value="visa">Visa</Select.Item>
                  <Select.Item value="mastercard">Mastercard</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Config</Label>
              <Input
                value={newPaymentMethod.config}
                onChange={(e) => handleInputChange("config", e.target.value)}
                className="h-10"
                placeholder="e.g. skipEbarimt: true, mustCustomer: true"
              />
            </div>
          </div>
        </div>

        {errors.paymentTypes && (
          <div className="text-red-500 text-sm">
            {errors.paymentTypes.message}
          </div>
        )}
      </div>
    </form>
  )
}