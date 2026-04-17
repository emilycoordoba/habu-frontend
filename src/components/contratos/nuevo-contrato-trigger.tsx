"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { IniciarContratoSheet } from "./iniciar-contrato-sheet"

export function NuevoContratoTrigger() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-4" />
        Nuevo contrato
      </Button>
      <IniciarContratoSheet open={open} onOpenChange={setOpen} />
    </>
  )
}
