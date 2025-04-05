'use server'
import groupParticipants from "./evolutionAction";
import { TypeGroupParticipants } from "@/services/evolution/evoluitonTypes/instances-type";


export async function* fetchParticipantsGenerator(usersSend:string[], instanceNamee:string, apikeyy:string) {
    if (!usersSend || usersSend.length === 0) {
        yield null;
        return;
    }
    const allParticipants:TypeGroupParticipants  = { participants: [] };

    for (let i = 0; i < usersSend.length; i++) {
        const groupId = usersSend[i];
        const result = await groupParticipants(instanceNamee, apikeyy, groupId);

        if (result) {
            allParticipants.participants = [...allParticipants.participants, ...result.participants];
            yield allParticipants;
        }
    }

    allParticipants.participants = Array.from(
        new Map(allParticipants.participants.map(p => [p.id, p])).values()
    );
    yield allParticipants;
}