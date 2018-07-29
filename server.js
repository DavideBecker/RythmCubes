var SerialPort = require("serialport");

var express = require('express');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var activePort = process.argv[2] || '/dev/cu.usbmodem1411'

const port = new SerialPort(activePort, {
    // baudRate: 38400
    baudRate: 115200
});
if(port) {
    const parser = new SerialPort.parsers.Readline();
    port.pipe(parser);
    parser.on('data', function(data) {
        try {
            var parsedData = JSON.parse(data.toString())
        } catch (e) {
            console.error('!', data);
            return false;
        }

        console.log(parsedData)
        io.emit('sensorData', parsedData)
    });
}

io.on('connection', (socket) => {
    console.log('user connected')
});

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8081); 