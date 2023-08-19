const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
let app = express();
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );  
  res.header("Access-Control-Allow-Credentials",true);
  next();
});

let port= process.end.PORT || 2410;
app.listen(port, ()=> console.log(`Node app listening on port ${port}!`));

app.use(cookieParser("abcdef-3477819"));
app.use(cors({credientials: true, origin: true}));

let {emps} = require("./data.js");

app.post("/login",function(req,res){
    let {empCode, name} = req.body;
    let emp = emps.find(e=>e.empCode==empCode&&e.name==name);
    if(!emp)
        res.status(401).send("Login failed");
    else{
        res.cookie("empCode",empCode,{httpOnly:true});
        res.send("Login success");
    }
});

app.get("/logout",function(req,res){
    res.clearCookie("empCode");
    res.send("Cookies cleared");
});

app.get("/myDetails",function(req,res){
  let empCode = req.cookies.empCode;
  if(!empCode){
    res.status(401).send("Not Logged In");
  }
  else{
    let loginemp = emps.find(e=>e.empCode==empCode);
    res.send(loginemp);
  }
});

app.get("/company",function(req,res){
    res.send("Welcome to the Employee Portal of XYZ Company");
});

app.get("/myJuniors",function(req,res){
    let myjuniors;
    let empCode = req.cookies.empCode;
    if(!empCode){
        res.status(401).send("Not Logged in");
    }
    else{
        let emp = emps.find(e=>e.empCode==empCode);
        if(emp.designation==="VP"){
            myjuniors = emps.filter(e=>e.designation=="Manager"||e.designation=="Trainee");
        }
        else if(emp.designation==="Manager"){
            myjuniors = emps.filter(e=>e.designation==="Trainee");
        }
        else{
            myjuniors = 'There is no junior';
        }
        res.send(myjuniors);
    }
});
