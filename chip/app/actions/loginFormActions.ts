'use server'

import { signIn } from '@/auth'


export  default async function loginFormAction(_:any, formdata:FormData){
    try{
        if(!check.success){
            return{success: false, message: 'Login ou senha inválidos'}
        }
        await signIn('credentials',{
            email: formdata.get('email'),
            password: formdata.get('password'),
            redirect: false
        })
        return {success: true}
    }catch(error){
        if(error.type  === 'CredentialsSingIn')
        {
            return {success: false, message: 'Login ou senha inválidos'}
        }
        return {success: false, message: 'Login ou senha inválidos'}
    }
}