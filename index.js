const dotenv = require('dotenv').config();
const { ConnectDB } = require("./DB/DB");
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS configuration for client-side requests
const cors = require('cors');
const { getSocketConnetction } = require('./Config/SocketConnection');
app.use(cors({
    origin: [
        'https://chatapp-rho-beryl.vercel.app', // deployed frontend
        'http://localhost:3000',                // local frontend
        'https://chat-app-server-6z4y.onrender.com'     // <-- add your deployed backend if needed
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,  // Allow cookies to be sent with requests
}));

app.options('*', cors());  // This handles OPTIONS requests for all routes

// Create HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.IO on the HTTP server
const io = socketio(server, {
    cors: {
        origin: [
            "https://chatapp-rho-beryl.vercel.app",
            "http://localhost:3000",
            "https://chat-app-server-6z4y.onrender.com" // <-- add here too if needed
        ],
        methods: ["GET", "POST"]
    },
    debug: true, // Logging ke liye
});

getSocketConnetction(io);
// Connect to the server


// Connect to the database
ConnectDB();


app.use('/api',require('./Routes/User_Routes').userRoute);

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
