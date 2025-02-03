const dotenv=require('dotenv').config();
const JWT = require('jsonwebtoken');

const Secure = async (req, res, next) => {
    try {

        const token = req.cookies.token; // Access token directly
        if (!token) {
            return res.status(401).send({ message: 'Please Login First' });
        }

        // Verify the token
        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: 'Token expired or invalid' });
            }
            req.user = decoded;
            next();
        });
        
    } catch (error) {
        console.error("Token Verification Error:", error.message); // Debugging log
        return res.status(401).send({ message: 'Invalid Token' });
    }
};

module.exports = { Secure };
