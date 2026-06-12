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
    JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET,
    JWT_RESET_PASSWORD_EXPIRES_IN: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,

    // Mailer
    MAILER_HOST: process.env.SMTP_HOST,
    MAILER_PORT: process.env.SMTP_PORT,
    MAILER_SECURE: process.env.SMTP_SECURE === "true",
    MAILER_USER: process.env.SMTP_USER,
    MAILER_PASSWORD: process.env.SMTP_PASS,
    MAILER_FROM: process.env.SMTP_FROM,
}

export default ENV;