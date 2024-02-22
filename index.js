const express= require('express')
const mongoose= require('mongoose')
const cors= require('cors')
const port = process.env.PORT || 3000
const app= express()
const cookieParser = require('cookie-parser')


//connecting mongodb
const uri = 'mongodb+srv://ram:ram@cluster0.kwlcgdm.mongodb.net/?retryWrites=true&w=majority';

//mongo db connection
mongoose.connect(uri)
const db=mongoose.connection;
db.on("error",()=>{console.error.bind()});
db.once("open",()=>{console.log("DB connection established")});


var corsOptions = {
    origin: function (origin, callback) {
        callback(null, true)
      },  // Specify your origin here
    credentials: true,  // This allows the session cookie to be sent back and forth
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

//middleware
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'))

//routes
const Home = require('./routes/Home')
const Register = require('./routes/Register')
const Login = require('./routes/Login')
const AddJob = require('./routes/AddJob')
const UpdateJob = require('./routes/UpdateJob')
const LogOut = require('./routes/LogOut')
const getUser = require('./routes/getUser')
const deleteJob = require('./routes/DeleteJob')
const Search = require('./routes/Search')

//using routes
app.use(Home)
app.use(Register)
app.use(Login)
app.use(AddJob)
app.use(UpdateJob)
app.use(LogOut)
app.use(getUser)
app.use(deleteJob)
app.use(Search)

app.listen(port,()=>{
    console.log("server started on port :",port)
})