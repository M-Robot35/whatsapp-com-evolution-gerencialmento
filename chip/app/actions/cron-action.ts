import cron, { schedule, ScheduledTask } from 'node-cron';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { Logs } from '../core/system';
import WhatsappMessage from '@/services/evolution/ev-evolution';


// Alguns exemplos de outros padrões de tempo que você pode usar:
// */5 * * * * - a cada 5 minutos
// 0 * * * * - no início de cada hora
// 0 0 * * * - uma vez por dia à meia-noite
// 0 12 * * * - uma vez por dia ao meio-dia
// 0 0 * * 0 - uma vez por semana no domingo à meia-noite


const returno = (boolean: boolean, message: string) => {
    return {
        status: boolean ? 'success' : 'error',
        message: message,
        data: null
    }
}

export const CRON_DB_PATH = path.join(process.cwd(), 'database', 'store', 'crons','crons.json');

// Schema para validação dos jobs
const cronJobSchema = z.object({
  expression: z.string(),
  fn: z.string(),
  args: z.array(z.any()).optional(),
  status: z.enum(["ativo", "inativo"]),
});

// Garante que o arquivo JSON existe
if (!fs.existsSync(CRON_DB_PATH)) {
  fs.writeFileSync(CRON_DB_PATH, JSON.stringify({}, null, 2));
}

// Armazena os cron jobs globalmente
if (!globalThis.cronInstances) {
  globalThis.cronInstances = {} as Record<string, Record<string, ScheduledTask>>;
}

export const cronActions= {
  'sendMessageText': async (apikey:string, instance:string, number:string|string[], message:string)=>{
    if(Array.isArray(number)){
      number.forEach(async n=>{
        await WhatsappMessage.messagem.sendMessageText({
          apikey:apikey,
          instance:instance,
          number:n,
          message:message
        })
      })
    }else{
      await WhatsappMessage.messagem.sendMessageText({
        apikey:apikey,
        instance:instance,
        number:number,
        message:message
      })
    }
  }
}

type CronAction = keyof typeof cronActions;


export class CronManager {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;

    if (!globalThis.cronInstances[this.userId]) {
      globalThis.cronInstances[this.userId] = {};
    }

    this.scheduleAllJobs();
  }

  private loadJobs(): Record<string, Record<string, any>> {
    try {
      return JSON.parse(fs.readFileSync(CRON_DB_PATH, 'utf-8')) || {};
    } catch (error) {
      Logs.error('CronManager loadJobs', `Erro ao carregar cron jobs: ${JSON.stringify(error)}`);
      return {};
    }
  }

  private saveJobs(jobs: Record<string, Record<string, any>>) {
    fs.writeFileSync(CRON_DB_PATH, JSON.stringify(jobs, null, 2));
  }

  private scheduleAllJobs() {
    const jobs = this.loadJobs()[this.userId] || {};

    for (const cronName in jobs) {
      const job = jobs[cronName];
      if (job.status === "ativo" && !globalThis.cronInstances[this.userId][cronName]) {
        const wrapperFn=()=> eval(`(${job.fn})`);
        this.addJob(cronName, job.expression, wrapperFn, job.args || [], true);
      }
    }
  }

  private executeJobWithArgs(fn: (...args: any[]) => void, args: any[]) {
    return () => fn(...args);
  }

  addJob(cronName: string, expression: string, fn: (...args: any[]) => void, args: any[] = [], isStartup = false) {
    if (!cron.validate(expression)) {
      Logs.error('CronManager addJob', `Expressão de cron inválida: ${expression}`);
      return returno(false, `Expressão de cron inválida: ${expression}`);
    }

    if (!globalThis.cronInstances[this.userId]) {
      globalThis.cronInstances[this.userId] = {};
    }

    if (globalThis.cronInstances[this.userId][cronName]) {
      Logs.error('CronManager addJob', `Job '${cronName}' já existe para o usuário ${this.userId}`);
      return returno(false, `Job '${cronName}' já existe para o usuário ${this.userId}`);
    }

    const wrappedFn = this.executeJobWithArgs(fn, args);
    const scheduledTask = cron.schedule(expression, wrappedFn);

    globalThis.cronInstances[this.userId][cronName] = scheduledTask;

    const jobs = this.loadJobs();
    if (!jobs[this.userId]) {
      jobs[this.userId] = {};
    }

    jobs[this.userId][cronName] = {
      expression,
      fn: fn.toString(),
      args,
      status: "ativo", // Define como ativo ao adicionar
    };
    
    this.saveJobs(jobs);
    
    if (!isStartup) {
      Logs.success('CronManager addJob',`Cron job '${cronName}' adicionado para o usuário ${this.userId}`);
      return returno(true, `Cron job '${cronName}' adicionado para o usuário ${this.userId}`);
    }    
  }

  startJob(cronName: string) {
    const instance = globalThis.cronInstances[this.userId]?.[cronName];
    if (!instance) {
      Logs.error('CronManager startJob', `Job '${cronName}' não encontrado.`);
      return returno(false, `Job '${cronName}' não encontrado.`);
    }

    instance.start();

    // Atualiza o status no JSON
    const jobs = this.loadJobs();
    if (jobs[this.userId] && jobs[this.userId][cronName]) {
      jobs[this.userId][cronName].status = "ativo";
      this.saveJobs(jobs);
    }

    Logs.success('CronManager startJob',`Job '${cronName}' iniciado.`);
    return returno(true, `Job '${cronName}' iniciado.`);
  }

  stopJob(cronName: string) {    
    const instance = globalThis.cronInstances[this.userId]?.[cronName];    
    
    if (!instance) {
      Logs.error('CronManager', `Job '${cronName}' não encontrado.`);
      return returno(false, `Job '${cronName}' não encontrado.`);
    }
    const jobs = this.loadJobs();
    
    // se ja estiver inativo, nao precisa parar
    if(jobs[this.userId][cronName].status === "inativo") {
      return returno(true, `Job '${cronName}' já está inativo.`);
    }
    instance.stop();

    // Atualiza o status para inativo no JSON    
    if (jobs[this.userId] && jobs[this.userId][cronName]) {
      jobs[this.userId][cronName].status = "inativo";
      this.saveJobs(jobs);
    }

    Logs.success('CronManager stopJob',`Job '${cronName}' parado.`);
    return returno(true, `Job '${cronName}' parado.`);
  }

  removeJob(cronName: string) {
    const instance = globalThis.cronInstances[this.userId]?.[cronName];
    if (!instance) {
      Logs.error('CronManager removeJob', `Job '${cronName}' não encontrado.`);
      return returno(false, `Job '${cronName}' não encontrado.`);
    }

    instance.stop();
    delete globalThis.cronInstances[this.userId][cronName];

    const jobs = this.loadJobs();
    if (jobs[this.userId]) {
      delete jobs[this.userId][cronName];
      if (Object.keys(jobs[this.userId]).length === 0) {
        delete jobs[this.userId]; // Remove o usuário se não houver mais jobs
      }
    }

    this.saveJobs(jobs);

    Logs.success('CronManager removeJob',`Job '${cronName}' removido.`);

    return returno(true, `Job '${cronName}' removido.`);
  }
}


