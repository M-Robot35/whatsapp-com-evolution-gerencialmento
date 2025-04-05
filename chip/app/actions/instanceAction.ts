'use server'

import WhatsappMessage from "@/services/evolution/ev-evolution"
import instanciaModel from "@/database/db-model/instancia-model"
import { IEvolutionInstance } from "@/services/evolution/evoluitonTypes/instances-type"
import { getServerAction } from "./getSectionAction"
import { Instancia } from "@prisma/client"
import { Logs } from "../core/system"


type updateOptions= {
    userId: string;
    instanciaName: string;
    statusConnection: string;
    numero: string;
}


type instancesOutput= {
    id: string;
    userId: string;
    instanciaName: string;
    statusConnection: string;
    numero: string;
    hash: string;
    baseCode: string;
}


type instanceSaveCreate={
    saveInstancia:string
    saveQrCode64:string
    saveHash:string
    saveStatus: string
    numero?: string
}


export async function createInstanceAction(data:instanceSaveCreate){
    const { saveHash, saveInstancia, saveQrCode64, saveStatus, numero }= data
    try{
        const us= await getServerAction()

        await instanciaModel.create({
            instanciaName: saveInstancia,
            numero: numero?? '',
            statusConnection: saveStatus??'pending',
            userId: us!.id,
            baseCode: saveQrCode64,
            hash: saveHash
            
        })
    }catch(e){
        Logs.error('createInstanceAction', `não foi possivel criar instancia ${e}`)        
    }
}

export async function buscaInstanceAction(instancia:string):Promise<Instancia | null>{
    try{             
        return await instanciaModel.findByInstanceName(instancia)

    }catch(e){
        Logs.error('buscaInstanceAction', `não foi possivel deletar instancia ${e}`)
        return null
    }
}


export async function deleteInstanceAction(instancia:string){
    try{
        const us= await getServerAction()        
        await instanciaModel.delete(us!.id, instancia)

    }catch(e){
        Logs.error('deleteInstanceAction', `não foi possivel deletar instancia ${e}`)
    }
}


export async function updateInstanceAction(instancia:string, options:updateOptions){
    try{
        const us= await getServerAction()
        await instanciaModel.update(us!.id, instancia, options)

    }catch(e){
        Logs.error('updateInstanceAction', `não foi possivel atualizar instancia ${e}`)
    }
}


export async function userInstanceAction():Promise<instancesOutput[]>{
    try{
        const us= await getServerAction()
        return await instanciaModel.findAllUser(us!.id)

    }catch(e){
        Logs.error('userInstanceAction', `não foi possivel buscar instancia ${e}`)
        return []
    }
}

export async function getInstanceNameAction(apikey:string):Promise<IEvolutionInstance | null>{
    try{
        const todasInstancias:IEvolutionInstance[] = await WhatsappMessage.instancia.instancia_all();
        const instancia:IEvolutionInstance = todasInstancias.find(inst => inst.token == apikey) as IEvolutionInstance;
        if (!instancia) {
          return null;
        }
        return instancia

    }catch(e){
        Logs.error('getInstanceNameAction', `não foi possivel buscar instancia ${e}`)
        return null
    }
}

export async function getInstaceDatabase(instaceName:string):Promise<Instancia | null>{
    try{
        const instancia = await instanciaModel.findByInstanceName(instaceName)  
        return instancia
    }catch(e){
        Logs.error('getInstaceDatabase', `não foi possivel buscar instancia ${e}`)
        return null
    }
}

export async function setInstanceStatusConnection(instanciaName:string, statusConnection:string):Promise<string | null>{
    try{
        const instancia = await instanciaModel.findByInstanceName(instanciaName)
        if(!instancia){
            Logs.error('setInstanceStatusConnection', `instancia não encontrada ${instanciaName}`)
            return null
        }
        await instanciaModel.update(instancia.userId, instancia.instanciaName, {
            statusConnection: statusConnection
        })
        return instancia?.statusConnection
    }catch(e){
        Logs.error('getInstanceStatusConnection', `não foi possivel buscar instancia ${e}`)
        return null
    }
}
