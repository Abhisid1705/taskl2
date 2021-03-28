const path=require('path');
const express=require('express');
const http=require('http');
const WebSocket=require('ws');
const CryptoJs=require('crypto-js');
const {passKey,iv}=require('./key');
const Person=require('./personmodel');
const crypto=require('crypto');
let aesjs=require('aes-js');
const mongoose  = require('mongoose');
const reqHandler=require('./reqHandler/req');
const app=express();
const server=require('http').createServer(app);
const port=5000;

const wss=new WebSocket.Server({server:server});



wss.on('connection',function(socket){
    console.log("A client just connected");
    socket.on('message',function(msg){
        if(msg!="|"){
            doDecipher(msg);
        }
    })

})
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(reqHandler);

mongoose
  .connect(
    'mongodb+srv://abhi:9430259109@cluster0.mxivb.mongodb.net/Syook?retryWrites=true&w=majority',
     {useNewUrlParser: true, useUnifiedTopology: true}

  )
  .then(result => {
        server.listen(5000,()=>{
            console.log("listening : 5000");
        })
        
  })
  .catch(err => {
    console.log(err);
  });

function doDecipher(encryptedHex){

    let encryptedBytes=aesjs.utils.hex.toBytes(encryptedHex);
    let aesCtr=new aesjs.ModeOfOperation.ctr(passKey,new aesjs.Counter(5));
    let decryptedBytes=aesCtr.decrypt(encryptedBytes);
    let decryptedText=aesjs.utils.utf8.fromBytes(decryptedBytes);
    const jsObject=JSON.parse(decryptedText);
    console.log(decryptedText.name);
    let person=new Person({
        name:jsObject.name,
        origin:jsObject.origin,
        destination:jsObject.destination
    });
    person.save().then(res=>console.log(res)).catch(err=>console.log('error'));

}
