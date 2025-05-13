"use client"

import type React from "react"

import { IconLayoutSidebarLeftCollapse, IconList, IconMaximize, IconMinimize } from "@tabler/icons-react"
import { Button, cn, Sheet, Tooltip } from "erxes-ui"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAtom } from "jotai"
import { renderingPosDetailAtom } from "~/modules/create-pos/states/renderingPosDetailAtom"
import { isFullscreenAtom, sidebarViewAtom } from "~/modules/slot/states/slot"
import { posCategoryAtom } from "../../states/posCategory"

export const PosDetailSheet = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [renderingPosDetail, setRenderingPosDetail] = useAtom(renderingPosDetailAtom)
  const isOpen = searchParams.get("create") === "true"
  const [posCategory] = useAtom(posCategoryAtom)
  const [sidebarView, setSidebarView] = useAtom(sidebarViewAtom)
  const [isFullscreen, setIsFullscreen] = useAtom(isFullscreenAtom)
  const tab = searchParams.get("tab")

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleClose = () => {
    setSearchParams({})
    setRenderingPosDetail(false)
    navigate("/pos")
  }

  const handleToggleSidebar = () => {
    setRenderingPosDetail(!renderingPosDetail)
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <Sheet.Content
        className={cn(
          "p-0 md:max-w-screen-2xl flex flex-col gap-0 transition-all duration-100 ease-out overflow-hidden flex-none",
          renderingPosDetail ? "md:w-[calc(100vw-theme(spacing.4))]" : "md:w-[600px]",
        )}
      >
        <Sheet.Header className="border-b p-3 flex-row items-center space-y-0 gap-3">
          <Button variant="ghost" size="icon" onClick={handleToggleSidebar}>
            <IconLayoutSidebarLeftCollapse />
          </Button>
          <Sheet.Title>Create POS /{posCategory}/</Sheet.Title>
          {tab === "slot" && (
            <>
              <Tooltip.Provider>
                <Tooltip>
                  <Tooltip.Trigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSidebarView(sidebarView === "hidden" ? "list" : "hidden")}
                    >
                      <IconList className="h-4 w-4" />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>Toggle Sidebar (Ctrl+B)</p>
                  </Tooltip.Content>
                </Tooltip>
              </Tooltip.Provider>
              <Tooltip.Provider>
                <Tooltip>
                  <Tooltip.Trigger asChild>
                    <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                      {isFullscreen ? <IconMinimize className="h-4 w-4" /> : <IconMaximize className="h-4 w-4" />}
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>Toggle Fullscreen</p>
                  </Tooltip.Content>
                </Tooltip>
              </Tooltip.Provider>
            </>
          )}
          <Sheet.Close />
          <Sheet.Description className="sr-only text-foreground">Create POS</Sheet.Description>
        </Sheet.Header>
        {children}
      </Sheet.Content>
    </Sheet>
  )
}
