const mongoose = require("mongoose"); //mongoose requiring 
mongoose.set('strictQuery', false);  // not important this for not showing warnings

// connecting and creating database
mongoose.connect("mongodb://127.0.0.1:27017/user_management");


//getiing express
const express = require("express");
const app = express();

app.use((req, res, next) => {
    res.set('cache-Control', 'no-store')
    next()
})




//for admin routes
const adminRoutes = require("./routes/adminRoutes")
app.use('/admin', adminRoutes);



// for user routes 
const userRoutes = require("./routes/userRoutes")
app.use('/', userRoutes)


//creating server for webpage load
app.listen(3000, function () {
    console.log("server is running");
});
