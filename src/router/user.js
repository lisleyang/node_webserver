const {loginCheck} = require('../controller/user')
const {SuccessModel,ErrorModel} = require('../model/resModel.js')

const handleUserRouter = (req,res)=>{
    const method = req.method;

    if(method == 'POST' && req.path == '/api/user/login'){
        const {username , password} = req.body;
        const result = loginCheck(username, password);

        return result.then(data=>{
            if(data.username){
                return new SuccessModel('登陆成功') 
            }else{
                return new ErrorModel('登陆失败')
            }
        })
    }
}

module.exports = handleUserRouter;