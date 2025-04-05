'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import WhatsappMessage from "@/services/evolution/ev-evolution"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllUsers, updateUserRole, deleteUser, updateUserStatus } from "@/app/actions/userActions"
import Link from "next/link"


export default function ServerIntegracoes() {  

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard do Servidor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       
          {data.map((item, index) => (
            <a href={item.url} target="_blank" key={index}>
              <Card className="flex flex-col gap-4">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
              </Card>
            </a>
          ))}

        </div>
    </div>
  )
}

const data = [
  {
    title: "Painel Banco de Dados",
    url: "http://localhost:8082",
  },
  {
    title: "Evolution",
    url: "http://localhost:8080/manager/",
  },
  {
    title: "Evolution Postman",
    url: "https://www.postman.com/agenciadgcode/evolution-api/overview",
  },
  {
    title: "Evolution Documentação",
    url: "https://doc.evolution-api.com/v2/pt/get-started/introduction",
  },
  
]