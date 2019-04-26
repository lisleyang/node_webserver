const {login} = require('../controller/user')
const {SuccessModel,ErrorModel} = require('../model/resModel.js')
const {get, set} = require('../db/redis')

const handleUserRouter = (req,res)=>{
    const method = req.method;

    if(method == 'GET' && req.path == '/api/user/login'){
        //const {username , password} = req.body;
        const {username, password} = req.query;
        const result = login(username, password);

        return result.then(data=>{
            if(data.username){
                req.session.username = data.username;
                req.session.realname = data.realname;

                //同步到redis中
                set(req.sessionId, req.session)

                return new SuccessModel('登陆成功') 
            }else{
                return new ErrorModel('登陆失败')
            }
        })
    }

    //验证登陆状态的一个接口
    if(method == 'GET' && req.path == '/api/user/login-test'){
        
        if(req.session.username){
            return Promise.resolve(new SuccessModel({
                session : req.session
            }))
        }else{
            return Promise.resolve(
                new ErrorModel('尚未登陆')
            ) 
        }
    }
}

module.exports = handleUserRouter;