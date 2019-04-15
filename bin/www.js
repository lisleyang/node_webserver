const http = require('http');
const serverHandler = require('../app.js')

const port = 3333;


const server = http.createServer(serverHandler);

server.listen(port)