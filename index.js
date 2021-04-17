//author-Yadnyesh
const express=require('express');
const app=express();
var bodyParser = require('body-parser')
const mongoose=require('mongoose');
const Task=require('./model/Taskmodel');
const exphbs=require('express-handlebars');
const path=require('path');
const port=3500;
const flash=require('express-flash');
let session=require('express-session');
let passport=require('passport');
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

const multer=require('multer')
//installing express handelbars
app.engine('handlebars', exphbs());
//body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
 //method-overid
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
//static files
app.use(express.static('public'))
// parse application/json
app.use(bodyParser.json())
//loading view engine
app.set('view engine', 'handlebars');


//set storage engine
const storage=multer.diskStorage({
  destination:'./public/uploads/',
  filename:function(req,file,cb)
  {
    cb(null,file.fieldname+'-'+Date.now()+ path.extname(file.originalname))
  }
})

//intilize upload 

const upload=multer({
  storage:storage,

}).single('file');

// express session
// express message middleware
// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });

//session

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.user=req.user|| null;
    
    next();
})

require('./config/passport')(passport);


//connecting through mongoose
const mongoDbUri=require('./config/key').mongoDbUri;
const router = require('./route/article');
mongoose.connect(mongoDbUri,{
  useNewUrlParser:true,
  useUnifiedTopology:true, 
})
.then(()=>{
  console.log(" Db connected");
})
.catch((err)=>{
  console.log(err);
})

//homepage
app.get('/',(req,res)=>{
  Task.find({}).sort({data:'DESC'}).lean()
  .then((data)=>{
    res.render('home',{tasks:data});
    // console.log(data)
  })
  .catch((err)=>{
    console.log(err);
  })
 
})


//adding data

app.post("/about",upload, (req,res)=>{
  console.log("insertd data")
 
let errors=[];
if(req.body.titles=="")
{
  errors.push({msg:"Title cannot be blank"});
}
if(req.body.author=="")
{
  errors.push({msg:"Author field caanot be blank"});
}
if(req.body.body=="")
{
  errors.push({msg:"body field caanot be blank"})
}
if(errors.length!=0)
{
  console.log(errors)
  res.render('add-articles',{
    titles:req.body.titles,
    author:req.body.author,
    image:req.file.filename,
    body:req.body.body,
    errors:errors,
    
  })
}
else
{
let newTask=new Task({
  emails:req.body.emails,
  titles:req.body.titles,
  author:req.body.author,
  image:req.file.filename,
  body:req.body.body,
  date:Date.now(),
})
console.log(newTask)
newTask.save()
.then((data)=>{
  console.log('data added sucessfully');
  req.flash("success_msg","Data added to the list")
  res.redirect('/')
})
.catch((err)=>{
  console.log(err);
 } )
}

})

//public foder

const route=require('./route/article');
app.use('/',route);
const userroute=require('./route/users');
const user = require('./model/user');
const e = require('express');
app.use('/user',userroute);
//starting the port
app.listen(port,()=>{
  console.log('server is listneing on the port');
})

