import { PrismaClient } from "../generated/prisma/client";





const prisma = new PrismaClient({
    omit:{
        
        user:{
            password:true
        }
    }
});


export default prisma;