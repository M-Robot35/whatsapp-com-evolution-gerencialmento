'use client'
import { useState } from "react";
import InstanceWebhook from "./wa-webhook";
import InstanceSettings from './wa-settings';
import InstanceProxy from "./wa-proxy";
import InstanceGroup from "./wa-group";
import InstanceProfile from "./wa-profile";
import InstanceSchundlerWhatsapp from "./wa-schundler";

export interface IIinstaceParams {
  instanceName:string
  apiKey:string
}

export default function InstanciasTabs({apiKey, instanceName}:IIinstaceParams) {  
  const [activeTab, setActiveTab] = useState("profile");
  // const tabName:string[]=["profile", "grupos", "contacts", "proxy",  "webhook", "settings"]  

  const conteudos:Record<string, JSX.Element>= {
      profile: <InstanceProfile  instanceName={instanceName}  apikey={apiKey}/>,
      schundler: <InstanceSchundlerWhatsapp  instanceName={instanceName}  apikey={apiKey}/>,
      grupos: <InstanceGroup  instanceName={instanceName}  apikey={apiKey}/>,
      proxy: <InstanceProxy apiKey={apiKey} instanceName={instanceName}/>,
      webhook: <InstanceWebhook apikey={apiKey} instanceName={instanceName}  />,
      settings: <InstanceSettings apiKey={apiKey} instanceName={instanceName}/>,
  }
  const tabName:string[]=Object.keys(conteudos)

  return (
    <div className="mt-4">

      {/* Navegação das Abas */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          
          {tabName.map((tab) => (
            <li key={tab} className="me-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === tab ? "border-blue-500 text-blue-500" : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(tab)}
                type="button"
                role="tab"
                aria-controls={tab}
                aria-selected={activeTab === tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Conteúdo das Abas */}
      <div>
        {tabName.map((tab) => (
          <div
            key={tab}
            className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === tab ? "" : "hidden"}`}
            id={tab}
            role="tabpanel"
            aria-labelledby={`${tab}-tab`}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {
                conteudos[tab]
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

