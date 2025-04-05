import cron from 'node-cron'
import fs from 'fs'
import path from 'path'
import { Logs } from '../system'
import { z } from 'zod'


 // validação dos dados com um objeto
const cronJobSchema = z.object({
    userId: z.string().min(1, 'O ID do usuário é obrigatório'   ),
    cronName: z.string().min(1, 'O nome do cron job é obrigatório'),
    cronTime: z.string().min(1, 'O tempo do cron job é obrigatório'),
    fn: z.string().min(1, 'A função do cron job é obrigatório'),
    mensagem: z.string().min(1, 'A mensagem do cron job é obrigatório'),   
    senders: z.array(z.string()).min(1, 'Os destinatários do cron job são obrigatórios')
})


// Garante que o diretório existe antes de criar o arquivo
const ensureDirectoryExistence = (filePath: string) => {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }) // Cria diretórios recursivamente
    }
}


// Caminho para o arquivo de configuração JSON
const arquivoName: string = 'cron-jobs.json'
const cronConfigPath = path.join(__dirname, `/${arquivoName}`)

// Funções disponíveis que podem ser executadas pelos cron jobs
const availableFunctions: Record<string, any> = {
    exampleTask: () => {
        console.log('Tarefa executada em', new Date().toLocaleString())
    },
    anotherTask: () => {
        console.log('Outra tarefa executada em', new Date().toLocaleString())
    }
}

// Função para carregar as configurações de cron jobs
const loadCronJobs = () => {
    ensureDirectoryExistence(cronConfigPath) // Garante que o diretório existe
    if (fs.existsSync(cronConfigPath)) {
        const cronData: any = fs.readFileSync(cronConfigPath)
        return JSON.parse(cronData)
    } else {
        fs.writeFileSync(cronConfigPath, JSON.stringify({}))
        Logs.success('loadCronJobs', `O Arquivo [ ${arquivoName} ] foi criado`)
    }
    return {}
}


// Função para salvar as configurações de cron jobs
const saveCronJobs = (jobs: Record<string, any>) => {
    ensureDirectoryExistence(cronConfigPath) // Garante que o diretório existe
    fs.writeFileSync(cronConfigPath, JSON.stringify(jobs, null, 2))
}


// Função para agendar cron jobs
export const scheduleCronJobs = (cronJobs: any) => {
    for (const userId in cronJobs) {
        const userCrons = cronJobs[userId]
        for (const cronName in userCrons) {
            const { schundler } = userCrons[cronName]

            if (!schundler || !schundler.cron || !schundler.fn) continue

            // Verifica se a função existe no mapeamento de funções
            if (availableFunctions[schundler.fn]) {
                cron.schedule(schundler.cron, availableFunctions[schundler.fn])
                Logs.success(
                    'scheduleCronJobs',
                    `Cron "${cronName}" do usuário "${userId}" foi agendado para ${schundler.cron}`
                )
            } else {
                Logs.error(
                    'scheduleCronJobs',
                    `Função "${schundler.fn}" não encontrada para o cron "${cronName}" do usuário "${userId}".`
                )
            }
        }
    }
}

// Função para adicionar um cron job e salvar no arquivo JSON
export const addCronJob = ( 
    userId: string,  
    cronName: string, 
    cronTime: string, 
    fn: string,  
    mensagem: string, 
    senders: string[]
) => {   

    const cronJob = cronJobSchema.safeParse({
        userId,
        cronName,
        cronTime,
        fn,
        mensagem,
        senders
    })

    if (!cronJob.success) {
        Logs.error('addCronJob', `Cron job inválido -- [ ${cronJob.error.message} ]`)
        Object.keys(cronJob.error.flatten().fieldErrors).map((key: string) => {
            Logs.error('addCronJob', `Cron job inválido -- [ ${key}: ${cronJob.error.flatten().fieldErrors[key]} ]`)
        })
        return {
            error: cronJob.error.flatten().fieldErrors
        }
    }     

    let cronJobs = loadCronJobs()

    if (!cronJobs[userId]) {
        cronJobs[userId] = {}
    }

    cronJobs[userId][cronName] = {
        mensagem,
        senders,
        schundler: {
            status: 'active',
            cron: cronTime,
            dateTime: new Date().toISOString(),
            fn
        }
    }

    saveCronJobs(cronJobs)

    if (availableFunctions[fn]) {
        cron.schedule(cronTime, availableFunctions[fn])
        Logs.success(
            'addCronJob',
            `Cron "${cronName}" do usuário "${userId}" adicionado e agendado para ${cronTime}`
        )
    } else {
        Logs.error('addCronJob', `Função "${fn}" não encontrada. Cron não será agendado.`)
    }
}

// Carregar cron jobs do arquivo JSON e agendar
const cronJobs = loadCronJobs()
console.log('cronJobs', cronJobs)
scheduleCronJobs(cronJobs)

// Exemplo de como adicionar um cron job
// --------------------------------------------------------------------
// addCronJob('user_123', 'exampleCron', '* * * * *', 'exampleTask', 'nada pra fazer', ['120363379353529796@g.us'])
// addCronJob('thiago', 'maromba', '*/10 * * * *', 'anotherTask', 'tudo certo', ['120363169158322832@g.us'])
