'use server'
import  UserModel  from '@/database/db-model/user-model'

export const getAllUsers = async () => {
    const allUsers = await UserModel.findAll()
    return allUsers
}

export const updateUserRole = async (userId: string, newRole: string) => {
    await UserModel.update(userId, {role: newRole.toUpperCase() as 'USER' | 'ADMIN' | 'SUPER_ADMIN'})
}

export const deleteUser = async (userId: string) => {
    await UserModel.delete(userId)
}

export const updateUserStatus = async (userId: string, newStatus: string) => {
    await UserModel.update(userId, {status: newStatus as 'ACTIVE' | 'BLOCKED'})
}
