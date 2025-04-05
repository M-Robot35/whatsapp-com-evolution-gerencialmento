'use server'

import { NextRequest, NextResponse } from "next/server";
import instanceSave from '@/app/core/helpers/files'
import fs from 'fs/promises'
import path from 'path'


export async function POST(req:NextRequest) {
    const { hash, base64 } = await req.json();

    if (!hash || !base64) {
        return NextResponse.json(
            { message: 'hash ou base64 não encontrados', data: null },
            { status: 404 }
        );
    }

    const pathSv = "./lib/evolution/storage/instance-create.json";
    const dirPath = path.dirname(pathSv);

    let data: Record<string, string> = {};
    data= {...instanceSave, [hash]:base64}      
    
    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(pathSv, JSON.stringify(data), { encoding: 'utf8' });        
    } catch (error) {
        console.error('Erro ao salvar arquivo:', error);
    }    

    return NextResponse.json(
        { message: 'salvo com sucesso', data },
        { status: 200 }
    );
}