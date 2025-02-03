
const getSocketConnetction = async (io) => {
    try {
        io.on('connection', (socket) => {
            console.log('New client connected  ' + socket.id);

            socket.on('status', (data) => {
                console.log('Status event received with user ID:', data.id);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        })

    } catch (error) {
        console.error(`Error connecting to the server: ${error.message}`);

    }
}

module.exports = { getSocketConnetction };


