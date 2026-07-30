const express =require( "express");
const  cors =require( "cors");
const dotenv =require( "dotenv");
const  pool =require( "./config/db.js");
const { connectRedis, disconnectRedis, redisClient } =require( "./config/redis.js");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler.js");
const { success } = require("./utils/response.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;
//middleware
app.use(express.json());
app.use(cors({

}));

//routes


//testing postgress connection
app.get("/", async (req, res) => {
  const result = await pool.query("select current_database()");
  return success(`the database name is : ${result.rows[0].current_database} from postgres `);
});


//errorhandling middleware
app.use(errorHandler);
app.use(notFoundHandler);



process.on('SIGINT',async ()=>{
 await disconnectRedis();
})

//server running
app.listen(port, async () => {
  console.log("server running on port " + port);
  await connectRedis();
});
