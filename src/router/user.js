const {loginCheck} = require('../controller/user')
const {SuccessModel,ErrorModel} = require('../model/resModel.js')

const handleUserRouter = (req,res)=>{
    const method = req.method;

    if(method == 'POST' && req.path == '/api/user/login'){
        const {username , password} = req.body;
        if(loginCheck(username , password)){
            return new SuccessModel('修改成功')
        }else{
            return new ErrorModel('修改失败')
        }
    }
}

module.exports = handleUserRouter;