"use client"

import { useState } from "react"
import { Button, Input, Label, Select } from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { useAtom } from "jotai"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { paymentMethodsAtom } from "../../states/posCategory"

export default function EcommercePaymentsForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [paymentMethods, setPaymentMethods] = useAtom(paymentMethodsAtom)
  const [appToken, setAppToken] = useState("")

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "",
    title: "",
    icon: "",
    config: "",
  })

  const handleSelectChange = (field: string, value: string) => {
    setNewPaymentMethod({
      ...newPaymentMethod,
      [field]: value,
    })
  }

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.type && newPaymentMethod.title) {
      setPaymentMethods([...paymentMethods, { ...newPaymentMethod }])
      setNewPaymentMethod({
        type: "",
        title: "",
        icon: "",
        config: "",
      })
    }
  }

  const handleRemovePaymentMethod = (index: number) => {
    const updatedMethods = [...paymentMethods]
    updatedMethods.splice(index, 1)
    setPaymentMethods(updatedMethods)
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    newParams.set("tab", "permission")
    setSearchParams(newParams)
  }

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
          {paymentMethods.map((method, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-4">
              <div>{method.type}</div>
              <div>{method.title}</div>
              <div>{method.icon}</div>
              <div className="flex items-center justify-between">
                <span>{method.config}</span>
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
          <div className="grid grid-cols-4 gap-4 p-4">
            <div>
              <Select onValueChange={(value) => handleSelectChange("type", value)}>
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Select type" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="golomtCard">golomtCard</Select.Item>
                  <Select.Item value="khaanCard">khaanCard</Select.Item>
                  <Select.Item value="TDBCard">TDBCard</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <Select onValueChange={(value) => handleSelectChange("title", value)}>
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Select title" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Visa">Visa</Select.Item>
                  <Select.Item value="Mastercard">Mastercard</Select.Item>
                  <Select.Item value="American Express">American Express</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <Select onValueChange={(value) => handleSelectChange("icon", value)}>
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Select icon" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="credit-card">Credit Card</Select.Item>
                  <Select.Item value="cash">Cash</Select.Item>
                  <Select.Item value="bank">Bank</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <Select onValueChange={(value) => handleSelectChange("config", value)}>
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Select config" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="skipEbarimt: true">skipEbarimt: true</Select.Item>
                  <Select.Item value="mustCustomer: true">mustCustomer: true</Select.Item>
                  <Select.Item value="notSplit: true">notSplit: true</Select.Item>
                  <Select.Item value="preTax: true">preTax: true</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
