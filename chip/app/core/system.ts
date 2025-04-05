import { configSystem } from "./system-config";
import pc from "picocolors"

const rejectShowLogs=['AxiosHttpClient', 'instancia_all']

// documentação de logs color- https://www.npmjs.com/package/picocolors
export const Logs = {
    success: (local:string, mensagem:string):void=>{
        if(rejectShowLogs.includes(local)) return
        
        if(configSystem.system.logs.success){  
            console.log(
                pc.bgBlack(
                    pc.green(`Local- ${local}
            [SUCCESS] - ${mensagem}
            `))
            )
        }
    },    
    
    error: (local:string, mensagem:string):void=>{
        
        if(configSystem.system.logs.error){
            console.error(
                pc.bgBlack(
                    pc.red(`Local- ${local}
            [ERROR] - ${mensagem}
            `))
            )
        }
    },
}


export const system_config= {
    system: {
        host: 'http://localhost',
        port: 3000,

        get urlcompleta(){
            return `${this.host}:${this.port}`
        }
    }
}