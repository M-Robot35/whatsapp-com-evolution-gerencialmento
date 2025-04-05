'use client'
import { Button } from "../ui/button"
import HttpRequests from "@/app/core/helpers/HttpRequests"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface instaceOptions {
    name:string
}

export default function LogutInstancia({name}:instaceOptions){
    const route= useRouter()
    
    async function instanceDeleteup(){
        if(!confirm(`Você tem certeza que deseja Deslogar a conta [ ${name} ]`)){
            return
        }

        const url= `/api/logoutInstanceRoute`
        const execute= await HttpRequests.post({
          url,
          body:{ name }
        })
        
        if(execute.data.error){
            return toast('[ERROR] - instancia não deletada', 
                {description: `não foi possivel deletar a instancia ${name}`}
            )
        }
        await route.replace('/admin/instancias')
    }

    return (
        <div>
            <Button variant={'outline'} onClick={instanceDeleteup}>Logout</Button>
        </div>
    )
}