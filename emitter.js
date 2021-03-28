const WebSocket=require('ws');

const crypto=require('crypto');

const aesjs=require('aes-js');

const serverAddress="ws://127.0.0.1:${process.env.PORT || 5000}";

const {passKey,iv}=require('./key');

const ws=new WebSocket(serverAddress);
class persons{
    constructor(name,origin,destination){
        this.name=name;
        this.origin=origin;
        this.destination=destination
    }
};
let obj=new persons("Rahul","Banglore","Mumbai");
let obj1=new persons("Abhinav","Patna","Banglore");
let obj2=new persons("pushpender","pune","prayagraj");
let obj3=new persons("dharm","kharagpur","surat");
let obj4=new persons("mohan","gaya","bhagalpur");
let obj5=new persons("sohan","hyderabad","secunderabad");
let obj6=new persons("Ramu","Punjab","Gujrat");
let obj7=new persons("Nikhil","muradabad","punjab");
let obj8=new persons("dharm","Amritsar","Ahmedabad");
let obj9=new persons("dharm","Sikkim","Guwahati");


function sh256Encrypt(obj){
    let str=crypto.createHash('sha256').update(obj.name+obj.destination+obj.origin).digest('hex');
    obj.secretKey=str;
    return obj;
}
function encrypt(obj){
    let object=sh256Encrypt(obj);
    let text=JSON.stringify(object);
    let textBytes=aesjs.utils.utf8.toBytes(text);
    let aesCtr=new aesjs.ModeOfOperation.ctr(passKey,new aesjs.Counter(5));
    let encryptedBytes=aesCtr.encrypt(textBytes);
    let encryptedHex=aesjs.utils.hex.fromBytes(encryptedBytes)
    setTimeout(()=>{
        ws.send(encryptedHex);
        ws.send('|');
    },1500);
    
}
console.log(encrypt(obj));

let objectPool=[obj,obj1,obj2,obj3,obj4,obj5,obj6,obj7,obj8,obj9];

ws.on('open',function(){
    objectPool.forEach((objec,index)=>{
        setTimeout(()=>{
            encrypt(objec);
        },index*1000)
        
})

})
