//requiring installed modules
const express = require('express');
const adRouter = express();
const bodyParser = require('body-parser');


// midleware for converting and reading datas come through req
adRouter.use(bodyParser.json());
adRouter.use(bodyParser.urlencoded({ extended: true }));


// session require
const session = require("express-session");
//session creating
const config = require("../config/config");
adRouter.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));



// setting view engine and path
adRouter.set('view engine', 'ejs');
adRouter.set("views", './views/admin');


//requiring created middliware
const auth = require("../middleware/adminauth")


//getting controller modules
const aC = require("../controllers/adminController")



adRouter.get('/', auth.isLogout, aC.adminLogin)               //loading admin signup
adRouter.post('/', aC.verifyLogin)                           //verify and go to dashboard(home)

adRouter.get('/home', auth.isLogin, aC.loadDashboard)         //rendering admin home

adRouter.get('/add-user', auth.isLogin, aC.newUserLoad)       //laod newuser adding page
adRouter.post('/add-user', aC.addUser)                       //add data to data base

adRouter.get('/edit', auth.isLogin, aC.editUserLoad)          //edit page load
adRouter.post('/edit', aC.updateUser)                        //edit and update to database

adRouter.get('/delete', auth.isLogin, aC.deleteUser)          //delete a user

adRouter.get('/logout', auth.isLogout, aC.adminLogout)        //loging out admin

adRouter.get('*', function (req, res) {                         //load adminroot pagebefore any page
    res.redirect('/admin')
})


module.exports = adRouter;