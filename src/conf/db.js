const env = process.env.NODE_ENV;

let MYSQL_CONF;
let REDIS_CONF;

if(env == 'dev'){
    MYSQL_CONF = {
        host : 'localhost',
        port : 3306,
        database : 'myblog',
        user : 'root',
        password : 'Shy030017'
    };

    REDIS_CONF = {
        port : 6379,
        host : '127.0.0.1'
    }
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
    REDIS_CONF = {
        port : 6379,
        host : '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}