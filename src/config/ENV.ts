import "dotenv/config";

const ENV = {
    PORT: process.env.PORT,

    // Database
    DB_USER: process.env.DATABASE_USER,
    DB_PASSWORD: process.env.DATABASE_PASSWORD,
    DB_NAME: process.env.DATABASE_NAME,
    DB_HOST: process.env.DATABASE_HOST,
    DB_PORT: process.env.DATABASE_PORT,


    // Redis    
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,



    // Auth
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    SESSION_SECRET: process.env.SESSION_SECRET,
}

export default ENV;