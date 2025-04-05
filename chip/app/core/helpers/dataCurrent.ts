
type OptionsType = {
    day: 'numeric' | '2-digit',
    month: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow',
    year: 'numeric' | '2-digit'
}


class DataCurrent {

    /**     * 
     * @returns 
     */
    dataCurrent = ():string =>{
        const data = new Date();
        
        const optionsData: OptionsType = { day: '2-digit', month: '2-digit', year: 'numeric' };    
        
        const dataFormatada = data.toLocaleDateString('pt-BR', optionsData);
        return dataFormatada
    }

    /**
     * 
     * @param isoDate
     * @description formatar data do banco de dados [ dia/mês/Ano ]
     * @returns 
     */
    // Função para formatar a data ISO 8601
    formatarDataISO8601(isoDate:string) {
        // Criar um objeto Date a partir da string ISO 8601
        const date = new Date(isoDate);
    
        // Extrair o dia, mês e ano
        const dia = date.getDate();
        const mes = date.getMonth() + 1; // getMonth() retorna 0-11, então somamos 1
        const ano = date.getFullYear();
    
        // Formatar com dois dígitos para dia e mês
        const diaFormatado = dia.toString().padStart(2, '0');
        const mesFormatado = mes.toString().padStart(2, '0');
    
        // Retornar a data formatada como dia/mês/ano
        return `${diaFormatado}/${mesFormatado}/${ano}`;
    }


    // Função para formatar a data atual no formato dia/mês/ano
    formatarDataAtual() {
        // Criar um objeto Date com a data atual
        const date = new Date();
    
        // Extrair o dia, mês e ano
        const dia = date.getDate();
        const mes = date.getMonth() + 1; // getMonth() retorna 0-11, então somamos 1
        const ano = date.getFullYear();
    
        // Formatar com dois dígitos para dia e mês
        const diaFormatado = dia.toString().padStart(2, '0');
        const mesFormatado = mes.toString().padStart(2, '0');
    
        // Retornar a data formatada como dia/mês/ano
        return `${diaFormatado}/${mesFormatado}/${ano}`;
    }
    
    formatarDataHoraAtual() {
        // Criar um objeto Date com a data e hora atuais
        const date = new Date();
    
        // Extrair o dia, mês, ano, hora e minuto
        const dia = date.getDate();
        const mes = date.getMonth() + 1; // getMonth() retorna 0-11, então somamos 1
        const ano = date.getFullYear();
        const horas = date.getHours();
        const minutos = date.getMinutes();
    
        // Formatar com dois dígitos para dia, mês, horas e minutos
        const diaFormatado = dia.toString().padStart(2, '0');
        const mesFormatado = mes.toString().padStart(2, '0');
        const horasFormatadas = horas.toString().padStart(2, '0');
        const minutosFormatados = minutos.toString().padStart(2, '0');
    
        // Retornar a data e hora formatadas como dia/mês/ano hora:minuto
        return `${diaFormatado}/${mesFormatado}/${ano} ${horasFormatadas}:${minutosFormatados}`;
    }

    /**
     * 
     * @param isoDate 
     * @returns 
     * 
     * @description Formato  [ dia/mês/ano hora:minuto ]
     */
    formatarDataHoraISO8601(isoDate:string) {
        // Criar um objeto Date a partir da string ISO 8601
        const date = new Date(isoDate);
    
        // Extrair o dia, mês, ano, horas e minutos
        const dia = date.getDate();
        const mes = date.getMonth() + 1; // getMonth() retorna 0-11, então somamos 1
        const ano = date.getFullYear();
        const horas = date.getHours();
        const minutos = date.getMinutes();
    
        // Formatar com dois dígitos para dia, mês, horas e minutos
        const diaFormatado = dia.toString().padStart(2, '0');
        const mesFormatado = mes.toString().padStart(2, '0');
        const horasFormatadas = horas.toString().padStart(2, '0');
        const minutosFormatados = minutos.toString().padStart(2, '0');
    
        // Retornar a data e hora formatadas como dia/mês/ano hora:minuto
        return `${diaFormatado}/${mesFormatado}/${ano} ${horasFormatadas}:${minutosFormatados}`;
    }
}

export default new DataCurrent()


//   // Exemplo de uso
//   const dataISO = '2024-05-23T18:30:00Z';
//   const dataHoraFormatada = formatarDataISO8601(dataISO);
//   console.log(dataHoraFormatada); // Saída: "23/05/2024 18:30"