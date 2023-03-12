//requiring installed modules
const express = require('express');
const router = express()
const bodyParser = require('body-parser')


// midleware for converting and reading datas come through req
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


// session require
const session = require("express-session")
//creating session
const config = require("../config/config")
router.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));


// setting view engine and path
router.set('view engine', 'ejs');
router.set("views", './views/users');


//getting controller modules 
const uC = require("../controllers/userController");

//requiring created middliware
const auth = require("../middleware/auth")



// request and result routing
router.get('/', auth.isLogout, uC.rootPage)                      //root page

router.get('/login', auth.isLogout, uC.loginLoad);             //loadlogin page
router.post('/login', uC.verifyLogin)                          //verify password and redirect home

router.get('/signup', auth.isLogout, uC.loadregister);         //loadsignup page 
router.post('/signup', uC.insertUser);                         //insert new user and redirect home

router.get('/home', auth.isLogin, uC.loadHome)                   //home page after login or signup

router.get('/logout', uC.userLogout)                            //logout


// exports this module
module.exports = router;