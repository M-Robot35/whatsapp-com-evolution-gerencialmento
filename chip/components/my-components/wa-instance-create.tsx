'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loading from "./loading"
import { createInstanceUser } from "@/app/actions/evolutionAction"
import { useActionState } from "react"


export function WhatsappCriarInstancia() {
    const [instancia, setInstancia]=useState<string>('')
    const [error, setError]=useState<string>('')
    const [state, action, isPending]= useActionState(createInstanceUser, null)

    const route= useRouter()
   
    useEffect(()=>{
      if(!state) return
     
      if(state.success){
        const {instancename, hash}= state.data
        route.push(`/admin/instancias/${instancename}/${hash}`)
        return
      }

      setError(state.message)

      setTimeout(()=>{
        setError('')
        setInstancia('')
      },5000)

    },[state])
    
        
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Criar Instância</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Instância</DialogTitle>
            <DialogDescription>
              Crie uma instância para gerenciar seus Perfils
            </DialogDescription>
          </DialogHeader>

          {/* <form action={instanceCreate}> */}
          <form action={action}>
            <div className="grid gap-4 py-4">

              <div className="block">
                <Label htmlFor="instancia" className="text-right mb-2">
                    Nome da Instância
                </Label>
                <Input 
                    id="instancia" 
                    name="instancia"
                    className="col-span-3 mt-2" 
                    disabled={isPending}
                    value={instancia} 
                    onChange={(e)=>{setInstancia(e.target.value)}}
                />
                {error && (
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                )}
              </div>

              <div className="block">
                <Label htmlFor="integracao" className="text-right mb-2">
                    Integração
                </Label>
                <Input 
                    id="integracao" 
                    name='integracao'
                    className="col-span-3" 
                    value="WHATSAPP-BAILEYS"
                    disabled
                />                
              </div>
            </div>                            

            <DialogFooter>
              {isPending? 
                <Button className="mt-2" disabled={isPending}>{<Loading/>} Criar instância</Button>:
                <Button className="mt-2" type="submit">Criar instância</Button>               
              }
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
}