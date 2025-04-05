import { UserMessageStatus } from "@prisma/client"
import { prismaConnect } from "../db-connect"
import { Logs } from "@/app/core/system"

type outputType = UserMessageStatus

export type inputType = {
    id: string;
    userId: string;
    instanceName: string;
    number: string;
    botSendMessage?: boolean;
    isBlocked?: boolean;
    timeToAnswer?: number;
    pausedUntil?: Date | null;
}

export type UserMessageStatusCreateType = Omit<inputType, 'createdAt' | 'updatedAt' | 'id' | 'botSendMessage' | 'isBlocked' | 'timeToAnswer' | 'pausedUntil'>

class UserMessageStatusModel {
    private database;

    constructor() {
        this.database = prismaConnect.userMessageStatus
    }

    async create(data: UserMessageStatusCreateType): Promise<outputType | null> {
        const { userId, instanceName, number } = data

        const existing = await this.database.findFirst({
            where: { userId, instanceName, number }
        })

        if (existing) {
            Logs.error('database create', `O status para usuário/instância [ ${userId}/${instanceName}/${number} ] já existe`)
            return null
        }

        const execute = await this.database.create({
            data: {
                ...data,
                botSendMessage: false,
                isBlocked: false,
                timeToAnswer: 0
            }
        })
        return execute
    }

    async findById(id: string): Promise<outputType | null> {
        const execute = await this.database.findFirst({
            where: { id }
        })
        return execute
    }

    async findByUserAndInstance(userId: string, instanceName: string): Promise<outputType | null> {
        const execute = await this.database.findFirst({
            where: { userId, instanceName }
        })
        return execute
    }

    async updateMessageStatus(instanceName: string, data: Partial<outputType>): Promise<outputType | null> {
        const execute = await this.database.update({
            where: { instanceName },
            data
        })
        return execute
    }

    async findAll(): Promise<outputType[]> {
        const execute = await this.database.findMany()
        return execute
    }

    async findAllByUser(userId: string): Promise<outputType[]> {
        const execute = await this.database.findMany({
            where: { userId }
        })
        return execute
    }
}

export default new UserMessageStatusModel()
