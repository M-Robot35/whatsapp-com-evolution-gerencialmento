'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AvatarImageUser({urlImage}:{urlImage:string}){

    return(
        <Avatar>
            <AvatarImage src={urlImage} />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )
}

