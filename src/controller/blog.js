const getList = (auth,keyword)=>{
    //先返回假数据
    return [
        {
            id : 1,
            title : '标题A',
            content : '内容A',
            createTime : 1555310973518,
            author : 'zhangsan'
        },
        {
            id : 2,
            title : '标题B',
            content : '内容B',
            createTime : 1555311012973,
            author : 'lisi'
        }
    ]
}

const getDetail = (id)=>{
    return {
        id : 1,
        title : '标题A',
        content : '内容A',
        createTime : 1555310973518,
        author : 'zhangsan'
    }
}

const newBlog = (blogData = {}) => {
    //blogData是一个博客对象，包含title content等属性
    console.log('blogdata', blogData)

    return {
        id : 3  //新建博客插入到数据表里的id
    }

}

const updataBlog = (id , blogData = {}) => {
    //blogData是一个博客对象，包含title content等属性
    return true

}

const delBlog = (id) => {
    //blogData是一个博客对象，包含title content等属性
    if(id){
        return true
    }else{
        return false
    }

}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updataBlog ,
    delBlog
}