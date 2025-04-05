// import z from 'zod'
import userModel from "@/database/db-model/user-model"
import  bcriptHash from "../core/helpers/bcript"

import { z } from 'zod'
 
export const SignupFormSchema = z.object({  
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'não pode ser menor 8 characters' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})
 
export type FormState =
| {
    errors?: {
        email?: string[]
        password?: string[]
    }
    message?: string
}
| undefined


export async function registerForm(state: FormState, formData: FormData){    
    
    const verify= SignupFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    })

    if(!verify.success){
        return {
            errors: verify.error.flatten().fieldErrors,
            message:'Erros ao fazer o registro'
        }
    }

    const { email, password }= verify.data
    
    const verifyEmailExists= await userModel.findByEmail(email)
    if(verifyEmailExists) return { ok: false, mensagem: 'email já existe',  data:null}

    const userCreate= await userModel.create({
        email,
        password: await bcriptHash.passHash(password)
    })

    if(!userCreate) return { ok: false, mensagem: 'não foi possivel criar o usuário', data:null}

    return { ok: true, mensagem: 'sucesso ao criar o usuário',  data: {email: email}} 
}