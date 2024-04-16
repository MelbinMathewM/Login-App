const express = require('express');
const a_route = express();
const session = require('express-session');

const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const config = require('../config/config');
const multer = require('multer');
const path = require('path');


a_route.use(session({
    secret : config.sessionSecretos,
    resave : false,
    saveUninitialized : false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

a_route.use(express.json());
a_route.use(express.urlencoded({ extended : true }));

a_route.set('view engine','ejs');
a_route.set('views','views/admin');

a_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,path.join(__dirname,'../public/userImages'))
    },
    filename : (req,file,cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null,name)
    }
});
const upload = multer({ storage : storage });

a_route.get('/',adminAuth.isLogout,adminController.loadLogin);
a_route.post('/',adminController.verifyAdmin);
a_route.get('/home',adminAuth.isLogin,adminController.loadHome);
a_route.get('/logout',adminAuth.isLogin,adminController.logoutAdmin);
a_route.get('/dashboard',adminAuth.isLogin,adminController.loadDashboard);
a_route.get('/new-user',adminAuth.isLogin,adminController.loadNewUser);
a_route.post('/new-user',upload.single('photo'),adminController.addUser);
a_route.get('/edit-user',adminAuth.isLogin,adminController.editUser);
a_route.post('/edit-user',adminAuth.isLogin,adminController.updateUser);
a_route.get('/delete-user',adminAuth.isLogin,adminController.deleteUser);

module.exports = a_route;
