const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running');
});

const wss = new WebSocket.Server({ server });

let clientIdCounter = 1;

wss.on('connection', (ws) => {
    const clientName = `User${clientIdCounter++}`; // Assign a unique name
    console.log(`${clientName} connected`);
    ws.send(JSON.stringify({ type: 'info', message: `Welcome, ${clientName}!` })); // Send a welcome message

    ws.on('message', (message) => {
        const textMessage = message.toString(); // Ensure message is a string
        console.log(`Received from ${clientName}:`, textMessage);

        // Broadcast the message with the sender's name
        const broadcastMessage = JSON.stringify({ type: 'chat', name: clientName, message: textMessage });
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(broadcastMessage);
            }
        });
    });

    ws.on('close', () => {
        console.log(`${clientName} disconnected`);
    });
});

// Start the server on port 8080
server.listen(8080, () => {
    console.log('Server is listening on ws://localhost:8080');
});
