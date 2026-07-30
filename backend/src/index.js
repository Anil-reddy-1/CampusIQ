import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import { connectRedis, disconnectRedis, redisClient } from "./config/redis.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;
//middleware
app.use(express.json());
app.use(cors());

//routes

//errorhandling middleware

//testing postgress connection
app.get("/", async (req, res) => {
  const result = await pool.query("select current_database()");
  res.send(`the database name is : ${result.rows[0].current_database} from docker `);
});


process.on('SIGINT',async ()=>{
 await disconnectRedis();
})

//server running
app.listen(port, async () => {
  console.log("server running on port " + port);
  await connectRedis();
});
