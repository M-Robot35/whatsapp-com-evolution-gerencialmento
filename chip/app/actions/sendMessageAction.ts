'use server'

import { z } from "zod";
import WhatsappMessage from "@/services/evolution/ev-evolution";

const sendMessageSchema = z.object({
    apikey: z.string({required_error: 'Apikey é obrigatório'}),
    instance: z.string({required_error: 'Instance é obrigatório'}),
    users: z.union([
        z.string().min(1, {message: 'Deve conter pelo menos 1 usuário para enviar a mensagem'}),
        z.array(z.string().min(1, {message: 'Deve conter pelo menos 1 usuário para enviar a mensagem'}))
    ]),
    message: z.string().min(1, {message: 'Mensagem deve ter pelo menos 1 caracteres'})
});


export async function sendMessageActionServer(_, formData: FormData){
    const schema = sendMessageSchema.safeParse({
        apikey: formData.get('apikey'),
        instance: formData.get('instance'),
        users: formData.get('users'),
        message: formData.get('message'),
    });

    if(!schema.success){
        return {
            error: schema.error.flatten().fieldErrors
        }
    }

    const {apikey, instance, users, message} = schema.data;

    if (Array.isArray(users)) {
        console.log('dentro do array')
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
    } else {
        console.log('dentro do single')
        await WhatsappMessage.messagem.sendMessageText({
            apikey,
            instance,
            message,
            number: users
        });
        return {success: 'Mensagem enviada com sucesso single'}
    }
   
}