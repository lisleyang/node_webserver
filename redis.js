const redis = require('redis');

const redisClient = redis.createClient(6379, '127.0.0.1')
redisClient.on('error',err=>{
    console.error(err)
})

redisClient.set('myname','zhangsan2',redis.print)   //执行完以后打印结果
redisClient.get('myname',(err,val)=>{
    if(err){
        console.error(err)
    }

    redisClient.quit()
})