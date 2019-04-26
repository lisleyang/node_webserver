const mysql = require('mysql');

const con = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    database : 'myblog',
    user : 'root',
    password : 'Shy030017'
})

con.connect()

const sql = 'Select id,username from users;';

con.query(sql,(err,result)=>{
    if(err){
        console.log(err);
        return;
    }
})

con.end()

