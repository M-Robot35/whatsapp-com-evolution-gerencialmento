'use client'
import WhatsappMessage from "@/services/evolution/ev-evolution"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ISettings } from "@/services/evolution/evoluitonTypes/instances-type"
import { toast } from "sonner"
import { styleUp } from "@/app/core/constants/style"
const {border} = styleUp



export interface IIinstaceParams {
    instanceName:string
    apiKey:string
}

const translate = (palavra: string) => {
    const traduzir: Record<string, string> = {
      rejectCall: "Rejeitar chamada",
      msgCall: "Mensagem após rejeitar",
      groupsIgnore: "Ignorar Grupos",
      alwaysOnline: "Sempre Online",
      readMessages: "Ler Mensagens",
      readStatus: "Ler Status",
    };
    return traduzir[palavra] || palavra;
};

const set= {
  alwaysOnline: false,
  groupsIgnore: false,
  msgCall: "",
  readMessages: false,
  readStatus: false,
  rejectCall: false,
  syncFullHistory: false,
};

export default function InstanceSettings({ apiKey, instanceName }: IIinstaceParams) {
    const [settings, setSettings] = useState<ISettings>(set);

    const setting = async () => {
      const execute = await WhatsappMessage.settingsGet(apiKey, instanceName);        
      if(!execute) return
      setSettings({...execute})
    };

    useEffect(() => { setting() }, []);

    const settingsUpdate= async ()=>{
      const execute = await WhatsappMessage.settingsUpdate(apiKey, instanceName, {...settings});
      if(!execute){
        return
      }
      setting()
      toast('[SUCCESS] Settings',{
        description:'Settings atualizada com sucesso'
    })      
    }  
    
  
    return (
      <div className="flex flex-col gap-2">
        {settings &&
          Object.entries(settings).map(([key, value]:[key:string, value:string|boolean]) => (
            <div key={key} className="flex justify-between items-center border border-gray-700 p-2 rounded-sm">
              <Label htmlFor={key}>{translate(key)}</Label>
              
              {typeof value === "boolean" ? (
                <Switch
                  id={key}
                  checked={ value }
                  onCheckedChange={()=>{setSettings({...settings, [key]:!value} )}}
                  className={`${border}`}
                />
              ) : (
                <Input 
                    className={`${border} w-[70%]`}
                    id={key}
                    value={value}
                    onChange={(e)=>{ setSettings({...settings, [key]:e.target.value}) }}
                    type="text" 
                    placeholder="Mensagem"
                />
              )}
            </div>
          ))}
          <div className="">
            <Button className="" onClick={settingsUpdate} variant={'outline'}>Salvar</Button>
          </div>
      </div>
    );
  }
