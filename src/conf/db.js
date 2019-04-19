const env = process.env.NODE_ENV;

let MYSQL_CONF;

if(env == 'dev'){
    MYSQL_CONF = {
        host : 'localhost',
        port : 3306,
        database : 'myblog',
        user : 'root',
        password : 'Shy030017'
    };
}

if(env == 'production'){
    //  实际开发中的线上地址
    MYSQL_CONF = {
        host : 'localhost',
        port : 3306,
        database : 'myblog',
        user : 'root',
        password : 'Shy030017'
    };
}

module.exports = MYSQL_CONF