if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}

const express=require('express');
const mongoose = require("mongoose");
const app=express();
const path = require('path');
const PORT =  3000;
const methodOverride=require('method-override')
const ejsMate=require("ejs-mate")
const ExpressError=require('./utils/ExpressError.js')
const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User = require('./models/user');


const sessionOptions={
  secret:"mysecretsupercode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true   // for security purpose
  }

};
app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the directory where the views are located
app.set('views', path.join(__dirname, 'views'));
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"))
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
// Middleware to serve the public folder
app.use(express.static(path.join(__dirname, '/public')));

app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("failure")
  res.locals.currUser=req.user;
  next()
})
// for testing passport
// app.use('/demo',async (req,res)=>{
//   let fakeUser=new User({
//     email:"priya@gmail.com",
//     username:"priya"
//   })
//   let registeredUser=await User.register(fakeUser,"helloWorld")
//   res.send(registeredUser);
// })

app.use('/listings',listingRouter)
app.use('/listings/:id/reviews',reviewRouter)
app.use('/',userRouter)


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main().then(()=>{
    console.log('connected to DB');
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



app.get("/",(req,res)=>{
  res.send("res send")
})

app.use((req,res,next)=>{
   next(new ExpressError(404,"Page not Found!"))
})

app.use((err, req, res, next) => {
 
  let {status=500, message="Something went wrong!"} = err;
  res.status(status).render("error",{message}); 
})

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})
