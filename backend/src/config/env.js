const { configDotenv } =require( "dotenv");

configDotenv();

export const config={
    db:{
        DB_USER_NAME:process.env.DB_USER_NAME,
        DB_HOST:process.env.DB_HOST,
        DATABASE_NAME:process.env.DATABASE_NAME, 
        DB_PORT: process.env.DB_PORT,
        DB_PASS: process.env.DB_PASS,
    },
    PORT:process.env.PORT,
    redis:{
        REDIS_URI:process.env.REDIS_URI
    }
}