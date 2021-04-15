let mongoose=require('mongoose');
let newSchema= mongoose.Schema({
  emails:{
    type:String,
    required:true,
  },
  titles:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    required:true,
  },
  body:{
    type:String,
    required:true,
  },
  date:{
    type:Date,
  }
})
module.exports=Task=mongoose.model('blogs',newSchema);