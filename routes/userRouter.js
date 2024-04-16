const express = require('express');
const u_route = express();
const session = require('express-session');

const userController = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');
const config = require('../config/config');
const multer = require('multer');
const path = require('path');

u_route.use(session({
    secret : config.sessionSecret,
    resave : false,
    saveUninitialized : false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

u_route.use(express.json());
u_route.use(express.urlencoded({ extended : true }));

u_route.set('view engine','ejs');
u_route.set('views','./views/users');

u_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename : (req,file,cb) => {
        const name = Date.now() + "-" + file.originalname;
        cb(null,name);
    }
});
const upload = multer({ storage : storage });

u_route.get('/register',userAuth.isLogout,userController.loadRegister);
u_route.post('/register',upload.single('photo'),userController.insertUser);
u_route.get('/',userAuth.isLogout,userController.loadLogin);
u_route.post('/',userController.verifyUser);
u_route.get('/home',userAuth.isLogin,userController.loadHome);
u_route.get('/edit',userAuth.isLogin,userController.loadEdit);
u_route.get('/logout',userAuth.isLogin,userController.logoutUser);
u_route.post('/edit',upload.single('photo'),userController.updateUser);


module.exports = u_route;