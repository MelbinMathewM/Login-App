const User = require('../models/userModel');

const isLogin = async (req,res,next) => {
    try{
        if(req.session.admin_id){
            next();
        }else{
            res.redirect('/admin');
        }
    }catch(error){
        res.send(error.message)
    }
}

const isLogout = async (req,res,next) => {
    try{
        if(req.session.admin_id){
            res.redirect('/admin/home');
        }else{
            next();
        }
    }catch(error){
        res.send(error.message)
    }
}

module.exports = {
    isLogin,
    isLogout,
}