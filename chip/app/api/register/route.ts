'use server'

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import userModel from "@/database/db-model/user-model";
import z from 'zod'
import bcriptHash from "@/app/core/helpers/bcript";

const validateRegister= z.object({
    email: z
        .string()
        .email('email inválido')
        .min(5, 'deve ter no minimo 5 characteres'),
    password: z
        .string()
        .min(8, 'password deve ter no minimo 8 characteres')
})


export async function POST(req:NextRequest) {
    const data= await req.json()
    if(!data.email.trim() || !data.password.trim()){
        return NextResponse.json(
            { message: 'dados inválidos', data: null },
            { status: 404 }
        );
    }
    
    const valid= validateRegister.safeParse({
        email: data.email,
        password: data.password
    })
    
    if(!valid.success){
        const error= valid.error.flatten().fieldErrors
        return NextResponse.json(
            { message: 'erro ao fazer o registro', data: error },
            { status: 404 }
        );
    }

    const {email,password }= valid.data
    const passEncrypt= await bcriptHash.passHash(password)
    
    const execute= await userModel.create({
        email: email,
        password: passEncrypt
    })
    
    if(!execute){
        NextResponse.json(
            { message: 'Não foi possivel connectar na instancia', data: null },
            { status: 404 }
        );
        return  
    }
    return NextResponse.json(
        { message: 'connect com sucesso', data: 'success' },
        { status: 200 }
    );
}