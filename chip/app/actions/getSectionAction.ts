import { auth } from '@/auth'
import { Logs } from '../core/system'
type RoleType= 'ADMIN'| "SUPER_ADMIN" | "USER"

type sessionType= {
    id: string
    name: string
    email: string
    role: RoleType
    image: string
}

export async function getServerAction(): Promise<sessionType|null>{
   const { user:{ email, id, role, name, image}}= await auth()   
   try{

   if(!id){
    Logs.error('getServerAction', 'Não foi possivel encontrar a Sessão do usuário')
    return null
   }
    return {id, name, email, role, image }
   }catch(error){
    Logs.error('getServerAction', 'Não foi possivel encontrar a Sessão do usuário')
    return null
   }
}