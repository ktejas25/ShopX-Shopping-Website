const express = require("express");
const mysql = require("mysql2");


const connection = mysql.createConnection({
    host:"local",
    user:"root",
    password: "root123",
    database: "shopx",
    port:3306
})

connection.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected");
    }
})

const app = express();

app.use(express.json());
const port = 8080;


app.post("/signUP",(req,res)=>{
    let name = req.body.signUPname
    let email = req.body.signUPemail
    let pass = req.body.signUPpassword
    connection.query("SELECT * FROM logtable where loginemail = ?",[email],(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).json({succsess:false,message:"err"});
        }else{
            if(result.length != 0){
                console.log("already have an acc")
                res.status(500).json({succsess:false,message:"already have an acc"})
            }else{
                connection.query("INSERT INTO logtable (loginpassword,loginname,loginemail) VALUES (?,?,?)",[pass,name,email],(err,result)=>{
                    if(err){
                        console.log(err);
                        res.status(500).json({succsess:false,message:"err"});
                    }else{
                        res.json({succsess:true,message:"userCreated"});
                    }
                })
            }
        }
    })
})


app.post("/signIn",(req,res)=>{
    let name = req.body.signUPname
    let email = req.body.signInemail
    let pass = req.body.signInpassword
    connection.query("SELECT * FROM users where email = ? AND Upassword = ?",[email,pass],(err,result,fields)=>{
        if(err){
            console.log(err);
            res.status(500).json({succsess:false,message:"err"});
        }else{
            if(result.length != 0){
                console.log("userLoggd in")
                res.json({succsess:true,message:"logged in"})
            }else{
                res.status(500).json({succsess:false,message:"err"});
                console.log("err")
            }
        }
    })
})




app.listen(port,()=>{
    console.log("server started");
})

app.use(express.static("public"))


