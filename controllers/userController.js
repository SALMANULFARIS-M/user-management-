const User = require('../models/userModel');  //taking model module
const bcrypt = require('bcrypt')             // bcrypt for password convert


//Home page render
const rootPage = async (req, res) => {
    try {

        let user;
        res.render("home", { user })

    } catch (error) {
        console.log(error.message);
    }
}




// rendering signup page
const loadregister = async (req, res) => {
    try {

        res.render("signup");

    } catch (error) {
        console.log(error.message);
    }
}


// converting to bcryt data
const securePassword = async (password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}


//creating new user -signup page
const insertUser = async (req, res) => {
    console.log(req.body)
    try {
        const psw = await securePassword(req.body.password)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: psw,
            is_admin: 0,
        })
        const userData = await user.save();
        if (userData) {

            req.session.user_id = userData._id
            res.redirect('/home')


        } else {
            res.render('signup', { message: "Your registration has been failed." })
        }

    } catch (error) {
        console.log(error.message);
    }
}



//rendering login page
const loginLoad = async (req, res) => {
    try {

        res.render("login");

    } catch (error) {
        console.log(error.message);
    }
}



//checking user data with database details and verifying user already signed or not-login form
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {

            const passwordCheck = await bcrypt.compare(password, userData.password); //comparing database bycrpt with user typed password
            if (passwordCheck) {


                req.session.user_id = userData._id;
                res.redirect("/home")
            } else {
                res.render('login', { message: "Password is incorrect" });
            }

        } else {
            res.render('login', { message: "Email or password is incorrect" })
        }

    } catch (error) {
        console.log(error.message);
    }
}


//after login or signup
const loadHome = async (req, res) => {
    try {

        const userData = await User.findById({ _id: req.session.user_id })
        res.render('home', { user: userData })

    } catch (error) {
        console.log(error.message);
    }
}

//logouting 
const userLogout = async (req, res) => {
    try {

        req.session.destroy()
        res.redirect("/login");

    } catch (error) {
        console.log(error.message);
    }
}







//exporting this module
module.exports = {
    rootPage,
    loadregister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}