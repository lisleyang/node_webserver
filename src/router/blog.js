const {getList, getDetail ,newBlog, updataBlog, delBlog} = require('../controller/blog.js')
const {SuccessModel,ErrorModel} = require('../model/resModel.js')

const handleBlogRouter = (req,res)=>{
    const method = req.method;

    //获取博客列表 
    if(method == 'GET' && req.path == '/api/blog/list'){
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const result = getList(author,keyword)
        return result.then(listData=>{
            return new SuccessModel(listData)
        })
    }  

    //获取博客详情
    if(method == 'GET' && req.path == '/api/blog/detail'){
        const id = req.query.id || '';
        if(!id){
            return new Promise((resolve,reject)=>{
                resolve(new ErrorModel('必须传id'))
            }) 
        }

        const result = getDetail(id);

        return result.then(data=>{
            return new SuccessModel(data);
        })
    }  

    //新建博客
    if(method == 'POST' && req.path == '/api/blog/new'){

        req.body.author = '张三'    //开发登陆时再改
        const result = newBlog(req.body);

        return result.then(data=>{
            return new SuccessModel(data);
        })
    }  

    //更新博客
    if(method == 'POST' && req.path == '/api/blog/update'){
        const result = updataBlog(req.query.id , req.body)
        return result.then(val=>{
            if(val){
                return new SuccessModel('更新成功');
            }else{
                return new ErrorModel('更新博客失败')
            }
        })
    }  

    //删除博客
    if(method == 'POST' && req.path == '/api/blog/delete'){
        req.body.author = '张三'
        const result = delBlog(req.body.id,req.body.author)
        return result.then(val=>{
            if(val){
                return new SuccessModel('删除成功');
            }else{
                return new ErrorModel('删除博客失败')
            }
        })
    }    
}

module.exports = handleBlogRouter