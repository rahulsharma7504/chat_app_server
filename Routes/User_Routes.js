const express = require('express');
const path = require('path')
const userRoute = express();
const { Secure } = require('../Middleware/Auth')
const multer = require('multer');
const { cloudinary } = require('../Config/Cloudinary')
const User_Controller = require('../Controllers/User_Controller')
const GroupModel = require('../Models/GroupModel')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })
const uploadSingal = upload.single('groupImage'); // 'images' is the field name, max 5 files

userRoute.post('/signup', uploadSingal, User_Controller.SignUp)
userRoute.get('/test', (req,res)=>{
    res.send("Node Working")
})

userRoute.post('/user/login', User_Controller.Login)
userRoute.post('/logout', Secure, User_Controller.Logout)
userRoute.post('/all-users/:userId', User_Controller.getAllUsers)
userRoute.get('/chat', User_Controller.fetchChats)
userRoute.get('/chat/group', User_Controller.fetchGroupChats) 
userRoute.post('/auth/google', User_Controller.googleAuth)
// For Create Group 
userRoute.post('/create/:userId', upload.single('groupImage'), async (req, res) => {
    try {
        const { groupName, userLimit, selectedUsers } = req.body;
       const uploadGroupImage = req.file.path;


        const cloudinaryResponse = await cloudinary.uploader.upload(uploadGroupImage);
        const groupImage = cloudinaryResponse.secure_url;
        const groupData = {
            name: groupName,
            image: groupImage,
            userLimit,
            users: selectedUsers, 
            createdBy: req.params.userId
        }
        const group = new GroupModel(groupData);
        await group.save();
        res.status(200).json({ message: 'Group created successfully' });
    } catch (error) {
        console.error('Error creating group:', error.message);
        res.status(500).send({ message: 'Server Error' });
    }

})


userRoute.put('/profile/:userId', User_Controller.userProfile)
userRoute.delete('/group/leave', User_Controller.Leave_To_Group)
userRoute.put('/group/add-users', User_Controller.addusersToGroup)
// userRoute.delete('/group/leave', async(req,res)=>{
//     try { 
//         const { groupId, userId } = req.body;
//         if (!groupId || !userId) {
//             return res.status(400).json({ message: 'Missing groupId or userId' });
//         }

//         // Find the group by ID
//         const group = await GroupModel.findById(groupId);

//         if (!group) {
//             return res.status(404).json({ message: 'Group not found' });
//         }

//         // Check if the user is part of the group
//         const userIndex = group.users.indexOf(userId);
//         if (userIndex === -1) {
//             return res.status(400).json({ message: 'User is not a member of the group' });
//         }

//         // Remove the user from the group
//         group.users.splice(userIndex, 1);

//         // Save the updated group
//         await group.save();

//         res.status(200).json({ message: 'User has left the group successfully' });
//     } catch (error) {
//         console.error('Error leaving group:', error.message);
//         res.status(500).send({ message: 'Server Error' });
//     }
// })


module.exports = { userRoute }