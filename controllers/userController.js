const User = require('../models/userModel');
const session = require('express-session');
const bcrypt = require('bcrypt');

const securePassword = async (password) => {
    try{
        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword;
    }catch(error){
        res.send(error.message);
    }
}

const loadRegister = async (req,res) => {
    try{
        res.render('register');
    }catch(error){
        res.send(error.message);
    }
}

const insertUser = async (req,res) => {
    try{
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.render('register', { message: 'Email already exists!' });
        }
        const spassword = await securePassword(req.body.password);
        const photo = req.file?req.file.filename:null;
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const user = new User({
            name : name,
            email : email,
            phone : phone,
            photo : photo,
            password : spassword,
            is_admin : 0,
            __v: 1
        });
        const userData = await user.save();

        if (userData) {
            res.render('login', {
                message: "Registration successful!"
            });
        } else {
            res.render('register', {
                message: "Registration unsuccessful"
            });
        }
    }catch(error){
        res.send(error.message)
    }
}

const loadLogin = async (req,res) => {
    try{
        res.render('login');
    }catch(error){
        res.send(error.message)
    }
}

const verifyUser = async(req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
       
        const userData = await User.findOne({email : email});

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                req.session.user_id = userData._id;
                res.redirect('/home');
            }else{
                res.render('login',{message : "Incorrect Password!"})
            }
        }else{
            res.render('login',{message : "User not found!"})
        }
    }catch(error){
        res.send(error.message)
    }
}

const loadHome = async (req,res) => {
    try{
        const userData = await User.findById(req.session.user_id)
        res.render('home',{user : userData});
    }catch(error){
        res.send(error.message)
    }
}

const logoutUser = async (req,res) => {
    try{
        req.session.destroy();
        res.redirect('/');
    }catch(error){
        res.send(error.message)
    }
}

const loadEdit = async (req,res) => {
    try{
        const id = req.query.id;
        const userData = await User.findById({_id : id});

        if(userData){
            res.render('edit', { user : userData });
        }else{
            res.redirect('/home');
        }
    }catch(error){
        res.send(error.message);
    }
}

const updateUser = async (req,res) => {
    try{
        if(req.file){
            const userData = await User.findByIdAndUpdate({_id : req.body.user_id},{
                $set : {
                    name : req.body.name,
                    email : req.body.email,
                    phone : req.body.phone,
                    photo : req.body.photo
                }
            })
        }else{
            const userdata = await User.findByIdAndUpdate({_id : req.body.user_id},{
                $set : {
                    name : req.body.name,
                    email : req.body.email,
                    phone : req.body.phone
                }
            })
        }
        res.redirect('/home');
    }catch(error){
        res.send(error.message)
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loadLogin,
    verifyUser,
    loadHome,
    logoutUser,
    loadEdit,
    updateUser
}