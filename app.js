const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')
const qs = require('querystring')

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

const serverHandler = (req,res)=>{
    //设置返回格式
    res.setHeader('Content-type','application/json')

    //获取path
    const url = req.url;
    req.path = url.split('?')[0];

    //解析query
    req.query  = qs.parse(url.split('?')[1])
    getPostData(req).then(postData=>{
        req.body = postData

        //处理blog路由
        const blogResult = handleBlogRouter(req,res )
        if(blogResult){
            blogResult.then(blogData=>{
                res.end(JSON.stringify(blogData))
            })
            return;
        }

        //处理user路由
        const userResult = handleUserRouter(req,res )
        if(userResult){
            userResult.then(userData=>{
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