'use client'
import { useState, useEffect } from "react"
import WhatsappMessage from "@/services/evolution/ev-evolution"
import Loading from "./loading"
import TableGroup from "./wa-table-group"
import { Logs } from "@/app/core/system"
import { TypeGroupOutput } from "@/services/evolution/evoluitonTypes/instances-type"
import { toast } from "sonner"


export interface parametrosInstancia {
    apikey:string
    instanceName: string
}


export default function InstanceGroup({apikey, instanceName}: parametrosInstancia){   
    const [grupo, setGrupo]= useState<TypeGroupOutput[]>([])
    const [loading, setLoading]= useState(false)
    
    const grupos= async ()=>{
        setLoading(true)
        try{
            const execute= await WhatsappMessage.grupos.groupsAll(instanceName, apikey)
            
            if(!execute){
                Logs.error('InstanceGroup', `Error ao  encontrar Grupos `)
                toast('Groups', {description: 'Você não tem grupos'})
                return
            }
            setGrupo(execute)
        }catch(error){
            Logs.error('InstanceGroup', `Error ao  encontrar Grupos ${JSON.stringify(error)}`)
            toast('[ERROR] Groups', {description: 'Tente novamente mais tarde'})

        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{ grupos() },[])

    return (
        <div className="">
            <div className="flex flex-col gap-4">
                {
                    (grupo && grupo.length > 0) ? (
                        <div className="">
                            <TableGroup apikeyy={apikey} instanceNamee={instanceName} grupos={grupo}/>
                        </div>
                    ):(
                        loading? <Loading/>: 
                        (
                            <div className="flex justify-center">
                                Você ainda não tem Grupos
                            </div>
                        )
                    )
                }
            </div>                     
        </div>
    )
}