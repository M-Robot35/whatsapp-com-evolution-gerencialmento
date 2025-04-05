import WhatsappMessage from "@/services/evolution/ev-evolution"
import { IEvolutionInstance } from "@/services/evolution/evoluitonTypes/instances-type"
import AvatarImageUser from "@/components/my-components/avatar"
import { Button } from "@/components/ui/button"
import { ArrowRightCircle } from "lucide-react"
import { WhatsappCriarInstancia } from "@/components/my-components/wa-instance-create"
import { userInstanceAction } from "@/app/actions/instanceAction"


export const formatNumber= (numero:string)=>{
  if(!numero) return numero
  const resultado= numero.replace(/\D/g, '')
  const format= resultado.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/, '+$1 ($2) $3-$4')
  return format
}

export const statusConnection= (status:string)=>{
  switch(status){
    case "open":
      return <span className="text-green-500 font-bold">Connectado</span>
    
    case "connecting":
      return <span className="text-yellow-500 font-bold">Ler QrCode</span>

    case "close":
      return <span className="text-red-500 font-bold">Desconectado</span>
    
    default:
      return status
  }
}

export default async function Page() {
  const all:IEvolutionInstance[]= await WhatsappMessage.instancia.instancia_all()

  const myinstance= await (await userInstanceAction()).map(item => item.instanciaName)
  const instancias:IEvolutionInstance[] = await all.filter(item => myinstance.includes(item.name))
  
  return (    
    <div className="container flex flex-1 flex-col gap-4 p-4">
      <div className="flex justify-end">
        <WhatsappCriarInstancia/>
      </div>
      <div className={`grid auto-rows-min gap-4 grid-cols-1 flex-wrap ${(instancias.length > 0)?'sm:grid-cols-2 xl:grid-cols-3 ':  '' } relative`}>
        
        {
          (instancias.length > 0)?
          instancias.map((item, index)=>{
            return (
              <div key={index} className="flex justify-between gap-2  relative bg-muted/50 p-4 border rounded-sm hover:border-gray-500 " >
                
                <div className="flex gap-2 flex-wrap">
                  
                  <div className="">
                      <AvatarImageUser urlImage={item.profilePicUrl}/>
                  </div>
                  
                  <div>
                    <h1 className="">instance Name: <span className="text-gray-500 text-nowrap whitespace-nowrap overflow-hidden">{item.name}</span></h1>
                    <p className="">Status: {statusConnection(item.connectionStatus)}</p>
                    
                    <div className="flex flex-row gap-4 w-full ">
                      <p className="">Número: </p>
                      <span className="text-gray-500 text-nowrap whitespace-nowrap">{formatNumber(item.ownerJid)}</span>
                    </div>

                  </div>

                </div >
                <div className={`absolute right-2 top-2`}>
                  <a href={`/admin/instancias/${item.name}/${item.token}` }>
                    <Button variant={"outline"}>
                      <ArrowRightCircle/>
                    </Button>                  
                  </a>                
                </div>
            </div>
            )
          }):
          <div className="flex flex-row justify-center  p-2 w-full bg-muted/50">
            <p className="text-gray-500">Você ainda não tem instância criada</p>
          </div>
        }
        
      </div>
      {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" >
      
      </div> */}
    </div>     
  )
}
