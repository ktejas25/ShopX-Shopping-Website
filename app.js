const express = require("express");
const mysql = require("mysql2");


const connection = mysql.createConnection({
    host:"127.0.0.1",
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
const port = 5500;


app.post("/signUP",(req,res)=>{
    let name = req.body.signUPname
    let email = req.body.signUPemail
    let pass = req.body.signUPpassword
    connection.query("SELECT * FROM login_table where loginemail = ?",[email],(err,result,fields)=>{
        if(err){
            console.log(err);
            res.status(500).json({succsess:false,message:"err"});
        }else{
            if(result.length != 0){
                console.log("already have an acc")
                res.status(500).json({succsess:false,message:"already have an acc"})
            }else{
                connection.query("INSERT INTO login_table (loginpassword,loginname,loginemail) VALUES (?,?,?)",[pass,name,email],(err,result,fields)=>{
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
    connection.query("SELECT * FROM login_table where loginemail = ? AND loginpassword = ?",[email,pass],(err,result,fields)=>{
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

// Store cart data
app.post("/api/cart", (req, res) => {
    const { userId, items } = req.body;
    items.forEach(item => {
        connection.query("INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)", 
            [userId, item.productId, item.quantity],
            (err, result) => {
                if (err) console.log(err);
            });
    });
    res.json({ success: true });
});

// Store payment and shipping
app.post("/api/checkout", (req, res) => {
    const { userId, totalAmount, address, paymentMethod } = req.body;
    connection.query(
        "INSERT INTO orders (userId, totalAmount, address, paymentMethod, status) VALUES (?, ?, ?, ?, 'Processing')",
        [userId, totalAmount, address, paymentMethod],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: false });
            } else {
                res.json({ success: true, orderId: result.insertId });
            }
        }
    );
});

// Store order items
app.post("/api/order-items", (req, res) => {
    const { orderId, items } = req.body;
    items.forEach(item => {
        connection.query(
            "INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)",
            [orderId, item.productId, item.quantity, item.price]
        );
    });
    res.json({ success: true });
});

// Get order history
app.get("/api/orders/:userId", (req, res) => {
    const userId = req.params.userId;
    connection.query("SELECT * FROM orders WHERE userId = ?", [userId], (err, orders) => {
        if (err) {
            res.status(500).json({ success: false });
        } else {
            const allOrders = [];
            let completed = 0;
            orders.forEach(order => {
                connection.query("SELECT * FROM order_items WHERE orderId = ?", [order.id], (err, items) => {
                    order.items = items;
                    allOrders.push(order);
                    completed++;
                    if (completed === orders.length) {
                        res.json(allOrders);
                    }
                });
            });
        }
    });
});


app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
})

app.use(express.static("public"))

