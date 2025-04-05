import HttpRequests from "@/app/core/helpers/HttpRequests";
import EvInstancia from "./ev-instance";
import EvMessage from "./ev-message";
import EvGrupos from "./ev-grupo";
import EvolutionManage from "./ev-menage";
import { 
    ISettings,
    IWebhookSetOptions, 
    IProxySetOptions, 
    TypeWebhookOutput, 
} from "./evoluitonTypes/instances-type";
import { eventsEvolution, respondeEvento } from "./ev-eventos/evolutionEventos";


class Evolution {
    public instancia:EvInstancia
    public messagem: EvMessage
    public grupos: EvGrupos

    constructor( private data:EvolutionManage ){
        this.instancia= new EvInstancia(data)
        this.messagem= new EvMessage(data)
        this.grupos= new EvGrupos(data)
    }

    async settingsGet(apikey:string, instanceName:string): Promise<ISettings|null>{                
        const url=`${this.data.urlCompleta}/settings/find/${instanceName}`

        try{
            const execute= await HttpRequests.get({
                url,
                headers: { apikey },
                authorization: this.data.globalApi
            })
    
            const response= await execute
            eventsEvolution.emit('SETTINGS', respondeEvento(true, 'Configurações obtidas com sucesso', { apikey, instanceName, ...response}) )
            return response     
        }catch(error){
            eventsEvolution.emit('SETTINGS', respondeEvento(false, 'Erro ao obter configurações', error) )
            return null
        }
    }

    async settingsUpdate(apikey:string, instanceName:string, options:Partial<ISettings>){
        const url=`${this.data.urlCompleta}/settings/set/${instanceName}`
        
        try{
            const execute= await HttpRequests.post({
                url,
                body: {...options},
                headers: { apikey}, 
                authorization: this.data.globalApi
            })
    
            const response= await execute
            eventsEvolution.emit('SETTINGS_UPDATE', respondeEvento(true, 'Configurações atualizadas com sucesso', { apikey, instanceName, ...response}) )
            return response
        }catch(error){
            eventsEvolution.emit('SETTINGS_UPDATE', respondeEvento(false, 'Erro ao atualizar configurações', error) )
            return null
        }
    }

    async webhookGet(apikey:string, instanceName:string ):Promise<TypeWebhookOutput|null>{
        const url=`${this.data.urlCompleta}/webhook/find/${instanceName}`
        
        try{
            const execute= await HttpRequests.get({
                url,
                headers: {apikey},
                authorization: this.data.globalApi
            })
    
            const response= await execute
            eventsEvolution.emit('WEBHOOK_GET', respondeEvento(true, 'Webhook obtido com sucesso', { apikey, instanceName, ...response}) )
            return response
        }catch(error){
            eventsEvolution.emit('WEBHOOK_GET', respondeEvento(false, 'Erro ao obter webhook', error) )
            return null
        }
    }

    async webhookUpdate(apikey:string, instanceName:string, options:IWebhookSetOptions):Promise<TypeWebhookOutput|null>{
        const url = `${this.data.urlCompleta}/webhook/set/${instanceName}`;

        const body = {
          webhook: {
            enabled: options.enabled,
            url: options.url,
            byEvents: options.byEvents,
            base64: options.base64,
            events: options.events,
          },
        };
      
        try {
          const response = await HttpRequests.post({
            url,
            body,
            headers: {
              apikey,
              "Content-Type": "application/json",
            },
            authorization: this.data.globalApi
          });
      
          eventsEvolution.emit(
            "WEBHOOK_UPDATE",
            respondeEvento(true, "Webhook atualizado com sucesso", {
              apikey,
              instanceName,
              ...response,
            })
          );
      
          return response;
        } catch (error) {
          console.error("Erro ao atualizar webhook:", error);
      
          eventsEvolution.emit(
            "WEBHOOK_UPDATE",
            respondeEvento(false, "Erro ao atualizar webhook", error)
          );
      
          return null;
        }
    }

    async proxyGet(apikey:string, instanceName:string ){
        const url=`${this.data.urlCompleta}/proxy/find/${instanceName}`
        
        try{
            const execute= await HttpRequests.get({
                url,
                authorization: this.data.globalApi,
                headers: { apikey}
            })

            const response= await execute
            eventsEvolution.emit('PROXY_GET', respondeEvento(true, 'Proxy obtido com sucesso', { apikey, instanceName, ...response}) )
            return response
        }catch(error){
            eventsEvolution.emit('PROXY_GET', respondeEvento(false, 'Erro ao obter proxy', error) )
            return null
        }
    }

    async proxyUpdate(apikey:string, instanceName:string, options:IProxySetOptions ){
        const url=`${this.data.urlCompleta}/proxy/set/${instanceName}`

        const {enabled,host,password,port,protocol,username}= options    

        const bodyProxy= {
            enabled,
            host,
            port,
            protocol,
            username,
            password
        }
        
       try{
            const execute= await HttpRequests.post({
                url,
                body: {...bodyProxy},
                headers: { apikey },
                authorization: this.data.globalApi
            })

            const response= await execute
            eventsEvolution.emit('PROXY_UPDATE', respondeEvento(true, 'Proxy atualizado com sucesso', { apikey, instanceName, ...response}) )
            return response
       }catch(error){
        eventsEvolution.emit('PROXY_UPDATE', respondeEvento(false, 'Erro ao atualizar proxy', error) )
        return null
        }
    }
}
const WhatsappMessage= new Evolution(new EvolutionManage)
export default WhatsappMessage