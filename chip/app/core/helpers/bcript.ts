import bcrypt from 'bcryptjs'

const bcriptHash = {
    compare: async (password: string, passHash: string): Promise<boolean> => {
        try {
            return await bcrypt.compare(password, passHash)
        } catch (error) {
            console.error('Error comparing passwords:', error)
            return false
        }
    },

    passHash: async (password: string): Promise<string> => {
        try {
            const salt = await bcrypt.genSalt(10)
            return await bcrypt.hash(password, salt)
        } catch (error) {
            console.error('Error hashing password:', error)
            throw error
        }
    }
}

export default bcriptHash