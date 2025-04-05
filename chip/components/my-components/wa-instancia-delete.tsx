'use client'
import { Button } from "../ui/button"
import HttpRequests from "@/app/core/helpers/HttpRequests"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


interface instaceOptions {
    name:string
}

export default function DeleteInstancia({name}:instaceOptions){
    const route= useRouter()
    
    async function instanceDeleteup(){
        if(!confirm(`Você tem certeza que deseja deletar [ ${name} ]`)){
            return
        }

        const url= `/api/deleteInstanceRoute`
        const execute= await HttpRequests.post({
          url,
          body:{ name }
        })
        
        if(execute.data.error){
            return toast('[ERROR] - instancia não deletada', 
                {description: `não foi possivel deletar a instancia ${name}`}
            )
        }
        const caminho= '/admin/instancias'
        await route.push(caminho)
    }

    return (
        <div>
            <Button variant={'outline'} className="text-red-600" onClick={instanceDeleteup}>Deletar</Button>
        </div>
    )
}