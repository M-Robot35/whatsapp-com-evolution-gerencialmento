import { Instancia } from "@prisma/client"
import { prismaConnect } from "../db-connect"
import { Logs } from "@/app/core/system"

type outputType= Instancia

export type inputType= {
    createdAt: Date;
    updatedAt: Date;
    id: string;
    userId: string;
    instanciaName: string;
    statusConnection: string;
    numero: string;
    hash: string;
    baseCode: string;
}

export type InstanciaCreateType= Omit<inputType, 'createdAt'|'updatedAt'|'id'>


class InstanceModel {
    private database;

    constructor(){
        this.database= prismaConnect.instancia
    }

    async create(data:InstanciaCreateType): Promise<outputType|null> { 
        const {userId, instanciaName} = data

        const buscando= await this.database.findFirst({
            where: { userId, instanciaName }
        })

        if( buscando ){
            Logs.error('database create', `A instância [ ${data} ] já existe`)
            return null
        }        

        const execute= await this.database.create({
            data:{...data}
        })
        return execute
    }

    async findById(id:string): Promise<outputType|null>
    {   
        const execute= await this.database.findFirst({
            where: {
                id,                
            }
        })
        return execute
    }

    async findByInstanceName(instanciaName:string): Promise<outputType|null>
    {
        try{
            const execute= await this.database.findFirst({
                where: {instanciaName }
            })
            if( !execute ){
                Logs.error('database findByInstanceName', `o Email [ ${instanciaName} ] Não existe`)
                return null
            }
            return execute
        }catch(error){
            Logs.error('database findByInstanceName', `Erro ao buscar a instância [ ${instanciaName} ]`)
            return null
        }
    }

    async findAll(): Promise<outputType[]>
    {
        const execute= await this.database.findMany({ })
        return execute
    }

    async findAllUser(usuarioId:string): Promise<outputType[]>
    {   
        const execute= await this.database.findMany({
            where: {
                userId: usuarioId
            }
        })
        return execute
    }

    async update( userId:string, instanceName:string, data:Partial<outputType>): Promise<outputType>
    {   
        const us= await this.findByInstanceName(instanceName)
        const execute= await this.database.update({
            where: {
                id: us!.id,
                userId,
                instanciaName:instanceName               
            },
            data
        })
        return execute
    }

    async delete(userId:string, instanceName:string): Promise<outputType|null>
    {   
        const busca= await this.findByInstanceName(instanceName)
        const execute= await this.database.delete({
            where: {
                id:busca!.id,
                userId,
                instanciaName: instanceName
            }
        })
        return execute
    }    
}

export default new InstanceModel()