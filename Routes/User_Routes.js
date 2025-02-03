const express = require('express');
const path=require('path')
const userRoute = express();
const { Secure } = require('../Middleware/Auth')
const multer = require('multer');

const User_Controller = require('../Controllers/User_Controller')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })
const uploadSingal = upload.single('image'); // 'images' is the field name, max 5 files

userRoute.post('/signup',uploadSingal,User_Controller.SignUp)

userRoute.post('/user/login',User_Controller.Login)
userRoute.post('/logout',Secure,User_Controller.Logout)

module.exports = { userRoute }