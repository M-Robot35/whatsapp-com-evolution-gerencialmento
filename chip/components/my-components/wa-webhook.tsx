'use client'

import { parametrosInstancia } from "./wa-group"
import WhatsappMessage from "@/services/evolution/ev-evolution"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Input } from "../ui/input"
import { Logs } from "@/app/core/system"
import { toast } from "sonner"
import { styleUp } from "@/app/core/constants/style"
import { evolutionEvents } from "@/services/evolution/evoluitonTypes/instances-type"

const {border}=styleUp


export default function InstanceWebhook(data: parametrosInstancia){
    const {apikey, instanceName }= data
    const [eventss, setEvents]= useState<string[]>([])
    const [webhookActive, setWebhookActive]= useState(false)
    const [byEvents, setByEvents]= useState(false)
    const [base64, setBase64]= useState(false)

    const [urll, setUrl]= useState<string>('')
    const [check, setCheck]= useState<boolean>(false)


    const webhookget= async ()=>{
        const execute= await WhatsappMessage.webhookGet(apikey, instanceName)
        if(!execute){
            Logs.error('InstanceWebhook', 'não tem instancias')
            return
        }
        
        const {enabled, events, webhookBase64, url, webhookByEvents} = execute
        setUrl(url)
        setEvents(events)
        setBase64(webhookBase64)
        setByEvents(webhookByEvents)
        setWebhookActive(enabled)        
    }

    const webhookEvents= (evento:string)=>{
        if(!eventss.includes(evento)){
            const x:string[]= [...eventss, evento]
            setEvents(x)
            return
        }        
        setEvents(eventss.filter(item => item != evento))
    }
    
    useEffect(()=>{ webhookget() }, [])

    const checkUrlWebhook= (frase:string)=>{
        if(frase == '') {
            setUrl('')
            return setCheck(false)
        }
        setUrl(frase.trim())        
    }

    const webhookSet= async ()=>{
        if(webhookActive && eventss.length == 0){
            toast('[ ERROR ] Webhook',{
                description:'Você deve ter ao menos 1 Evento Selecionado'
            })
            return
        }

        const execute= await WhatsappMessage.webhookUpdate(apikey, instanceName, {
            base64: base64,
            byEvents: byEvents,
            url: urll,
            enabled: webhookActive,
            events: eventss
        })

        if(!execute){
            toast('[ ERROR ] Webhook',{
                description:'Nada foi feito em  webhook UPDATE'
            })
            return
        }

        const {enabled, events, webhookBase64, url, webhookByEvents} = execute
        setUrl(url)
        setEvents(events)
        setBase64(webhookBase64)
        setByEvents(webhookByEvents)
        setWebhookActive(enabled)

        toast('[ SUCCESS ] Webhook',{
            description:'Webhooks atualizados com sucesso'
        })
    }

    return (
        <section>
            <div className=" mb-4 rounded-sm ">
                <div className="flex justify-between mb-2">
                    <Label className="text-green-500 font-bold mb-2">CONFIGURAÇÕES</Label>                   
                    <Button className="" onClick={webhookSet} disabled={check} variant={'outline'}>Salvar</Button>
                </div>
                <div className="flex mb-2 justify-between items-center border border-gray-700 p-2 rounded-sm">
                    <Label htmlFor='enabled'>WEBHOOK ACTIVE</Label>
                    <Switch
                        id='enabled'
                        checked={webhookActive}
                        onCheckedChange={() => setWebhookActive(!webhookActive)}
                        className={`${border}`}
                    />                    
                </div>

                <div className="flex mb-2 justify-between items-center border border-gray-700 p-2 rounded-sm">
                    <Label htmlFor='enabled'>BY EVENTS</Label>
                    <Switch
                        id='enabled'
                        disabled={!webhookActive}
                        checked={byEvents}
                        onCheckedChange={() => setByEvents(!byEvents)}
                        className={`${border}`}
                    />                    
                </div>

                <div className="flex mb-2 justify-between items-center border border-gray-700 p-2 rounded-sm">
                    <Label htmlFor='enabled'>BASE64</Label>
                    <Switch
                        id='enabled'
                        disabled={!webhookActive}
                        checked={base64}
                        onCheckedChange={() => setBase64(!base64)}
                        className={`${border}`}
                    />                    
                </div>

                <div className="mt-2">
                    <div  className="flex justify-between  items-center border border-gray-700 p-2 rounded-sm">
                        <Label htmlFor=''>WEBHOOK URL</Label>
                        <Input 
                        className={`border ${ check? 'border-red-600':'border-gray-950'} w-[70%]`}
                        disabled={!webhookActive}
                        value={urll} 
                        onChange={(e)=>{checkUrlWebhook(e.target.value)}}
                        type="text" 
                        placeholder="https://exemplo.com"
                    />                  
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
            <div className="flex justify-between mb-2">
                <Label className="text-green-500 font-bold text">EVENTOS DISPÓNIVEIS</Label>                  
            </div>
            
            {
                evolutionEvents.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border border-gray-700 p-2 rounded-sm">
                        <Label htmlFor={item.evento} title={item.descricao}>{item.evento}</Label>
                        <Switch
                            id={item.evento}
                            disabled={!webhookActive}
                            checked={eventss.includes(item.evento)}
                            onCheckedChange={() => webhookEvents(item.evento)}
                            title={item.descricao}
                            className={`${border}`}
                        />                    
                    </div>
                ))                
            }
            <div className="">
                <Button className="" onClick={webhookSet} disabled={check} variant={'outline'}>Salvar</Button>
            </div>
        </div>
            
        </section>
    )
}

