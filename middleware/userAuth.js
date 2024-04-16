const User = require('../models/userModel');

const isLogin = async (req,res,next) => {
    try{
        if(req.session.user_id){
            next();
        }else{
            return res.redirect('/');
        }
    }catch(error){
        res.send(error.message);
    }
}

const isLogout = async (req,res,next) => {
    try{
        if(req.session.user_id){
           return res.redirect('/home');
        }
        next();
    }catch(error){
        res.send(error.message);
    }
}

const userAuthMdw = async (req,res,next) => {
    try{
        if(req.session && req.session.user_id){
            const user = await User.findById(req.session.user_id);
            if(user){
                req.user = user;
                next();
            }else{
                req.session.destroy();
                res.redirect('/',{message : "User not found"})
            }
        }else{
            res.redirect('/',{message : "Session ended!"})
        }
    }catch(error){
        res.send(error.message)
    }
}

module.exports = {
    isLogin,
    isLogout,
    userAuthMdw
}