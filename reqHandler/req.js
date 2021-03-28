const express=require('express');
const Person=require('../personmodel');
const router=express.Router();

router.get('/',(req,res,next)=>{
    res.render('login');
 })
 
 router.post('/login',(req,res,next)=>{
     Person.find({}).then(person=>{
         res.render('content',{
             People:person
         })
     })
 })

 module.exports=router;