'use server'

import WhatsappMessage from "@/services/evolution/ev-evolution"
import { TypeGroupParticipants } from "@/services/evolution/evoluitonTypes/instances-type"
import HttpRequests from "../core/helpers/HttpRequests"
import { createInstanceAction } from "./instanceAction"


export default async function groupParticipants(instanceName:string, apikey:string, grupoId:string):Promise<TypeGroupParticipants|null>{
    const participantes= await WhatsappMessage
        .grupos
        .groupsBuscarParticipants(
            instanceName, 
            apikey,
            grupoId
    )
    if(!participantes) return null
    return participantes
}

// salva no json,  tirar essa para colocar no banco de dados
async function saveInstaceDatabase(hash:string, base64:string):Promise<boolean>{
    try{
        const url= `/api/save-json-instance`
        await HttpRequests.post({
            url,
            body: {
                hash,
                base64
            }
        })
        return true

    }catch(error){
        return false
    }
}

// tipo de retorno da instancia
function resposta(status:boolean, message:string,data:any=null){
    return {
        success: status,
        message,
        data
    }
}


// criar uma instancia na evolution
export async function createInstanceUser(_,formdata:FormData){
   try{
        if(!formdata) return resposta(false, 'Deve ter algum nome da instancia')
        
        const instanceNameGet= formdata.get('instancia') as string
        
        const instance= await WhatsappMessage.instancia.instancia_all()
        
        if(!instance) return resposta(false, 'Error ao buscar instancias')
        
        const criarInstancia= await WhatsappMessage.instancia.instancia_criar(instanceNameGet)
    
        if(!criarInstancia) return resposta(false, 'Error ao criar instancias')
        
        const {qrcode:{base64}, hash, instance:{status, instanceName}}= criarInstancia

        // salva os dados da instancia no banco de dados
        await createInstanceAction({
            saveInstancia: instanceName,
            saveHash: hash,
            saveQrCode64: base64,
            saveStatus: status            
        })
        
        saveInstaceDatabase(hash,base64)
        return resposta(true, 'Success ao Criar instancia', {instanceName, hash})

    }catch(error){
        return resposta(false, 'Error Server')
    }
}

