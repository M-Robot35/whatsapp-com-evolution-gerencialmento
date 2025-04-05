'use client'
import { useState, useEffect } from "react"
import Loading from "./loading"


export interface parametrosInstancia {
    apikey:string
    instanceName: string
}


export default function InstanceProfile({apikey, instanceName}: parametrosInstancia){   
    //const [grupo, setGrupo]= useState([])
    const [loading, setLoading]= useState(false)
    
    const grupos= async ()=>{
        setLoading(true)
        //const execute= await WhatsappMessage.grupos.groupsAll(instanceName, apikey)
        //setGrupo(execute)
        setLoading(false)
    }

    useEffect(()=>{ grupos() },[])

    return (
        <div className="">
            {loading && (<Loading/>)}
            <h1>-------------FAZER O PROFILE -------------</h1>
                             
        </div>
    )
}



