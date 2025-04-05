'use client';

import InstanciasTabs from "@/components/my-components/wa-instancia-tabs"
import DeleteInstancia from "@/components/my-components/wa-instancia-delete"
import LogoutInstance from "@/components/my-components/wa-instancia-logout"
import InstanciaConnect from "@/components/my-components/wa-instancia-connect"
import { formatNumber, statusConnection } from "../../page"
import { Logs } from "@/app/core/system"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { getInstanceNameAction, getInstaceDatabase } from "@/app/actions/instanceAction"
import Loading from "@/components/my-components/loading";


interface instaceOptions {
  params: {
    name: string
    apikey: string
  }
}

export default function InstanceOptions({ params }: instaceOptions) {
  const [instanciaATUAL, setInstanciaATUAL] = useState<any>(null);
  const [loadBase64Instance, setLoadBase64Instance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const instancia = await getInstanceNameAction(params.apikey)
        
        if(!instancia){
          redirect('/admin/instancias')
          return
        }
        setInstanciaATUAL(instancia);
        const instanciaDB = await getInstaceDatabase(instancia.name)        
        setLoadBase64Instance(instanciaDB!.baseCode)        
        
      } catch (error) {
        Logs.error('InstanceOptions', `Erro ao carregar dados da instância: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };   

    loadData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loading /></div>;
  }

  if (!instanciaATUAL) {
    return null;
  }

  const { ownerJid, connectionStatus, _count } = instanciaATUAL;

  return (
    <div className="container bg-muted/50 p-4 rounded-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Data Instância */}
        <div className="rounded-sm border p-4 relative">
          <div className="flex justify-between items-center">
            <div className="font-bold">Instância:</div>
            <span className="text-gray-500">{instanciaATUAL.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="font-bold">Número:</div>
            <span className="text-sm text-gray-500 whitespace-nowrap">{formatNumber(ownerJid)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="font-bold">Status:</div>
            <span className="text-sm text-gray-500">{statusConnection(connectionStatus)}</span>
          </div>

          
        </div>

        {/* Data Conteudo instancia */}
        <div className="rounded-sm border p-4 ">
          <div className="flex justify-between items-center">
            <div className="font-bold">Contatos:</div>
            <span className="text-sm text-gray-500">{_count.Contact}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="font-bold">Grupos:</div>
            <span className="text-sm text-gray-500">{_count.Chat}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="font-bold">Mensagens:</div>
            <span className="text-sm text-gray-500">{_count.Message}</span>
          </div>
        </div>

        {instanciaATUAL.connectionStatus == 'connecting' ? (
          <div className="flex justify-center">
            <DeleteInstancia name={instanciaATUAL.name} />
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-2 rounded-sm border p-4">
            <InstanciaConnect instanceName={instanciaATUAL.name} />
            <LogoutInstance name={instanciaATUAL.name} />
            <DeleteInstancia name={instanciaATUAL.name} />
          </div>
        )}
      </div>

      {/* TABS */}
      {instanciaATUAL.connectionStatus != 'connecting' ? (
        <InstanciasTabs instanceName={params.name} apiKey={params.apikey} />
      ) : (
        <div className="flex justify-center mt-4">
          <div className="w-[250px]">
            <h3 className="mb-2">Escaneie o QrCode</h3>
            {loadBase64Instance  && (
              <img src={loadBase64Instance} alt="qrCode" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}



