'use client'

import HttpRequests from "@/app/core/helpers/HttpRequests"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useState } from "react"

export default function InstanciaConnect({instanceName}:{instanceName:string}){
    const [show, setShow]= useState<boolean>(false)
    const upConnect= async ()=>{
        const url:string=`/api/connectInstanceRoute`        
        
        function showQrcode(code:string){
            const container= document.getElementById('qrCode')            
            const imagem= document.createElement('img')
            imagem.src=code
            imagem.style.width= '100%'
            imagem.style.height= '100%'
            imagem.style.borderRadius= '5px'            

            container!.appendChild(imagem)

            setShow(true)
            setTimeout(()=>{
                setShow(false)
                container?.removeChild(imagem)
            }, 30000)

        }

        const execute= await HttpRequests.post({
            url,
            body:{
                instanceName,
            }
        })
        if(!execute.data){
            const {message}= execute
            toast('[ ERROR ] instancia', {description: message})
        }
        const{ base64 }= execute.data
        if(!base64) return
        showQrcode(base64)
    }


    return (
        <div>            
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="text-yellow-500" variant="outline">Reconectar</Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>
                        {
                            show && (
                                <p className="font-bold">Escaneie o Qrcode</p>
                            )
                        }
                    </DialogTitle>
                    
                    </DialogHeader>
                        <div className="grid gap-4 py-4">                            
                            <div id='qrCode'></div>
                        </div>
                    <DialogFooter>
                        {!show && (
                            <Button className="w-full" type="button" onClick={upConnect}>Gerar QrCode</Button>
                        )}
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        

        </div>
    )
}