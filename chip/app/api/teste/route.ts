'use server'
import { NextRequest, NextResponse } from "next/server";
import { CronManager } from '@/app/actions/cron-action'    
//import { getServerAction } from "@/app/actions/getSectionAction";


export async function POST(req:NextRequest) {
    //const { id }= await getServerAction()

    //if(!id){
    //    return NextResponse.json(
    //        { message: 'Não foi possivel encontrar a Sessão do usuário', data: null },
    //        { status: 400 }
    //    );
    //}

    const scheduler = new CronManager('user1234');
    const execute= scheduler.stopJob('meuJob');

    return NextResponse.json(
        { message: 'connect stop job', data: execute },
        { status: 200 }
    );
}