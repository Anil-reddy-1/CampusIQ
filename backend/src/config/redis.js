const  {createClient} =require('redis');
const  { config }= require('./env.js');


export const redisClient = createClient({
    url:config.redis.REDIS_URI
}) 
redisClient.on('connect',()=>{
    console.log("connected to redis ");
})

redisClient.on('ready',()=>{
    console.log("redis client ready ");
})

redisClient.on('disconnected',()=>{
    console.log("redis disconnected");
})

export const connectRedis=async ()=>{
    if(!redisClient.isOpen){
        await redisClient.connect();
    }
    console.log("redis connected ping ",await redisClient.ping());
}

export const disconnectRedis =async ()=>{
    if(redisClient.isOpen){
       await  redisClient.quit();
    }
    console.log("redis disconnected ");
}



