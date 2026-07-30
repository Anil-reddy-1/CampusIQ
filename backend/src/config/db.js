import pkg from "pg";
import { config } from "./env.js";

const { Pool } = pkg;


const pool = new Pool({
  user: config.db.DB_USER_NAME,
  host: config.db.DB_HOST,
  database: config.db.DATABASE_NAME,
  password: config.db.DB_PASS,
  port: config.db.DB_PORT,
});


pool.on("connect", () => {
  console.log("connection pool established with the database");
});

export default pool;
