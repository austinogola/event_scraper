require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose=require('mongoose')
const server=require('http').createServer(app)
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const connectDb=require('./config/db')


const wss=new WebSocket.Server({server:server})


const messageListeners = [];

const connectedClients = new Map()

wss.on('connection',function connections(ws){
  const clientId = uuidv4();
  ws.id = clientId
  connectedClients.set(clientId,ws)
  console.log('New client connected with ID',clientId);
  

  ws.on('message',function incoming(message){
    console.log('Received ',message);
    messageListeners.forEach(listener => listener(message));
  })

  ws.on('close', function close() {
    console.log(`Client disconnected with ID: ${ws.id}`);
    connectedClients.delete(clientId);
  });
})

function sendMessage(message) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function sendMessageToClient(clientId, message) {
  const client = connectedClients.get(clientId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(message);
  }
}

function onMessage(callback) {
  messageListeners.push(callback);
}


module.exports = {
  sendMessage,
  sendMessageToClient,
  onMessage,
  connectedClients
};


app.use(cors());

// Middleware for parsing JSON data
app.use(express.json());

// Middleware for parsing data from forms
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000;

const v1Route = require('./routes/v1');

app.use('/v1', v1Route);


//connect to mongodb
connectDb()


mongoose.connection.once('open',()=>{
  console.log("Connected to mongoDB")
  

  server.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}`);
  });
  

})

module.exports = server;