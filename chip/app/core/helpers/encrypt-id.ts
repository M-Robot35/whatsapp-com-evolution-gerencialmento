import FileMestre from '../helpers/files'
import { Logs } from '../system'
import path from 'path'
import fs from 'fs'
import crypto from 'node:crypto'



// Defina sua chave secreta (deve ter 32 bytes) e o IV (deve ter 16 bytes)
const wordSecret:string= 'eqelçelf6548613e4qqeheklqheeq'
const pathLog = path.join(__dirname, '../database/store/encript-id/encrypId.json')
const secretKey = crypto.createHash('sha256').update(wordSecret).digest(); 
const iv = crypto.randomBytes(16);

//----------------------------------------------
// encrypt password
//----------------------------------------------
function encrypt(text:any) {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  Logs.success('encrypt-id', 'encrypt success')
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}


const findEncryptedDataByKey = (obj: Record<string, any>, encryp:string) => {
  for (const key in obj) {
    if (obj[key].encryptedData === encryp) {
      return obj[key] ;
    }
  }
  return null; // Se não encontrar o encryptedData
};


//----------------------------------------------
// desencryptar os dados
//----------------------------------------------
export function decrypt(encrypted:string) {
  const read= readFromFile()
  const decrypData= findEncryptedDataByKey(read, encrypted)

  try{
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      secretKey,
      Buffer.from(decrypData.iv, 'hex')
    );
    let decrypted = decipher.update(decrypData.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    Logs.success('decrypt-id', 'decrypted success')
    return decrypted;

  }catch(error){
    Logs.error('decrypt-id', `decrypt --- ${JSON.stringify(error)}`)
  }
}


//----------------------------------------------
// le arquivo json com hash
//----------------------------------------------
function readFromFile(): {[key:string]: {iv:string, encryptedData:string}} {
    if (fs.existsSync(pathLog)) {
      const file= FileMestre.readyJson(pathLog)
      if(file) return file
    }
    FileMestre.writeJson(pathLog, {})
    return {}; // Retorna um objeto vazio se o arquivo não existir
}


//----------------------------------------------
// salva arquivo
//----------------------------------------------
function writeToFile( data:any) {
    FileMestre.writeJson(pathLog, data)
}


//----------------------------------------------
// função principal
//----------------------------------------------
export function getOrGenerateHash(id:any) {
    // Verificar se o diretório existe, se não, cria
    if (!fs.existsSync(path.dirname(pathLog))) {
        FileMestre.writeJson(pathLog, {})
        Logs.success('getOrGenerateHash', 'criado um novo diretorio') 
    }
    
    // Lê o arquivo e verifica se o ID já existe
    let data = readFromFile();

    
    if (data[id]) {
      // Retorna o hash existente
      return data[id];
    } 

    // Gera o hash, salva e retorna
    const hash = encrypt(id.toString());
    data[id] = hash;
    writeToFile( data);
    return hash;
}