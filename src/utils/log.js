const fs = require('fs');
const path = require('path');

function writeLog (writeStream, log){
    writeStream.write(log + '\n');
}

function createWriteStream(filename){
    const fullFileName = path.join(__dirname, '../', '../', 'logs',filename);
    const writeStream = fs.createWriteStream(fullFileName,{
        flag : 'a'  //append追加写日志
    })
    return writeStream;
}

const accessWriteStream = createWriteStream('access.log')
const errorWritestream = createWriteStream('error.log')
const eventWriteStream = createWriteStream('event.log')

function access(log){
    writeLog(accessWriteStream, log);
}
function error(log){
    errorLog(errorWritestream, log);
}
function event(log){
    eventLog(eventWriteStream, log);
}

module.exports = {
    access,
    error,
    event
}