// funções iniciadas junto com o servidor
import { PrismaClient } from "@prisma/client";
import { restoreCrons } from "@/app/actions/cron-action";

if (!globalThis.__booted) {
    globalThis.__booted = false;
}

export async function boot() {
    if (globalThis.__booted) return; // Se já rodou, evita reexecução
    globalThis.__booted = true; // Marca como iniciado

    console.log("Iniciando sistema...");

    // Conectar ao Banco de Dados
    await connectToDatabase();

    // Carregar arquivos necessários do cron
    await restoreCrons();

    console.log("Sistema inicializado com sucesso!");
}

// Instância do Prisma
const prisma = new PrismaClient();

export async function connectToDatabase() {
    try {
        await prisma.$connect();
        console.log("Banco de Dados Conectado!");
    } catch (error) {
        console.error("Erro ao conectar ao banco:", error);
        process.exit(1);
    }
}