// Restaura os cron jobs do banco de dados
export const restoreCrons = async () => {   
  try {
      if (!fs.existsSync(CRON_DB_PATH)) {
          Logs.error('CronManager restoreCrons', 'Nenhum cron salvo encontrado.');
          return;
      }

      // Lê e parseia o JSON
      const storedCrons = JSON.parse(fs.readFileSync(CRON_DB_PATH, 'utf-8')) || {};
      if(!storedCrons) return;

      Object.keys(storedCrons).forEach((userId) => {
          globalThis.cronInstances[userId] = globalThis.cronInstances[userId] || {};

          Object.keys(storedCrons[userId]).forEach((jobName) => {
              const job = storedCrons[userId][jobName];
              
              if(globalThis.cronInstances[userId][jobName]){
                throw new Error(`Job '${jobName}' já existe para o usuário ${userId}`);
              }

              if (!job.expression || !job.fn) {
                  Logs.error('CronManager restoreCrons', `Erro ao restaurar job '${jobName}': dados inválidos.`);
                  return;
              }

              try {
                  // Converte a string da função para função executável
                  const jobFunction = eval(`(${job.fn})`);

                  if (typeof jobFunction !== 'function') {
                      Logs.error('CronManager restoreCrons', `O código salvo para '${jobName}' não é uma função válida.`);
                      return;
                  }
                  const wrapperfn=()=>jobFunction(...job.args);

                  // Inicia o cron job
                  const scheduledTask = schedule(job.expression, wrapperfn,{
                    timezone: 'America/Sao_Paulo',
                    runOnInit: false,
                    scheduled: false,
                  });
                  if(job.status === "ativo"){ 
                    scheduledTask.start();
                  }
                  globalThis.cronInstances[userId][jobName] = scheduledTask;

                  Logs.success('CronManager restoreCrons', `Job '${jobName}' restaurado e iniciado para '${userId}'!`);

              } catch (error) {
                  Logs.error('CronManager restoreCrons', `Erro ao processar job '${jobName}':${error}` );
              }
          });
      });

  } catch (error) {
    Logs.error('CronManager restoreCrons', `Erro ao carregar os crons: ${error}`);
  }
}

restoreCrons(); // start restore jobs