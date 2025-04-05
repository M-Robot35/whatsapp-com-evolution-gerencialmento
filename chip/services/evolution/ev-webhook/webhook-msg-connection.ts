import { eventsEvolution } from "../ev-eventos/evolutionEventos";

export type WebhookConnection = {
    event:string;
    instance: string;
    data: {
        instance: string;
        state: "connecting" | "open" | "close" | "reconnecting";
        statusReason: number;
    };
    destination: string;
    date_time: string;
    server_url: string;
    apikey: string;
};

export class WebhookConnectionUpdateDTO {
    public event: string;
    public instance: string;
    public destination: string;
    public date_time: string;
    public server_url: string;
    public apikey: string;
    public state: string;
    public statusReason: number;
    
    constructor(data: WebhookConnection) {
        this.event = data.event;
        this.instance = data.instance;
        this.destination = data.destination;
        this.date_time = data.date_time;
        this.server_url = data.server_url;
        this.apikey = data.apikey;
        this.state = data.data.state;
        this.statusReason = data.data.statusReason;
    }
}

export class WebhookConnectionUpdate extends WebhookConnectionUpdateDTO {
    constructor(data: WebhookConnection) {
        if (data.event !== 'connection.update') {
            throw new Error('Event is required');
        }
        super(data);
    }
    
    execute() {
        //console.log('WebhookConnectionUpdate', {
        //    instance: this.instance,
        //    state: this.state,
        //    statusReason: this.statusReason,
        //    apikey: this.apikey
        //});        
        this.emitEvent();
    }

    private emitEvent(){
        eventsEvolution.emit<WebhookConnectionUpdateDTO>('INSTANCIA_STATUS_CONNECTION', {
            event: this.event,
            instance: this.instance,
            destination: this.destination,
            date_time: this.date_time,
            server_url: this.server_url,
            apikey: this.apikey,
            state: this.state,
            statusReason: this.statusReason
        } as WebhookConnectionUpdateDTO);    
    }    
}