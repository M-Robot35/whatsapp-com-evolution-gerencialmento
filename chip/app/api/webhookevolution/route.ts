'use server'
import { NextResponse, NextRequest } from "next/server";
import {  WebhookMsgUpsert } from "@/services/evolution/ev-webhook/webhook-msg-upsert";
import { WebhookMsgUpdate } from "@/services/evolution/ev-webhook/webhook-msg-update";
import { WebhookConnectionUpdate } from "@/services/evolution/ev-webhook/webhook-msg-connection";

export async function POST(request: NextRequest) {
  const data = await request.json();
    //console.log('data ----------- ', data)
    
    switch(data.event){ 
        case 'messages.upsert':
            const webhookMsgUpsert = new WebhookMsgUpsert(data)
            webhookMsgUpsert.execute()
            break

        case 'messages.update':
            const webhookMsgUpdate = new WebhookMsgUpdate(data)
            webhookMsgUpdate.execute()
            break

        case 'connection.update':
            const webhookConnectionUpdate = new WebhookConnectionUpdate(data)
            webhookConnectionUpdate.execute()
            break

        default:
            throw new Error('Event not found')
    }
   

    return NextResponse.json(
        {
            message: 'Hello, world!',
            data: data
        },
        {
            status: 200
        }
    )
}
