import { prismaConnect } from "../db-connect";
import { Prisma } from "@prisma/client";
import { Logs } from "@/app/core/system";

type BotMessageType = {
    id: string;
    userId: string;
    isActive?: boolean;
    instanceName?: string;
    createdAt: Date;
    updatedAt: Date;
}

type BotMessageCreateType = Omit<BotMessageType, 'createdAt' | 'updatedAt' | 'id'>

class BotMessageModel {
    private database;

    constructor(){
        this.database = prismaConnect.botMessage
    }

    async create(data: BotMessageCreateType): Promise<BotMessageType | null> {
        const { userId, instanceName } = data;

        const existing = await this.database.findFirst({
            where: { userId, instanceName }
        });

        if (existing) {
            Logs.error('database create', `O bot para usuário [ ${userId} ] já existe`)
            return null;
        }

        const execute = await this.database.create({
            data: {
                userId,
                instanceName,
                isActive: false
            }
        });
        Logs.success('database create', `Bot criado com sucesso para o usuário [ ${userId} ]`)
        return execute;
    }

    async findByUserId(userId: string): Promise<BotMessageType | null> {
        const execute = await this.database.findFirst({
            where: { userId }
        });
        return execute;
    }

    async findByUserInstance(userId: string, instanceName: string): Promise<BotMessageType | null> {
        const execute = await this.database.findFirst({
            where: { userId, instanceName }
        });
        return execute;
    }

    async updateStatus(userId: string, isActive: boolean, instanceName?: string): Promise<BotMessageType | null> {
        const execute = await this.database.update({
            where: { userId },
            data: {
                isActive,
                instanceName
            }
        });
        Logs.success('database update', `Bot atualizado com sucesso para o usuário [ ${userId} ]`)
        return execute;
    }

    async findAll(): Promise<BotMessageType[]> {
        const execute = await this.database.findMany();
        Logs.success('database findAll', `Bots encontrados com sucesso`)
        return execute;
    }
}

export default new BotMessageModel();   