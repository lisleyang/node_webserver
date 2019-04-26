const {exec} = require('../db/mysql.js');

const getList = (author,keyword)=>{
    let sql = `select * from blogs where 1=1 `;
    if(author){
        sql+=`and author='${author}' `
    }
    if(keyword){
        sql += `and title like '%${keyword}%' `
    }
    sql += 'order by createtime desc';
    return exec(sql);
}

const getDetail = (id)=>{
    let sql = `select * from blogs where id='${id}' `;

    return exec(sql).then(rows=>{
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    //blogData是一个博客对象，包含title content等属性
    const title = blogData.title;
    const content = blogData.content;
    const author = blogData.author;
    const createtime = Date.now()

    const sql = `
        insert into blogs (title,content,author,createtime)
        values ('${title}', '${content}', '${author}', ${createtime})
    `

    return exec(sql).then(insertData=>{

        return {
            id : insertData.insertId
        }
    })

}

const updataBlog = (id , blogData = {}) => {
    //blogData是一个博客对象，包含title content等属性
    //return true
    const title = blogData.title;
    const content = blogData.content;

    const sql = `
        update blogs set title='${blogData.title}',content='${content}' where id = ${id}
    `

    return exec(sql).then(updateData=>{

        if(updateData.affectedRows > 0){
            return true;
        }
        return false;
    })

}

const delBlog = (id,author) => {
    //实际业务中需要保证博客id是当前author的
    const sql = `delete from blogs where id='${id}' and author='${author}';`;

    //blogData是一个博客对象，包含title content等属性
    return exec(sql).then(deleteData=>{

        if(deleteData.affectedRows > 0){
            return true;
        }
        return false;
    })

}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updataBlog ,
    delBlog
}