'use server'

import { NextRequest, NextResponse } from "next/server";
import Schedule from "@/app/core/helpers/schedule 9999";



export async function POST(req:NextRequest) {
    const { instanceName }= await req.json() 

    const schedule = new Schedule(instanceName)
    schedule.startAllJobs() 
    schedule.stopAllJobs()
    schedule.removeAllJobs()

   

    return NextResponse.json(
        { message: 'connect com sucesso', data: null },
        { status: 200 }
    );
}