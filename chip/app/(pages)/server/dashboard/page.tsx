'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import WhatsappMessage from "@/services/evolution/ev-evolution"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllUsers, updateUserRole, deleteUser, updateUserStatus } from "@/app/actions/userActions"

interface DashboardStats {
  totalInstances: number
  totalUsers: number
  activeInstances: number
  pendingInstances: number
  connectionStats: {
    open: number
    closed: number
    connecting: number
  }
}

interface User {
    id: string;
    name: string | null;
    email: string;
    password: string;
    emailVerified: Date | null;
    image: string | null;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    createdAt: Date;
    updatedAt: Date;
}

export default function ServerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInstances: 0,
    totalUsers: 0,
    activeInstances: 0,
    pendingInstances: 0,
    connectionStats: {
      open: 0,
      closed: 0,
      connecting: 0
    }
  })

  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function loadStats() {
      try {
        const instances = await WhatsappMessage.instancia.instancia_all()
        
        const connectionStats = instances.reduce((acc, inst) => {
          acc[inst.connectionStatus] = (acc[inst.connectionStatus] || 0) + 1
          return acc
        }, { open: 0, closed: 0, connecting: 0 })

        const activeInstances = instances.filter(inst => inst.connectionStatus === 'open').length
        const pendingInstances = instances.filter(inst => inst.connectionStatus === 'connecting').length
        const totalUsers = instances.reduce((acc, inst) => acc + (inst._count?.Contact || 0), 0)

        setStats({
          totalInstances: instances.length,
          totalUsers,
          activeInstances,
          pendingInstances,
          connectionStats
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      }
    }

    loadStats()
  }, [])

  useEffect(() => {
    async function loadUsers() {
      try {
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (error) {
        console.error('Erro ao carregar usuários:', error)
      }
    }
    loadUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole)
      // Atualiza a lista de usuários
      setUsers(Prev => {
        return Prev.map(user => 
            user.id === userId ? { ...user, role: newRole as 'USER' | 'ADMIN' | 'SUPER_ADMIN' } : user
          ) 
      })
     
    } catch (error) {
      console.error('Erro ao atualizar role:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return

    try {
      await deleteUser(userId)
      setUsers(users.filter(user => user.id !== userId))
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
    }
  }

  const handleToggleBlock = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
    try {
      await updateUserStatus(userId, newStatus)
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ))
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  return (
    <div className="container p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard do Servidor</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Instâncias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInstances}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instâncias Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeInstances}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instâncias Conectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.connectionStats.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instâncias Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingInstances}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instâncias Fechadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.connectionStats.closed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>{user.role}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">admin</SelectItem>
                          <SelectItem value="USER">user</SelectItem>
                          <SelectItem value="SUPER_ADMIN">super_admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className={user.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleBlock(user.id, user.status)}
                        >
                          {user.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Deletar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}