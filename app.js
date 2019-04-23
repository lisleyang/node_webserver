const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')
const qs = require('querystring')

let SESSION_DATA = {}

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

    //解析session
    let needSetCookie = false;
    let userId = req.cookie.userid;

    //首次登陆，cookie中没有userId，随机起一个userId，Session_DATA上此userId挂在为空
    //去数据库查询登陆，通过设置req.session设置SESSION_DATA[userId]
    //将userId返回给浏览器
    //登陆完以后再进来 因为cookie中已经有userId了,所以直接去SESSION_DATA去找对应的userId，拿用户信息
    if(userId){
        if(!SESSION_DATA[userId]){
            SESSION_DATA[userId] = {};
        }
    }else{
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}` //保证不重复
        SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId]; //session是个对象

    getPostData(req).then(postData=>{
        req.body = postData

        //处理blog路由
        const blogResult = handleBlogRouter(req,res )
        if(blogResult){
            blogResult.then(blogData=>{
                if(needSetCookie){
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
                if(needSetCookie){
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