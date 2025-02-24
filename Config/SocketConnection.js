const User = require('../Models/userModel');
const ChatModel = require('../Models/ChatModel');
const GroupMessage = require('../Models/GroupMessages');
const getSocketConnetction = async (io) => {
    try {
        io.on('connection', (socket) => {
            console.log('New client connected: ' + socket.id);

            socket.on('status', async (message) => {
                try {
                    console.log('Received status message:', message);
                    const findUser = await User.findOneAndUpdate(
                        { _id: message.userId },
                        { is_online:  message.status },
                        { new: true }
                    );
                    if (findUser) {
                        console.log('User status updated:');
                    } else {
                        console.log('User not found:', message.userId);
                    }
                } catch (error) {
                    console.error('Error updating status:', error.message);
                }
            });

                socket.on('sendMessage', async (message) => { 
                try {
                    
                    const newMessage = new ChatModel({
                        sender: message.senderId,
                        receiver: message.receiverId,
                        message: message.message
                    });
                    await newMessage.save();
                    io.emit('message', newMessage);
                } catch (error) {
                    console.error('Error sending message:', error.message);
            
                }
            });

            socket.on('sendGroupMessage', async ({ senderId, groupId, message }) => {
                // Handle group messages
                const newGroupMessage = new GroupMessage({ senderId, groupId, message });
                await newGroupMessage.save();
                socket.emit('message', newGroupMessage);
            });

           

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    } catch (error) {
        console.error(`Error setting up socket connection: ${error.message}`);
    }
};

module.exports = { getSocketConnetction };