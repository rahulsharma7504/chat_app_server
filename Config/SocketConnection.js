const User = require('../Models/userModel');
const ChatModel = require('../Models/ChatModel');
const GroupMessage = require('../Models/GroupMessages');
const getSocketConnetction = async (io) => {
    try {
        io.on('connection', (socket) => {
            console.log('New client connected: ' + socket.id);

            // Store userId associated with this socket
            socket.userId = null;

            socket.on('status', async (message) => {
                try {
                    console.log('Received status message:', message);
                    socket.userId = message.userId; // associate userId with socket

                    const findUser = await User.findOneAndUpdate(
                        { _id: message.userId },
                        { is_online: message.status },
                        { new: true }
                    );
                    if (findUser) {
                        console.log('User status updated:');
                        // Broadcast user status update to all clients
                        io.emit('userStatusUpdate', { userId: message.userId, status: message.status });
                    } else {
                        console.log('User not found:', message.userId);
                    }
                } catch (error) {
                    console.error('Error updating status:', error.message);
                }
            });

            socket.on('joinGroup', (groupId) => {
                socket.join(groupId);
                console.log(`Socket ${socket.id} joined group ${groupId}`);
            });

            socket.on('sendMessage', async (message) => { 
                try {
                    const newMessage = new ChatModel({
                        sender: message.senderId,
                        receiver: message.receiverId,
                        message: message.message,
                        timestamp: new Date()
                    });
                    await newMessage.save();
                    io.emit('message', newMessage);
                } catch (error) {
                    console.error('Error sending message:', error.message);
                }
            });

            socket.on('sendGroupMessage', async ({ senderId, groupId, message }) => {
                try {
                    const newGroupMessage = new GroupMessage({ senderId, groupId, message, timestamp: new Date() });
                    await newGroupMessage.save();
                    // Emit to all sockets in the group room including sender
                    io.in(groupId).emit('message', newGroupMessage);
                } catch (error) {
                    console.error('Error sending group message:', error.message);
                }
            });

            socket.on('disconnect', async () => {
                console.log('Client disconnected');
                if (socket.userId) {
                    try {
                        const findUser = await User.findOneAndUpdate(
                            { _id: socket.userId },
                            { is_online: 'Offline' },
                            { new: true }
                        );
                        if (findUser) {
                            console.log('User status set to Offline on disconnect:', socket.userId);
                            io.emit('userStatusUpdate', { userId: socket.userId, status: 'Offline' });
                        }
                    } catch (error) {
                        console.error('Error updating status on disconnect:', error.message);
                    }
                }
            });
        });
    } catch (error) {
        console.error(`Error setting up socket connection: ${error.message}`);
    }
};

module.exports = { getSocketConnetction };