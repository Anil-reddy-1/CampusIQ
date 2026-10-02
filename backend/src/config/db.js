const  pkg =require("pg");
const  config  =require("./env.js");

const { Pool } = pkg;


const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      user: config.db.DB_USER_NAME,
      host: config.db.DB_HOST,
      database: config.db.DATABASE_NAME,
      password: config.db.DB_PASS,
      port: config.db.DB_PORT,
    };

if (process.env.DB_SSL === "true" || process.env.DATABASE_URL?.includes("sslmode=") || process.env.NODE_ENV === "production") {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);


pool.on("connect", () => {
  console.log("connection pool established with the database");
});

module.exports= pool;
