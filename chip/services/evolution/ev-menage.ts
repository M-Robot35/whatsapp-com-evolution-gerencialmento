import { configSystem, Env } from '@/app/core/system-config'

export default class EvolutionManage {
    private apiGlobal:string= configSystem.evolution.apikey?? 'minhasenhasecreta'
    private url_root:string= configSystem.evolution.url?? 'http://localhost:8080'   

    get urlCompleta(){
        return this.url_root
    }

    get publicKey(){
        return this.apiGlobal
    }

    get globalApi(){
        return this.apiGlobal
    }}