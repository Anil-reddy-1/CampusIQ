import { configDotenv } from "dotenv";
import pkg from "pg";

const { Pool } = pkg;
configDotenv();

const pool = new Pool({
  user: process.env.DB_USER_NAME,
  host: process.env.DB_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.on("connect", () => {
  console.log("connection pool established with the database");
});

export default pool;
