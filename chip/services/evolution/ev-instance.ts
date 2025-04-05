import HttpRequests from "@/app/core/helpers/HttpRequests";
import { Logs } from "@/app/core/system";
import { 
    IEvolutionInstance, 
    InstanciaRestartType,
    InstanceCreateEvolution 
} from "./evoluitonTypes/instances-type";
import EvolutionManage from "./ev-menage";
import { eventsEvolution, respondeEvento } from "./ev-eventos/evolutionEventos";
type interfaceOptionEnum = "WHATSAPP-BAILEYS" | "WHATSAPP-BAILEYS" | "WHATSAPP-BUSINESS" | "EVOLUTION"


interface InstanceOptions {
    qrcode: boolean
    integration: interfaceOptionEnum
}

export default class EvInstancia {

    constructor(private data:EvolutionManage){ }

    async instancia_criar( instanceName:string, options?:InstanceOptions): Promise<InstanceCreateEvolution | null>{
        if(!instanceName){
            eventsEvolution.emit('INSTANCIA_CRIAR', respondeEvento(false, 'Não foi passado o parametro  InstanceName', null) )
            return null
        }
        const url=`${this.data.urlCompleta}/instance/create`

        const body= {
            instanceName,
            qrcode: true,
            integration: "WHATSAPP-BAILEYS"
        }

        if(options?.integration){
            body.instanceName = body.integration
        }

        if(options?.qrcode){
            body.qrcode = body.qrcode
        }
        try{
            const execute= await HttpRequests.post({
                url,
                headers: {
                    apikey: this.data.publicKey
                },
                body
            })

            const response= await execute
            eventsEvolution.emit('INSTANCIA_CRIAR', respondeEvento<InstanceCreateEvolution>(true, 'Instância criada com sucesso', { instanceName, ...response}) )
            return response
        }catch(error){
            eventsEvolution.emit('INSTANCIA_CRIAR', respondeEvento(false, 'Erro ao criar instância', error) )
            return null
        }
    }

    async instancia_all(): Promise<IEvolutionInstance[]>{        
        const url=`${this.data.urlCompleta}/instance/fetchInstances`

        try{
            const execute= await HttpRequests.get({
                url,
                headers: {
                    apikey: this.data.publicKey
                },
            })
    
            const response= await execute
            eventsEvolution.emit('INSTANCIA_ALL', respondeEvento<IEvolutionInstance[]>(true, 'Instâncias obtidas com sucesso', response) )
            Logs.success('instancia_all',response)
            return response
        }catch(error){
            eventsEvolution.emit('INSTANCIA_ALL', respondeEvento(false, 'Erro ao obter instâncias', error) )
            return null
        }
    }

    async instancia_connect(instanceName:string, numero:string){
        if(!instanceName){
            Logs.error('instancia_connect', 'Não foi passado o parametro  instance')
            return
        }
        const url=`${this.data.urlCompleta}/instance/connect/${instanceName}?number=${numero}`

        try{
            const execute= await HttpRequests.get({
            url,
            headers: {
                apikey: this.data.publicKey
            },
        })

            const response= await execute
            eventsEvolution.emit('INSTANCIA_CONNECT', respondeEvento(true, 'Instância conectada com sucesso', { instanceName, numero, ...response}) )
            return response
        }catch(error){
            eventsEvolution.emit('INSTANCIA_CONNECT', respondeEvento(false, 'Erro ao conectar instância', error) )
            return null
        }
    }

    async instancia_status_connection(instance:string){
        if(!instance){
            eventsEvolution.emit('INSTANCIA_STATUS_CONNECTION', respondeEvento(false, 'Não foi passado o parametro  instance', null) )
            return null
        }
        const url=`${this.data.urlCompleta}/instance/connectionState/${instance}`

        try{
            const execute= await HttpRequests.get({
                url,
                headers: {
                    apikey: this.data.publicKey
                },
            })
    
            const response= await execute
            eventsEvolution.emit('INSTANCIA_STATUS_CONNECTION', respondeEvento(true, 'Status da instância obtido com sucesso', {instance, ...response}) )
            return response
        }catch(error){
            eventsEvolution.emit('INSTANCIA_STATUS_CONNECTION', respondeEvento(false, 'Erro ao obter status da instância', error) )
            return null
        }
    }

    async instancia_delete(instance:string){
        if(!instance){
            Logs.error('instancia_delete', 'Não foi passado o parametro  instance')
            eventsEvolution.emit('INSTANCIA_DELETE', respondeEvento(false, 'Não foi passado o parametro  instance', null) )
            return null
        }

        try{
            const url=`${this.data.urlCompleta}/instance/delete/${instance}`
            const execute= await HttpRequests.request({
            method: 'DELETE',            
            url,
            headers: {
                apikey: this.data.publicKey
            },
            })
            const response= await execute
            eventsEvolution.emit('INSTANCIA_DELETE', respondeEvento(true, 'Instância deletada com sucesso', {instance, ...response}) )
            return response
        }catch(error){
            eventsEvolution.emit('INSTANCIA_DELETE', respondeEvento(false, 'Erro ao deletar instância', error) )
            return null
        }
    }

    async instancia_logout(instance:string){
        if(!instance){
            Logs.error('instancia_logout', 'Não foi passado o parametro  instance')
            eventsEvolution.emit('INSTANCIA_LOGOUT', respondeEvento(false, 'Não foi passado o parametro  instance', null) )
            return null
        }
        
        try{
            const url=`${this.data.urlCompleta}/instance/logout/${instance}`

        const execute= await HttpRequests.request({
            method: 'DELETE',
            url,
            headers: {
                apikey: this.data.publicKey
            },
            })

            const response= await execute
            eventsEvolution.emit('INSTANCIA_LOGOUT', respondeEvento(true, 'Instância deslogada com sucesso', {instance, ...response}) )
            return response
        }catch(error){
            eventsEvolution.emit('INSTANCIA_LOGOUT', respondeEvento(false, 'Erro ao deslogar instância', error) )
            return null
        }
    }

    async instancia_reestart(instance:string):Promise<InstanciaRestartType | null>{
        if(!instance){
            Logs.error('instancia_reestart', 'Não foi passado o parametro  instance')
            eventsEvolution.emit('INSTANCIA_RESTART', respondeEvento<InstanciaRestartType>(false, 'Não foi passado o parametro  instance', null) )
            return null
        }
       try{
        const url=`${this.data.urlCompleta}/instance/restart/${instance}`

        const execute= await HttpRequests.request({
            method: 'POST',
            url,
            headers: {
                apikey: this.data.publicKey
            },
        })

        const response= await execute
        eventsEvolution.emit('INSTANCIA_RESTART', respondeEvento(true, 'Instância reiniciada com sucesso', {instance, ...response}) )
        return response
       }catch(error){
        eventsEvolution.emit('INSTANCIA_RESTART', respondeEvento(false, 'Erro ao reiniciar instância', error) )
        return null
       }
    }    
}