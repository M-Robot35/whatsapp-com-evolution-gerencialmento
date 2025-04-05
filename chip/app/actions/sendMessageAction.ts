'use server'

import { z } from "zod";
import WhatsappMessage from "@/services/evolution/ev-evolution";
import { Logs } from "../core/system";


const sendMessageSchema = z.object({
    apikey: z.string({ required_error: 'Apikey é obrigatório' }),
    instance: z.string({ required_error: 'Instance é obrigatório' }),
    users: z.preprocess(
        val => typeof val === 'string' ? JSON.parse(val) : val,
        z.array(z.string().min(1, {message: 'Deve conter pelo menos 1 usuário para enviar a mensagem'})).min(1, {message: 'Deve conter pelo menos 1 usuário para enviar a mensagem'})
      ),
    message: z.string().min(1, { message: 'Mensagem deve ter pelo menos 1 caracteres'}),
});

export async function sendMessageActionServer(_, formData: FormData){  
    const schema = sendMessageSchema.safeParse({
        apikey: formData.get('apikey'),
        instance: formData.get('instance'),
        users: JSON.parse(formData.get('users') as string),
        message: formData.get('message'),
    });

    if(!schema.success){
        return {
            error: schema.error.flatten().fieldErrors
        }
    }

    const {apikey, instance, users, message} = schema.data;
   
    if (!Array.isArray(users)){
        Logs.error('sendMessageActionServer', 'Users não é um array')
        return {success: 'Não foi possivel enviar sua mensagem'}
    }

    return {success: 'Não foi possivel enviar sua mensagem'}

    for (const user of users) {
        await WhatsappMessage.messagem.sendMessageText({
            apikey,
            instance,
            message,
            number: user
        });
        new Promise(resolve => setTimeout(resolve, 3000))
    }
    return {success: 'Mensagem enviada com sucesso Array'}   
}