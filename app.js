const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')
const qs = require('querystring')
const {get , set} = require('./src/db/redis')

// let SESSION_DATA = {}

const getPostData = req=>{
    const promise = new Promise((resolve,reject)=>{
        if(req.method !== 'POST'){
            resolve({})
            return
        }
        if(req.headers['content-type'] !== 'application/json'){
            resolve({})
            return;
        }

        let postData = '';
        req.on('data',chunk=>{
            postData += chunk.toString()
        })
        req.on('end', ()=>{

            if(!postData){
                resolve({})
                return;
            }
            resolve(JSON.parse(postData));
        })
    })
    return promise
}
const getCookieExpires = ()=>{
    const d = new Date()
    d.setTime(d.getTime() + 24*60*60*1000)
    return d.toGMTString()
}

const serverHandler = (req,res)=>{
    //设置返回格式
    res.setHeader('Content-type','application/json')

    //获取path
    const url = req.url;
    req.path = url.split('?')[0];

    //解析query
    req.query  = qs.parse(url.split('?')[1])

    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(item => {
        if(!item) return;

        const arr = item.split('=');
        const key = arr[0];
        const val = arr[1];

        req.cookie[key] = val;
    });

    // //解析session
    // let needSetCookie = false;
    // let userId = req.cookie.userid;

    // //首次登陆，cookie中没有userId，随机起一个userId，Session_DATA上此userId挂在为空
    // //去数据库查询登陆，通过设置req.session设置SESSION_DATA[userId]
    // //将userId返回给浏览器
    // //登陆完以后再进来 因为cookie中已经有userId了,所以直接去SESSION_DATA去找对应的userId，拿用户信息
    // if(userId){
    //     if(!SESSION_DATA[userId]){
    //         SESSION_DATA[userId] = {};
    //     }
    // }else{
    //     needSetCookie = true;
    //     userId = `${Date.now()}_${Math.random()}` //保证不重复
    //     SESSION_DATA[userId] = {};
    // }
    // req.session = SESSION_DATA[userId]; //session是个对象

    //用redis重写session这块儿的逻辑
    //不管登没登录，第一次访问的时候就给他种userId，然后在redis中存储对应的信息为空对象
    //如果是已经登陆的状态,session中有值，直接拿过来放到req.session上
    //如果是未登陆状态，访问登陆接口，登陆接口会向redis中种session；如果是其他接口则会因为没有session报错
    //这儿是个中间件，执行完才会到后面陆游
    let needCookie = false;
    let userId = req.cookie.userid;
    if(!userId){
        needCookie = true;
        userId = `${Date.now()}_${Math.random()}` //保证不重复
        set(userId,{})
    }
    //获取session
    req.sessionId = userId
    get(userId).then(sessionData=>{
        if(sessionData == null){
            //初始化redis中的session值
            set(req.sessionId,{})
            //设置session
            req.session = {}
        }else{
            req.session = sessionData;
        }

        return getPostData(req)
    })
    .then(postData=>{
        req.body = postData

        //处理blog路由
        const blogResult = handleBlogRouter(req,res )
        if(blogResult){
            blogResult.then(blogData=>{
                if(needCookie){
                    //cookie设置httpOnly以后，前端就不能改了
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }

                res.end(JSON.stringify(blogData))
            })
            return;
        }

        //处理user路由
        const userResult = handleUserRouter(req,res )
        if(userResult){
            userResult.then(userData=>{
                if(needCookie){
                    //cookie设置httpOnly以后，前端就不能改了
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(userData))
            })
            return;
        }

        //未命中路由返回404
        res.writeHead(404,{
            'Content-type' : 'text-plain'
        })
        res.write('404 not found')
        res.end()
    })
}

module.exports = serverHandler;