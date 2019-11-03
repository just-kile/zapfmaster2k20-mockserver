const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const http = require('http');
const WebSocket = require('ws');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//initialize a simple http server
//TODO: fix connection with express server
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send(JSON.stringify({ event: 'welcome' }));
});

function broadcast(event, data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ event, data }));
        }
    });
}

function drawProcess(opt) {
    console.log('starting drawProcess');
    const measurementInterval = opt.mmt_interval || 200;
    const total = opt.amount || 500;
    const speed = opt.speed || 1000;
    const drawAmountPerTick = speed / 60 / 1000 * 200;

    let current = 0;
    broadcast('Start-Drawing', opt);
    const drawIntervalId = setInterval(() => {
        current += drawAmountPerTick * (Math.random() + 0.5);
        console.log('current', current);
        broadcast('draw', current);
        if (current >= total) {
            clearInterval(drawIntervalId);
        }
    }, measurementInterval);
}

app.post('/draw', (req, res) => {
    console.log('draw', req.body);
    drawProcess(req.body);
    res.send('draw received');
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));