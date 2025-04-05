'use server'
import fs from 'fs/promises'
import path from 'path';
import { getServerAction } from '@/app/actions/getSectionAction';
import instanciaModel from '@/database/db-model/instancia-model';
import { NextRequest, NextResponse } from "next/server";
import WhatsappMessage from "@/services/evolution/ev-evolution";
import { revalidateTag } from "next/cache";
import { Logs } from '@/app/core/system';


export async function POST(req:NextRequest) {
    const { name }= await req.json()

    const execute= await WhatsappMessage.instancia.instancia_delete(name)    
    
    if(execute.error){
        Logs.error('deleteInstanceRoute', `não foi possivel deletar a instancia ${name}`)
        NextResponse.json(
            { message: 'Não foi possivel deletar', data: execute },
            { status: 404 }
        );
        return  
    }
    await revalidateTag('admin')
    Logs.success('deleteInstanceRoute', `instancia ${name} deletada com sucesso`)
    return NextResponse.json(
        { message: 'deletado com sucesso', data: execute },
        { status: 200 }
    );
}
