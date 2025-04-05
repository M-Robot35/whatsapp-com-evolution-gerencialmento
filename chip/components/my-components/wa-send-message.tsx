'use client'

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { styleUp } from "@/app/core/constants/style"
import { useActionState } from "react"
import { sendMessageActionServer } from "@/app/actions/sendMessageAction"


const {border}=styleUp

export type whatsappSendMessage ={
    apikey:string
    instanceName: string
    users:string|string[]
    timeSeconds?: number
    className?: string
}


export default function SendMessage({ apikey,instanceName, users, timeSeconds,className}: whatsappSendMessage){
    const [message, setMessage]=useState<string>('')
    const [userActionState, userActionDispatch, userActionPending]= useActionState(sendMessageActionServer, {success: false, error: ''})

    return (
        <section>            
            
            <div className="flex flex-row flex-wrap gap-2 relative ">
                
                <form className="w-full" action={userActionDispatch}>
                    
                    <input type="hidden" name="apikey" value={apikey} />
                    <input type="hidden" name="instance" value={instanceName} />
                    {Array.isArray(users)
                        ? users.map((user, index) => (
                            <input key={index} type="hidden" name="users" value={user} />
                            ))
                        : <input type="hidden" name="users" value={users} />
                    }
                    <Label className="ml-2 mb-2" htmlFor="message">Sua Mensagem</Label>
                    <Textarea 
                        id='send_message'
                        name='message'
                        className={`${border} ${className?className:''}`}
                        disabled={userActionPending}
                        value={message}
                        onChange={(event)=> {setMessage(event.target.value)}}
                    />
                
                <div className="flex justify-between w-full relative flex-wrap ">
                    <div>
                        <p>Total de destinatários: {users.length}</p>
                    </div>
                    <Button 
                        className="sm:mt-2 sm:w-full"
                        variant={'outline'}
                        disabled={userActionPending}
                        type="submit"
                    >                            
                        {userActionPending? 'Enviando...': 'Envar Mensagem'}
                    </Button>

                </div>
                <div className="mt-2">
                    {userActionState.error && (
                            <div>
                                {Object.keys(userActionState.error).map((key, index)=>(
                                    <p key={index}>🔴 {key}: {userActionState.error[key]}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
            </div>

        </section>
    )
}