import { PrismaClient } from "../generated/prisma/client";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import ENV from "./ENV";


const adapter = new PrismaMariaDb({
    host:ENV.DB_HOST,
    port: Number(ENV.DB_PORT),
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
});


const prisma = new PrismaClient({
    adapter,
    omit:{
        
        user:{
            password:true
        }
    }
});


export default prisma;