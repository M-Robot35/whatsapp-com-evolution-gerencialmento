'use client'

import { Label } from "../ui/label"
import AvatarImageUser from "./avatar"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import SendMessage from "./wa-send-message"
import { TypeGroupParticipants } from "@/services/evolution/evoluitonTypes/instances-type"
import { Checkbox } from "@/components/ui/checkbox"
import { styleUp } from "@/app/core/constants/style"
import { Switch } from "@/components/ui/switch"
import { fetchParticipantsGenerator } from "@/app/actions/group-process-action"
import { toast } from "sonner"
const { border } = styleUp


export interface IGroup {
    announce: boolean
    creation: number
    desc: string
    descId: string
    id: string
    owner: string
    pictureUrl: string | null
    restrict: boolean
    size: number
    subject: string
    subjectOwner: string
    subjectTime: number
}

const typeEnvioMensagem= [ 'Grupos', 'Participantes', 'Grupos e Participantes']


export default function TableGroup({apikeyy, instanceNamee, grupos }:{apikeyy:string, instanceNamee:string, grupos:IGroup[] }){
    const [inputGroups, seInputgroups]= useState<IGroup[]>(grupos) // input all groups    
    const [usersSend, setUsersSend]=useState<string[]>([]) // ids dos grupos selecionados
    const [participantsAllFilter, setParticipantsAllFilter]= useState<TypeGroupParticipants|null>(null) // usuarios filtrados
    const [allParticipants, setAllParticipants]= useState<TypeGroupParticipants|null>(null)  // todos os usuarios dos grupos    
    const [enviarMensagemPara, setEnviarMensagemPara]= useState<string[]>([])    
    const [groupFilter, setGroupFilter]= useState<string[]>([])  // grupo filtrado    
    const [activeParticipants, setActiveParticipants]= useState<boolean>(false)
    const [carregando, setCarregando]= useState<boolean>(false)  // loading
    const [selectAll, setSelectAll]= useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState(typeEnvioMensagem[0]); // escolher para que tipo de usuarios você vai enviar as mensagens


    function fnFilter(filterMM: string) {  
        setGroupFilter(prevState => {
            if (prevState.includes(filterMM)) {
                return prevState.filter(item => item.toLowerCase() !== filterMM.toLowerCase());
            } else {
                return [...prevState, filterMM];
            }
        });
    
        setParticipantsAllFilter(null);
    }

    // filtra os participantes
    useEffect(() => {
        if(!activeParticipants){
            setParticipantsAllFilter(null);            
            return
        }

        if (groupFilter.length === 0 || !allParticipants) {
            setParticipantsAllFilter(null);
            return;
        }

        const partFilterUp: TypeGroupParticipants = { participants: [] };        

        groupFilter.forEach(f => {
            let filtered= [];
    
            switch (f.toLowerCase()) {
                case 'foto':
                    filtered = allParticipants.participants.filter(item => item.imgUrl);
                    break;
    
                case 'nome':
                    filtered = allParticipants.participants.filter(item => item.name);
                    break;
            }
            
            partFilterUp.participants.push(...filtered);
        });
        
        partFilterUp.participants = Array.from(
            new Map(partFilterUp.participants.map(p => [p.id, p])).values()
        );
        setParticipantsAllFilter(partFilterUp);
    }, [activeParticipants, groupFilter, allParticipants]);
    
    // buscar participantes
    useEffect(() => {    
        if (!activeParticipants) {
            setAllParticipants(null);
            return;
        }
    
        let isMounted = true;   
        
        const fetchData = async () => {
            setCarregando(true);
            const generator = await fetchParticipantsGenerator(usersSend, instanceNamee, apikeyy);

            for await (const participants of generator) {
                if (isMounted) {
                    setAllParticipants(participants);
                }
            }
            setCarregando(false);
        };

        fetchData();

        return () => {
            isMounted = false;
        };

    }, [activeParticipants]);

    


    const choice= (user:string)=>{        
        if(!usersSend.includes(user)){
            setUsersSend([...usersSend, user])
            return
        }
        setUsersSend(usersSend.filter(item => item != user))
    }

    function selectAllFn(){        

        if(selectAll){
            setUsersSend([])
        }else{
            setUsersSend([...inputGroups!.map(item => item.id)])
        }
        setSelectAll(!selectAll)
    }

    function verifySelectSendMessage(){
        switch(selectedOption.toLowerCase()){
            case 'grupos':
                setEnviarMensagemPara([...usersSend])
                return

            case 'Participantes'.toLowerCase():                
                if(participantsAllFilter){
                    const participId= participantsAllFilter.participants.map(item=> item.id)                    
                    setEnviarMensagemPara([...participId])
                    return
                }

                if(allParticipants){
                    const participId= allParticipants.participants.map(item=> item.id)                    
                    setEnviarMensagemPara([...participId])
                    return
                }                
                setEnviarMensagemPara([])
                return

            case 'grupos e Participantes'.toLowerCase():
                if(participantsAllFilter){
                    const participId= participantsAllFilter.participants.map(item=> item.id)                    
                    setEnviarMensagemPara([...usersSend, ...participId])
                    return
                }

                if(allParticipants){
                    const participId= allParticipants.participants.map(item=> item.id)                    
                    setEnviarMensagemPara([...usersSend, ...participId])
                    return
                }                
                setEnviarMensagemPara([...usersSend])
                return

            default:
                return setEnviarMensagemPara([])
        }
    }

    useEffect(()=>{
        verifySelectSendMessage();

    },[selectedOption, participantsAllFilter, usersSend, allParticipants])
        

    return (
        <div className="grid grid-cols-1 gap-4">  
            
            {/* CHOISE ENV MESSAGE */}
            <section className="flex flex-col gap-2 border border-gray-900 p-2 rounded-sm">
                <div>
                    <h1>Enviar mensagem para:</h1>
                </div>
               <div className="flex flex-row gap-2">
                    
               {typeEnvioMensagem.map((item, index) => (
                    <div key={index} className="flex items-center mb-4 gap-2">
                        <input 
                            id={item}
                            type="radio"
                            name="envioMensagem" 
                            value={item}
                            checked={selectedOption === item}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label 
                            htmlFor={item}
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {item}
                        </label>
                    </div>
                ))}                 

               </div>
            </section>


            <section className="grid grid-cols-1 md:grid-cols-3 gap-2 relative overflow-x-auto  shadow-md sm:rounded-lg  border border-gray-900 p-2">
                
                {/* TODOS GRUPOS */}
                <div className="col-span-2 overflow-auto overflow-y-auto max-h-[500px]">

                    <Label className="p-2" htmlFor="email">Todos os Grupos - [ {grupos.length} ]</Label>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            className="border-2 border-gray-900"
                                            id="terms"
                                            disabled={carregando}
                                            checked={selectAll}
                                            onCheckedChange={()=>{ selectAllFn()}}
                                        />
                                    </div>
                                </th>
                                {
                                    headers.map((header, index)=>{
                                        return (
                                            <th key={index} scope="col" className="px-6 py-3">
                                                {header}
                                            </th>
                                        )
                                    })
                                }                        
                            </tr>
                        </thead>

                        <tbody>
                            {
                                inputGroups.map((grupo, index)=>{
                                    return (
                                        <>
                                            <tr key={index} className=" bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="w-4 p-4">                                        
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox 
                                                            className="border-2 border-gray-900"
                                                            id={index.toLocaleString()}
                                                            disabled={carregando}
                                                            checked={usersSend.includes(grupo.id)}
                                                            onCheckedChange={()=>{choice(grupo.id)}}
                                                        />
                                                    </div>
                                                </td>                                        
                                            
                                                <th scope="row" className="  font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    <Label htmlFor={index.toLocaleString()} >{grupo.subject}</Label>
                                                </th>
                                                
                                                    <td className=" ">
                                                        {grupo.pictureUrl? <AvatarImageUser urlImage={grupo.pictureUrl}/>: <p className="text-nowrap">Sem Imagem</p>}
                                                    </td>                                               
                                                    
                                                    <td className="">
                                                        {grupo.size}
                                                    </td>
                                                
                                                <td className=" ">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <Button variant={'outline'}>...</Button>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent>
                                                            <DropdownMenuLabel>Grupo {grupo.subject}</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />

                                                            <DropdownMenuItem>
                                                                Teste
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>Participantes</DropdownMenuItem>
                                                            <DropdownMenuItem>Team</DropdownMenuItem>
                                                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                                                        </DropdownMenuContent>

                                                    </DropdownMenu>                                            
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })
                            }                   
                        </tbody>
                    </table>

                </div>

                <div className="mt-4 col-span-1">
                    <SendMessage apikey={apikeyy} instanceName={instanceNamee} users={enviarMensagemPara} className="min-h-[250px]"/>
                </div>

            </section>
            
            {/* PARTICIPANTES */}
            <section className="flex flex-col flex-wrap border p-4 rounded-sm border-gray-900 ">                
               
                <div className="mb-4">
                    <div className="flex flex-row gap-4">
                        <h1 className="mb-4">participantes {`[ ${participantsAllFilter?.participants.length ?
                            participantsAllFilter?.participants.length : 
                            allParticipants?.participants.length?? 0 } ]`
                        }
                        </h1>
                        {
                            carregando && (
                                <span className="border-2 border-yellow-600 w-[15px] h-[15px] rounded-[50%] border-b-red-800 animate-spin"></span>
                            )
                        }
                    </div>
                    
                    
                    <div className="flex flex-row flex-wrap gap-2">
                        <div>
                            <div className="flex items-center space-x-2">
                                    <Switch 
                                        id={`participantes`}
                                        className={`${border}`}
                                        checked={ activeParticipants}
                                        onCheckedChange={()=> { setActiveParticipants(!activeParticipants) }}
                                    />
                                    <Label 
                                        htmlFor={`participantes`}>
                                            Active participantes
                                    </Label>
                            </div>
                        </div>
                        {
                            activeParticipants && (
                                optionsFilter.map((item, index)=>{
                                    return <div key={index} className="flex items-center space-x-2">
                                    <Switch 
                                        className={`${border}`}
                                        id={item.name}
                                        name={item.name}
                                        checked={ groupFilter.includes( item.name )}
                                        onCheckedChange={()=> { fnFilter(item.name) }}
                                    />
                                    <Label 
                                        htmlFor={item.name}>
                                            {item.name}
                                    </Label>
                                </div>
                                })
                            )
                        }                        
                        
                    </div>

                </div>

                {/* CARREGAR PARTICIPANTES */}
                <div className="flex flex-row flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                    {
                        participantsAllFilter ?
                            participantsAllFilter && 
                            participantsAllFilter.participants.map((p, index)=>{
                                return <div key={index} className="flex flex-row flex-wrap w-fit  border border-gray-900 rounded-sm px-2 w-max[100px] overflow-x-hidden">
                                    <AvatarImageUser urlImage={ p.imgUrl? p.imgUrl: '' }/>
                                    <div className="flex align-middle items-center">
                                        <p className={`text-sm ${p.name? 'text-green-500': 'text-gray-500'}`}>{ p.name? p.name: 'sem nome' }</p>
                                    </div>
                                </div>
                            }):

                            allParticipants && 
                            allParticipants.participants.map((p, index)=>{
                            return <div key={index} className="flex flex-row flex-wrap w-fit  border border-gray-900 rounded-sm px-2 w-max[100px] overflow-x-hidden">
                                <AvatarImageUser urlImage={ p.imgUrl? p.imgUrl: '' }/>
                                <div className="flex align-middle items-center">
                                    <p className={`text-sm ${p.name? 'text-green-500': 'text-gray-500'}`}>{ p.name? p.name: 'sem nome' }</p>
                                </div>
                            </div>
                        })
                    }
                </div>
            </section>
        </div>
    )
}

const optionsFilter= [
    {
        name:'Foto'
    },
    {
        name:'Nome'
    }
]

const headers= [
    'name',
    'imagem',
    'contatos',
    'action'
]