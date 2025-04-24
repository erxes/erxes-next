"use client"

import { IconCashRegister, IconPlus, IconSettings } from "@tabler/icons-react"
import { Button, PluginHeader } from "erxes-ui"
import { Link, useSearchParams } from "react-router-dom"
import { useAtom } from "jotai"
import { renderingPosDetailAtom } from "~/modules/create-pos/states/renderingPosDetailAtom"
import { PosDetail } from "~/modules/create-pos/components/pos-create"
import { PosList } from "~/modules/create-pos/components/general"
import { PosRecordTable } from "~/modules/components/PosRecordTable"

export const PosIndexPage = () => {
  const [, setSearchParams] = useSearchParams()
  const [, setRenderingPosDetail] = useAtom(renderingPosDetailAtom)

  const onCreatePos = () => {
    setRenderingPosDetail(true)
    setSearchParams({ create: 'true' })
  }

  return (
    <div className="flex flex-col h-full">
      <PluginHeader title="Point of Sale" icon={IconCashRegister} className="p-3 mx-0" separatorClassName="mb-0">
        <Button variant="outline" asChild>
          <Link to="/settings/pos">
            <IconSettings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>

        <Button onClick={onCreatePos}>
          <IconPlus className="mr-2 h-4 w-4" />
          Create POS
        </Button>
      </PluginHeader>
      <PosRecordTable />

     <PosDetail/>
    </div>
  )
}

export default PosIndexPage
