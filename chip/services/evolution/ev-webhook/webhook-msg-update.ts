export class WebhookMsgUpdateDTO{
    public event: string
    public instance: string
    public destination: string
    public date_time: string
    public sender: string
    public server_url: string
    public apikey: string
    public keyId: string
    public messageId: string
    public remoteJid: string
    public fromMe: boolean
    public participant: string
    public status: string
    public instanceId: string
    
    constructor(private readonly data: WebhookUpdate){
        this.event = data.event
        this.instance = data.instance
        this.destination = data.destination
        this.date_time = data.date_time
        this.sender = data.sender
        this.server_url = data.server_url
        this.apikey = data.apikey
        this.keyId = data.data.keyId
        this.messageId = data.data.messageId
        this.remoteJid = data.data.remoteJid
        this.fromMe = data.data.fromMe
        this.participant = data.data.participant
        this.status = data.data.status
    }
}


export class WebhookMsgUpdate extends WebhookMsgUpdateDTO{
    constructor(data: any){
        if(data.event !== 'messages.update'){
            throw new Error('Event is required')
        }
        super(data)
    }
    
    execute(){
        this.sendMessage()
    }
    
    private sendMessage(){
        console.log('sendMessage ----- ',this.event)
    }
}





export type WebhookUpdate = {
    event: "messages.update";
    instance: string;
    data: {
      messageId: string;
      keyId: string;
      remoteJid: string;
      fromMe: boolean;
      participant: string;
      status: "READ" | "DELIVERED" | "FAILED" | "SENT";
      instanceId: string;
    };
    destination: string;
    date_time: string;
    sender: string;
    server_url: string;
    apikey: string;
  };