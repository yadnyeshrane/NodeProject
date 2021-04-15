const express=require('express');
const router=express.Router();
const Task=require('./../model/Taskmodel')

const UserModel=require('./../model/user');
var multer=require('multer');
var path=require('path');


//insert


router.get('/about',(req,res)=>{
  res.render('add-articles')
})
//getting singlearticle
router.get('/article/:id',(req,res)=>{
  Task.findOne({_id:req.params.id})
  .then((data)=>{
    console.log(data);
    res.render('single-article',data)
  })
  .catch((err)=>{
    console.log(err);
  })
})
//deleting the articles
router.get('/delete/:id',(req,res)=>{
  console.log(req.params.id);
  Task.deleteOne({_id:req.params.id})
  .then((data)=>{
    console.log('data deleted sucessfully');
   req.flash("success_msg","Data Deleted Succesfully")
   res.redirect('/')
  })
  .catch((err)=>{
    console.log(err);
  })

  
})
//adding articles through post
// router.post("/about", (req,res)=>{
//   console.log("insertd data")
// let errors=[];
// if(req.body.titles=="")
// {
//   errors.push({msg:"Title cannot be blank"});
// }
// if(req.body.author=="")
// {
//   errors.push({msg:"Author field caanot be blank"});
// }
// if(req.body.body=="")
// {
//   errors.push({msg:"body field caanot be blank"})
// }
// if(errors.length!=0)
// {
//   console.log(errors)
//   res.render('add-articles',{
//     titles:req.body.titles,
//     author:req.body.author,
//     body:req.body.body,
//     errors:errors,
    
//   })
// }
// else
// {
// let newTask=new Task({
//   emails:req.body.emails,
//   titles:req.body.titles,
//   author:req.body.author,
//   body:req.body.body,
//   date:Date.now(),
// })
// console.log(newTask)
// newTask.save()
// .then((data)=>{
//   console.log('data added sucessfully');
//   req.flash("success_msg","Data added to the list")
//   res.redirect('/')
// })
// .catch((err)=>{
//   console.log(err);
//  } )
// }

// })
//update task rendering
router.get('/update/:id',(req,res)=>{
  Task.findOne({_id:req.params.id})
  .then((data)=>{
 
res.render('update-article',data)
  })
 
})


router.post('/updated-data/:id',(req,res)=>{
Task.findOne({_id:req.params.id})
.then((data)=>{
  data.titles=req.body.titles
  data.author=req.body.author;
  data.body=req.body.body
  
  data.save()
  .then((response)=>{
    console.log("data updated sucessfully");
    req.flash('success_msg',"Data Updated sucessfully");
       res.redirect('/');
  })
  .catch((err)=>{
    console.log(err);
  })
})
})

router.get('/view-profile/:id',(req,res)=>
{
  UserModel.findOne({_id:req.params.id})
  .then((data)=>{
    var email=data.email;
    var name=data.name;
    Task.find({emails:email}).lean()
    .then((result)=>{
      console.log(result);
      res.render('view-prof',{result:result,name,email});
    })
  })
  .catch((err)=>{
    console.log(err)
  })
  
})
module.exports=router;