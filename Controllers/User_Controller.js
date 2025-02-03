const User = require('../Models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../Config/Cloudinary')
const path=require('path');
const { console } = require('inspector');


const generateTokens = (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { accessToken };
};

// Register new user
const SignUp = async (req, res) => { 
    try {
        console.log(req.file)

        const { name, email, password } = req.body;

        // Check if email already exists in the database
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const file = req.file; // File will now be available here
      if (!file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }
       // Upload image to Cloudinary
       const result = await cloudinary.uploader.upload(file.path);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,  // Use 'password' field here
            image: result.secure_url,
        });


        await newUser.save();

        res.status(201).json({ message: 'User Registered successfully' });
    } catch (error) {
        console.log('Registration failed', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};


const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {

            return res.status(401).json({ message: 'Invalid email or password' });

        }

        const isMatch = await bcrypt.compare(password, user.password);  // Use 'password' field here
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate tokens 
        const { accessToken } = generateTokens(user);
        res.cookie('token', accessToken, {
            httpOnly: true,  // Security measure, to prevent client-side JavaScript access
            maxAge: 60 * 60 * 1000,  // Cookie expiration time (1 hour here)
        });
        const userData = await User.findById(user._id).select('-password'); // Find the logged-in user and exclude the password
        const allUsers = await User.find({ _id: { $ne: userData._id } }).select('-password'); // Find all users except the logged-in user and exclude their passwords
        
        // You can now return or use both `userData` and `allUsers`
        

        res.status(200).json({ message: 'Login Successfully' ,userData,allUsers, token: accessToken});
    } catch (error) {
        console.log('Login failed', error);
        res.status(500).json({ message: 'Login failed' });
    }
};




const Logout = async (req, res) => {
    try {
            // Clear the token cookie
            res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None' });
            res.status(200).json({ message: 'Logged out successfully' });
        
    } catch (error) {
        console.log('Logout failed', error);
        res.status(500).json({ message: 'Logout failed' });
    }
}



module.exports = {
    SignUp,
    Login,
    Logout
}