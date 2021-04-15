const express = require('express');
const router=express.Router();
const USerData=require('./../model/user');
const bcryptjs=require('bcryptjs');
const passport=require('passport');
const { password } = require('../config/appConfig');
router.get('/register',(req,res)=>{

  res.render('register');
})
router.post('/register',(req,res)=>{
  
 USerData.findOne({email:req.body.email})
 .then((data)=>{
   if(data)
   {
     
     console.log(data);
    // res.flash("error_msg","Data Already exits");
    res.render('register');   
   }
   else{
     let newUSerdata=USerData({
       name:req.body.name,
       email:req.body.email,
       password:req.body.password,
       
     })
    
  bcryptjs.genSalt(10, function(err, salt) {
   let hash= bcryptjs.hash(req.body.password, salt, function(err, hash) {
      console.log(hash);
       newUSerdata.password=hash;
       
       newUSerdata.save()
     .then((response)=>{
       if(response)
       {
         console.log("Data added sucessfully");
         res.redirect('login')
       }
     })
     .catch((err)=>{
       console.log(err);
       console.log(newUSerdata)
     })
    })
   });
  }
 })
 .catch((err)=>{
   console.log(err)
 })

})

router.get('/login',(req,res)=>{
  res.render('login-page');
  
})

router.post("/login",(req,res,next)=>{
  console.log(req.body.email);
  console.log(req.body.password);
  console.log(req.body.id)
  passport.authenticate('local',{
    failureRedirect:'/user/login',
    successRedirect:'/',
  },
  )
  (req,res,next)
})
router.get('/logout',(req,res)=>{
  req.logOut();
  req.flash('success_msg',"You are looged out")
  // res.render('login-page');
  res.redirect('/');
})
module.exports=router;