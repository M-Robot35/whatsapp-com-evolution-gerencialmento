import jwt from "jsonwebtoken"

type jwtType = {
    id:string | number
}

class Jwt {
    private secretKey = process.env.NEXTAUTH_SECRET as string
    
    async tokenGenerate( data:Record<string, any> | object ):Promise<string> {              
                         
       
        const gerate = await jwt.sign({
            ...data
          }, this.secretKey, { expiresIn: '8h' });
        
        return gerate
    }

    async tokenValidate( token:string ):Promise<jwtType|null>{          
        
        const { id }:any =  jwt.verify(token, this.secretKey );
        return id 
    }
}
export default new Jwt()