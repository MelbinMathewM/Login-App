const User = require('../models/userModel');
const session = require('express-session');
const bcrypt = require('bcrypt');

const securePassword = async(password) => {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
}

const loadLogin = async(req,res) => {
    try{
        res.render('login');
    }catch(error){
        console.log("error")
    }
}

const verifyAdmin = async (req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email : email });

        if(userData){
            if(userData.is_admin === 1){
                const passwordMatch = await bcrypt.compare(password,userData.password);
                if(passwordMatch){
                    req.session.admin_id = userData._id;

                    res.redirect('/admin/home');
                }else{
                    res.render('login',{message : "Incorrect password!"});
                }
            }else{
                res.render('login' ,{ message : "Invalid User!"});
            }
        }else{
            res.render('login',{ message : "User not found!"})
        }
    }catch(error){
        res.send(error.message)
    }
}

const loadHome = async (req,res) => {
     try{
        const userData = await User.findById(req.session.admin_id)
        res.render('home',{ admin : userData});
     }catch(error){
        res.send(error.message);
     }
}

const logoutAdmin = async (req,res) => {
    try{
        req.session.destroy();
        res.redirect('/admin');
    }catch(error){
        res.send(error.message)
    }
}

const loadDashboard = async (req,res) => {
    try{
        let search = "";
        if(req.query.search){
            search = req.query.search;
        }
        const userData = await User.find({
            is_admin : 0,
            $or : [
                { name : { $regex : ".*" + search + ".*", $options : "i"}},
                //{ email : { $regex : ".*" + search + ".*", $options : "i"}}
            ]
        });
        res.render("dashboard",{users : userData,search});
    }catch(error){
        res.send(error.message)
    }
}

const loadNewUser = async (req,res) => {
    try{
        res.render('new-user');
    }catch(error){
        res.send(error.message)
    }
}

const addUser = async (req,res) => {
    try{
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const photo = req.file.filename;
        const password = req.body.password;

        const spassword = await securePassword(password);

        const user = new User({
            name : name,
            email : email,
            phone : phone,
            photo : photo,
            password : spassword,
            is_admin : 0,
            is_v : 1
        })
        const userData = await user.save();

        if(userData){
            res.redirect('/admin/dashboard');
        }else{
            res.render('new-user',{message : "Something went wrong!"})
        }
    }catch(error){
        res.send(error.message)
    }
}

const editUser = async (req,res) => {
    try{
        const id = req.query.id

        const userData = await User.findById({_id : id});
        if(userData){
            res.render('edit-user',{user : userData});
        }else{
            res.redirect('/admin/dashboard');
        }
    }catch(error){
        res.send(error.message)
    }
}

const updateUser = async (req,res) => {
    try{
        const userData = await User.findByIdAndUpdate({ _id : req.query.id },{
            $set : {
                name : req.body.name,
                email : req.body.email,
                phone : req.body.phone
            }
        });
        res.redirect('/admin/dashboard');
    }catch(error){
        res.send(error.message)
    }
}

const deleteUser = async (req,res) => {
    try{
        const id = req.query.id;
        const confirmed = req.query.confirm === 'true';
        if(confirmed){
            await User.findByIdAndDelete({_id : id});
        res.redirect('/admin/dashboard');
        }else{
            res.redirect('/admin/dashboard');
        }
    }catch(error){
        res.send(error.message)
    }
}

module.exports = {
    loadLogin,
    verifyAdmin,
    loadHome,
    logoutAdmin,
    loadDashboard,
    loadNewUser,
    addUser,
    editUser,
    updateUser,
    deleteUser
}