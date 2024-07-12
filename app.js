var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var http=require("http");
var mongo=require("mongoose");
var mongoconnection=require("./config/dbconnection.json");
var app = express();
const {add}=require("./controller/chatController.js");

const bodyParser=require("body-parser")


mongo.connect(mongoconnection.url, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
  })
  .then(()=>console.log('mongo connected'))
  .catch((err)=>console.log(err));



var classroomRouter=require('./routes/classroom');
const chatRouter=require("./model/chat");
  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use('/classroom',classroomRouter);
app.use('/chat',chatRouter);

const server=http.createServer(app);
const io=require("socket.io")(server);
io.on("connection",(socket)=>{
console.log("user connected"); 
socket.on("msg",(data)=>{
  io.emit("msg",data.name+"is connected");
});

  socket.on("msg", (data) =>{
  add(data.object)
  io.emit("msg",data.name+ ":"+data.object);
 });


 socket.on("typing", (data) =>{
  io.emit("typing",data+ " is typing...");
 });

socket.on("disconnect",()=>{
console.log("user disconnect");
io.emit("msg","user is disconnect");
});
});

function isEven(number) {
  return number % 2 === 0;
}

function isOdd(number) {
  return number % 2 !== 0;
}

function calculateSquareRoot(number) {
  if (number < 0) {
    throw new Error("Le nombre doit être positive.");
  
  }
  return Math.sqrt(number);
  
}



server.listen(3002, console.log("server run"));

module.exports = app;
