import { PrismaClient } from "../generated/prisma/client";

<<<<<<< HEAD


=======
>>>>>>> faculty-module


const prisma = new PrismaClient({
    omit:{
        
        user:{
            password:true
        }
    }
});


export default prisma;