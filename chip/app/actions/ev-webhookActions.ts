'use server'

import { Logs } from "@/app/core/system"
import  InstanceModel from "@/database/db-model/instancia-model"
import { WebhookConnectionUpdateDTO } from "@/services/evolution/ev-webhook/webhook-msg-connection"
import { eventsEvolution } from "@/services/evolution/ev-eventos/evolutionEventos"


eventsEvolution.on('INSTANCIA_STATUS_CONNECTION', async( event:WebhookConnectionUpdateDTO)=>{
    console.log('INSTANCIA_STATUS_CONNECTION', event)
    try{
        if (!event || !event.instance) {
            Logs.error('INSTANCIA_STATUS_CONNECTION', 'Dados do evento inválidos')
            return
        }

        const getInstance = await InstanceModel.findByInstanceName(event.instance)    
        if(!getInstance){
            Logs.error('INSTANCIA_STATUS_CONNECTION', `Instância não encontrada: ${event.instance}`)
            return
        }
    
        await InstanceModel.update(getInstance.userId, getInstance.instanciaName, {
            statusConnection: event.state
        })
        Logs.success('INSTANCIA_STATUS_CONNECTION', `Status atualizado: ${event.instance} - ${event.state}`)
     
    }catch(error){
        Logs.error('INSTANCIA_STATUS_CONNECTION', `Erro ao atualizar status: ${error}`)
    }   
})