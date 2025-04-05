import { Logs } from "@/app/core/system";
import WhatsappMessage from "../ev-evolution";
import botMessageModel from "@/database/db-model/botMessage-model";
import userModel from "@/database/db-model/user-model";
import userMessageStatusModel from "@/database/db-model/userMessageStatus-model";
import instanciaModel from "@/database/db-model/instancia-model";


export class WebhookMsgUpsertDTO{
    public instance:string|null = null;
    public fromMe:boolean|null = null;
    public id:string|null = null;
    public remoteJid:string|null = null;
    public pushName:string|null = null;
    public message:string|null = null;
    public messageType:string|null = null;
    public messageTimestamp:number|null = null;
    public instanceId:string|null = null;
    public source:string|null = null;
    public destination:string|null = null;
    public date_time:string|null = null;
    public sender:string|null = null;
    public server_url:string|null = null;
    public apikey:string|null = null;    
    public event:string|null = null;

    constructor(private readonly data: WebhookUpsert){
        if(!data.instance){
            throw new Error('Instance is required')
        }

        this.instance = data.instance
        this.fromMe = data.data.key.fromMe
        this.id = data.data.key.id
        this.remoteJid = data.data.key.remoteJid
        this.pushName = data.data.pushName
        this.message = data.data.message.conversation
        this.messageType = data.data.messageType
        this.messageTimestamp = data.data.messageTimestamp
        this.instanceId = data.data.instanceId
        this.source = data.data.source
        this.destination = data.destination
        this.date_time = data.date_time
        this.sender = data.sender
        this.server_url = data.server_url
        this.apikey = data.apikey
        this.event = data.event
    }    
}

export type WebhookUpsert = {
    event: "messages.upsert";
    instance: string;
    data: {
      key: {
        remoteJid: string;
        fromMe: boolean;
        id: string;
      };
      pushName: string;
      message: {
        conversation: string;
        messageContextInfo: Record<string, any>; // Ajuste conforme necessário
      };
      messageType: string;
      messageTimestamp: number;
      instanceId: string;
      source: string;
    };
    destination: string;
    date_time: string;
    sender: string;
    server_url: string;
    apikey: string;
};


const PAUSE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

export class WebhookMsgUpsert extends WebhookMsgUpsertDTO{
    constructor(data: any){
        if(data.event !== 'messages.upsert'){
            throw new Error('Event is required')
        }
        super(data)
    }

    async execute(){
        const now = new Date()
        // pegar usuario pela instance
        const user = await this.checkBotStatus()

        if (!this.fromMe) {
            // Atualiza o tempo de resposta do usuário ao enviar uma mensagem
            const updateUserMessageStatus = await userMessageStatusModel.updateMessageStatus(this.instance, { timeToAnswer: now.getTime() })
            if(!updateUserMessageStatus){
                Logs.error('WebhookMsgUpsert',`Erro ao atualizar o tempo de resposta do usuário ${user.id} para a instância ${this.instance}`)
                return
            }            
            return;
        }
        const userMessageStatus = await userMessageStatusModel.findByUserAndInstance(user.id, this.instance)
        
        // Verifica se já passaram 5 minutos desde a última mensagem        
        if (userMessageStatus && now.getTime() - userMessageStatus.timeToAnswer < PAUSE_DURATION) {
            Logs.success("WebhookMsgUpsert", `Bot pausado para usuário ${user.id}, aguardando tempo limite.`);
            return;
        }      


        // Buscar o status do bot para este usuário
        const botStatus = await botMessageModel.findByUserInstance(user.id, this.instance)
        
        
        if(userMessageStatus.isBlocked){
            Logs.error('WebhookMsgUpsert',`Bot está bloqueado para o usuário ${this.apikey} e número ${this.remoteJid}`)            
            return
        }

        if(botStatus.isActive){
            Logs.error('WebhookMsgUpsert',`Bot não está ativo para o usuário ${this.apikey} e número ${this.remoteJid}`)            
            return
        }

        this.sendMessage()
    }        

    private async sendMessage(){
        if(this.fromMe){
            return
        }       

        const message = await WhatsappMessage
        .messagem
        .sendMessageText({
            apikey:this.apikey,
            instance:this.instance,
            number:this.remoteJid,
            message:this.message
        })
        Logs.success('WebhookMsgUpsert',`Mensagem enviada com sucesso para ${this.remoteJid}`)
    }

    private async checkBotStatus(){
        const userInstace= await instanciaModel.findByInstanceName(this.instance)
        const user = await userModel.findById(userInstace.userId)
        const botExists = await botMessageModel.findByUserInstance(user.id, this.instance)
        const userMessageStatus = await userMessageStatusModel.findByUserAndInstance(user.id, this.instance)
        
        if(!userInstace.numero || userInstace.numero !== ''){
            await instanciaModel.update(user.id, this.instance, {
                numero: this.sender,
                baseCode: ''
            })
        }
        
        if(!botExists){
            await botMessageModel.create({
                userId: user.id,
                instanceName: this.instance
            })
            Logs.success('WebhookMsgUpsert',`Bot criado com sucesso para o usuário ${user.id}`) 
        }

        if(!userMessageStatus){
            await userMessageStatusModel.create({
                userId: user.id,
                instanceName: this.instance,
                number: this.remoteJid,
            })
            Logs.success('WebhookMsgUpsert',`Status do bot criado com sucesso para o usuário ${user.id}`)
        }
        return user        
    }
}
