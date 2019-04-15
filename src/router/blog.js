const {getList, getDetail ,newBlog, updataBlog, delBlog} = require('../controller/blog.js')
const {SuccessModel,ErrorModel} = require('../model/resModel.js')

const handleBlogRouter = (req,res)=>{
    const method = req.method;

    //获取博客列表 
    if(method == 'GET' && req.path == '/api/blog/list'){
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const listData = getList(author,keyword)

        return new SuccessModel(listData)
    }  

    //获取博客详情
    if(method == 'GET' && req.path == '/api/blog/detail'){
        const id = req.query.id || '';
        const listData = getDetail(id);

        return new SuccessModel(listData)
    }  

    //新建博客
    if(method == 'POST' && req.path == '/api/blog/new'){
        const data = newBlog(req.body)
        return new SuccessModel(data);
    }  

    //更新博客
    if(method == 'POST' && req.path == '/api/blog/update'){
        const result = updataBlog(req.query.id , req.body)
        if(result){
            return new SuccessModel();
        }else{
            return new ErrorModel('更新博客失败')
        }
        
    }  

    //删除博客
    if(method == 'POST' && req.path == '/api/blog/del'){
        const result = delBlog(req.query.id)
        if(result){
            return new SuccessModel()
        }else{
            return new ErrorModel('删除博客失败')
        }
    }    
}

module.exports = handleBlogRouter