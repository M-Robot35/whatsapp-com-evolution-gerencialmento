import HttpRequests from "@/app/core/helpers/HttpRequests";
import { Logs } from "@/app/core/system";
import EvolutionManage from "./ev-menage";
import { TypeGroupOutput, TypeGroupParticipants } from "./evoluitonTypes/instances-type";
import { eventsEvolution, respondeEvento } from "./ev-eventos/evolutionEventos";


export default class EvGrupos {
    constructor( private data:EvolutionManage ){ } 

    async groupsAll(instanceName:string, apikey:string): Promise<TypeGroupOutput[]|null>{
        if(!instanceName || !apikey){
            eventsEvolution.emit('GROUPS_ALL', respondeEvento(false, 'Não tem o nome da Instancia para buscar os grupos', null) )
            return null
        }

        const url=`${this.data.urlCompleta}/group/fetchAllGroups/${instanceName}?getParticipants=false`        
        const execute:TypeGroupOutput[]= await HttpRequests.get({
        url,
        headers: { apikey }
        })

        const response= await execute
        eventsEvolution.emit('GROUPS_ALL', respondeEvento(true, 'Grupos encontrados com sucesso', { instanceName, apikey, ...response}) )
        return response  
          
    }    

    async groupsBuscarParticipants(instanceName:string, apikey:string, grupoId:string): Promise<TypeGroupParticipants|null>{
        if(!instanceName || !apikey || !grupoId){
            eventsEvolution.emit('GROUPS_BUSCAR_PARTICIPANTS', respondeEvento(false, 'Não tem o nome da [instanceName - apikey - grupoId] para buscar os grupos', null) )
            return null
        }        
        try{const url=`${this.data.urlCompleta}/group/participants/${instanceName}?groupJid=${grupoId}`      
        
            const execute:TypeGroupParticipants= await HttpRequests.get({
                url,
                headers: { apikey }
            })
            
            const response= await execute      
            eventsEvolution.emit('GROUPS_BUSCAR_PARTICIPANTS', respondeEvento(true, 'Grupos encontrados com sucesso', { instanceName, apikey, grupoId, ...response}) )
            return response       }catch(error){
            eventsEvolution.emit('GROUPS_BUSCAR_PARTICIPANTS', respondeEvento(false, 'Erro ao buscar os grupos', error) )
            return null
        }
    }
}