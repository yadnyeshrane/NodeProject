const LocalStrategy=require('passport-local').Strategy;
const User=require('./../model/user');
const bcryptjs= require('bcryptjs');
module.exports=function(passport){
  passport.use(new LocalStrategy({usernameField:"email"},(email,password,done)=>{
   User.findOne({'email':email})
  .then((userdata)=>{
    if(userdata)
    {
      console.log("email id exist");
      bcryptjs.compare(password, userdata.password, (err, result)=> {
        if(result)
        {
          console.log("password matched");
          // if it is okk then we have to store in session that why inside the done we have passed the suer data
          return done(null,userdata,);
        }
        else
        {
          console.log("password didnot match")
          return done(null,false,{error_msg:"incoorect password"});
        }
    });
    
      
    }
    else
    {
      console.log("Email id does not exist");
      return done(null,false,{error_msg:"email id does not exist"});

    }

  })
  .catch((err)=>{
    console.log(err);
  })
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user.id);
    });
  });
  
   
}
))
}