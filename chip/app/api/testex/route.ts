'use server'
import { NextRequest, NextResponse } from "next/server";
import { CronManager } from '@/app/actions/cron-action'
import { getServerAction } from "@/app/actions/getSectionAction";
//import { getServerAction } from "@/app/actions/getSectionAction";
import { cronActions } from "@/app/actions/cron-action";



export async function POST(req:NextRequest) {
    const teste= await req.json()
    //const { id }= await getServerAction()

    //if(!id){
    //    return NextResponse.json(
    //        { message: 'Não foi possivel encontrar a Sessão do usuário', data: null },
    //        { status: 400 }
    //    );
    //}

    const manager = new CronManager('user1234');

    function minhaTarefa(param1: string, param2: number) {
        cronActions.sendMessageText('58072808-78EC-4FA7-810B-FFC0D8F3E31C','maxima','5531985019300','teste')
        console.log(`Executando com argumentos: ${param1}, ${param2}`);
    }

    const execute= manager.addJob('meuJob', '*/1 * * * * *', minhaTarefa, ['Oi', 42]);

    return NextResponse.json(
        { message: 'connect add job', data: execute },
        { status: 200 }
    );
}