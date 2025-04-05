'use server'

import { NextRequest, NextResponse } from "next/server";
import WhatsappMessage from "@/services/evolution/ev-evolution";
import { revalidateTag } from "next/cache";

export async function POST(req:NextRequest) {
    const { name }= await req.json()

    const execute= await WhatsappMessage.instancia.instancia_logout(name)
    
    if(execute.error){
        NextResponse.json(
            { message: 'Não foi possivel deletar', data: execute },
            { status: 404 }
        );
        return  
    }
    await revalidateTag('admin')

    return NextResponse.json(
        { message: 'deletado com sucesso', data: execute },
        { status: 200 }
    );
}