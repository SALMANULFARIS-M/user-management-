const User = require("../models/userModel");
const bcrypt = require("bcrypt");


//loading admin login page
const adminLogin = async (req, res) => {
    try {

        res.render("login");

    } catch (error) {
        console.log(error.message);
    }
}



////checking admin data with database details and verifying admin exist or not 
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {

            const passwordCheck = await bcrypt.compare(password, userData.password); //comparing database bycrpt with user typed password
            if (passwordCheck) {

                if (userData.is_admin === 1) {

                    req.session.admin_id = userData._id;
                    res.redirect("/admin/home")


                } else {
                    res.render('login', { message: "You are not a admin" })
                }


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


//rendering home of admin 
const loadDashboard = async (req, res) => {
    try {
        var search = ''
        if (req.query.search) {
            search = req.query.search
        }

        const userData = await User.find({
            is_admin: 0,
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                { mobile: { $regex: '.*' + search + '.*', $options: 'i' } }

            ]

        })

        res.render('home', { users: userData })
    } catch (error) {
        console.log(error.message)
    }
}


//add new user page rendering
const newUserLoad = async (req, res) => {
    try {

        res.render('add-user')
    } catch (error) {
        console.log(error.message)
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


//adding new user
const addUser = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const mobile = req.body.mno
        const password = req.body.password

        const spassword = await securePassword(password)
        const user = new User({
            name: name,
            email: email,
            password: spassword,
            mobile: mobile
        })
        const userData = await user.save()
        if (userData) {
            req.session.user_id = userData._id;
            res.redirect('/admin/home')

        } else {
            res.render('add-user', { message: 'something went wrong' })
        }
    } catch (error) {

        console.log(error.message)
    }
}


//rendering edit user details
const editUserLoad = async (req, res) => {
    try {
        const id = req.query.id
        const userData = await User.findById({ _id: id })
        if (userData) {
            req.session.user_id = userData._id;
            res.render('edit', { user: userData })
        } else {

            res.redirect("/admin/home")
        }

    } catch (error) {
        console.log(error.message)
    }
}




//editing (updating) a existing data in database 
const updateUser = async (req, res) => {
    try {
        const userData = await User.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } })
        req.session.user_id = userData._id;
        res.redirect('/admin/home')
    } catch (error) {
        // console.log(error.message)


    }
}
    

const deleteUser = async (req, res) => {
    try {
        const id = req.query.id
        await User.deleteOne({ _id: id });
        res.redirect('/admin/home')

    } catch (error) {
        console.log(error.message)
    }
}


//logouting 
const adminLogout = async (req, res) => {
    try {

        req.session.destroy()
        res.redirect("/");

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    adminLogin,
    verifyLogin,
    loadDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUser,
    deleteUser,
    adminLogout
}

