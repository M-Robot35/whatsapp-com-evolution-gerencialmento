'use server'

import { NextRequest, NextResponse } from "next/server";
import WhatsappMessage from "@/services/evolution/ev-evolution";
import { revalidateTag } from "next/cache";

export async function POST(req:NextRequest) {
    const { instanceName }= await req.json() 

    const execute= await WhatsappMessage.instancia.instancia_reestart(instanceName)
    if(!execute){
        NextResponse.json(
            { message: 'Não foi possivel connectar na instancia', data: null },
            { status: 404 }
        );
        return  
    }
    await revalidateTag('admin')

    return NextResponse.json(
        { message: 'connect com sucesso', data: execute },
        { status: 200 }
    );
}