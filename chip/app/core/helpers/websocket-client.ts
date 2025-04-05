import { io, Socket } from 'socket.io-client'
import { configSystem } from '../system-config';
import { Logs } from '../system';

//  ----------------------------------------------
// wss para receber connecção de websocket
//  ----------------------------------------------

let Ws: Socket | null= null;

function websocket() {
    if(!configSystem.websocketClient.url) {
        Logs.error('websocket', 'WEBSOCKET: URL não configurada')
        return
    }
    if(!configSystem.websocketClient.url.startsWith('ws://')) {
        Logs.error('websocket', 'WEBSOCKET: URL não configurada [ Exemplo: ws://localhost:3000 ]')
        return
    }
    if(!configSystem.websocketClient.url.startsWith('ws://localhost')) {
        Logs.success('websocket', `WEBSOCKET: Rodando em Localhost [ ${configSystem.websocketClient.url} ]`)
    }


    const WsServer = io(`ws://${configSystem.websocketClient.url}`, {
        parser: 'json',
        reconnectionDelayMax: configSystem.websocketClient.delayReconnect,
        reconnectionDelay: configSystem.websocketClient.delayReconnect,
        reconnectionAttempts: 5,
        reconnection: true,
        autoConnect: true,
        //forceBase64: true,
        // hostname: undefined,  // The hostname for our connection. Set from the URI passed when connecting
        // protocols: undefined, // string | string[] | undefined
    })
    Ws = WsServer
}
websocket()

export default function getIoClient() {
    if (Ws) {
        Logs.success('getIoClient', 'WEBSOCKET: Online')  
        return Ws
    } else {
        Logs.error('getIoClient', 'WEBSOCKET: OffLine')
    }
}