"use client"

import type React from "react"
import { Stepper, Resizable} from "erxes-ui"
import { useSearchParams } from "react-router-dom"
import { PosDetailSheet } from "./posDetailSheet"
import { CheckIcon } from "lucide-react"
import { useAtom } from "jotai"
import { posCategoryAtom } from "../states/posCategory"

export const PosDetailLayout = ({
  children,
  actions,
}: {
  children: React.ReactNode
  actions?: React.ReactNode
}) => {
  return (
    <PosDetailSheet>
      <div className="flex h-auto flex-auto overflow-auto">
        <div className="flex flex-col flex-auto min-h-full overflow-hidden">
          <Resizable.PanelGroup direction="horizontal" className="flex-auto min-h-full overflow-hidden">
            <Resizable.Panel defaultSize={75} minSize={30}>
              <PosCreateStepper>{children}</PosCreateStepper>
            </Resizable.Panel>

            {actions && (
              <>
                <Resizable.Handle />
                <Resizable.Panel defaultSize={25} minSize={20}>
                  {actions}
                </Resizable.Panel>
              </>
            )}
          </Resizable.PanelGroup>
        </div>
      </div>
    </PosDetailSheet>
  )
}

const PosCreateStepper = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posCategory] = useAtom(posCategoryAtom)
  const selectedStep = searchParams.get("tab") || "overview"
  const steps = [
    { id: 1, value: "overview", title: "Choose category" },
    { id: 2, value: "properties", title: "General information" },
    { id: 3, value: "payments", title: "Payments" },
    { id: 4, value: "permission", title: "Permission" },
    { id: 5, value: "product", title: "Product & Service" },
    { id: 6, value: "appearance", title: "Appearance" },
    { id: 7, value: "screen", title: "Screen config" },
    { id: 8, value: "ebarimt", title: "Ebarimt config" },
    { id: 9, value: "finance", title: "Finance config" },
    { id: 10, value: "delivery", title: "Delivery config" },
    { id: 11, value: "sync", title: "Sync card" },
  ]
  const currentStep = steps.find((step) => step.value === selectedStep)?.id || 1
  const storedCategory = localStorage.getItem("posCategory")
  const hasCategorySelected = !!posCategory || !!storedCategory

  const handleStepChange = (step: number) => {
    const targetTab = steps.find((s) => s.id === step)?.value || "overview"
    
    // Only allow navigation to other tabs if a category is selected or if navigating to overview tab
    if (hasCategorySelected || targetTab === "overview") {
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.set("tab", targetTab)
      setSearchParams(newSearchParams)
    } else {
      alert("Please select a category first before proceeding to the next step.")
    }
  }

  return (
    <div className="flex h-full ">
    <div className="w-44 border-r bg-gray-50 p-5 overflow-y-auto">
      <Stepper value={currentStep} onValueChange={handleStepChange} orientation="vertical" className="w-full">
        {steps.map((step) => (
          <Stepper.Item
            key={step.id}
            step={step.id}
            completed={currentStep > step.id}
            className="relative mb-12 last:mb-0"
          >
            <Stepper.Trigger 
              className={`flex items-center gap-4 w-full text-left ${!hasCategorySelected && step.value !== "overview" ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!hasCategorySelected && step.value !== "overview"}
            >
              <Stepper.Indicator
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-sm font-medium"
                style={{ height: "36px", width: "36px" }}
              >
                {currentStep > step.id ? <CheckIcon className="h-5 w-5" /> : step.id}
              </Stepper.Indicator>
              <span className="text-base font-medium">{step.title}</span>
            </Stepper.Trigger>
            {step.id < steps.length && (
              <Stepper.Separator
                className="absolute left-[18px] top-[36px] h-8 -translate-x-1/2"
                style={{ left: "18px", top: "36px" }}
              />
            )}
          </Stepper.Item>
        ))}
      </Stepper>
    </div>
    <div className="flex-1 overflow-auto p-6">{children}</div>
  </div>
  )
}

export const PosCreateTabContent = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: string
}) => {
  const [searchParams] = useSearchParams()
  const [posCategory] = useAtom(posCategoryAtom)
  const selectedStep = searchParams.get("tab") || "overview"
  const storedCategory = localStorage.getItem("posCategory")
  const hasCategorySelected = !!posCategory || !!storedCategory
  
  // Don't render content for non-overview tabs if no category is selected
  if (value !== selectedStep) {
    return null
  }
  
  if (value !== "overview" && !hasCategorySelected) {
    return (
      <div className="flex-auto overflow-hidden flex items-center justify-center h-full">
        <div className="text-center p-8 rounded-lg bg-yellow-50 border border-yellow-200">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Category Selection Required</h3>
          <p className="text-yellow-700">Please select a category first before accessing this section.</p>
        </div>
      </div>
    )
  }

  return <div className="flex-auto overflow-hidden">{children}</div>
}
