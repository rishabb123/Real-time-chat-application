import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]); // Store chat messages
    const [input, setInput] = useState(''); // Message input
    const [socket, setSocket] = useState(null); // WebSocket connection
    const [userName, setUserName] = useState(''); // Store the client's name

    useEffect(() => {
        // Initialize WebSocket connection
        const ws = new WebSocket('ws://localhost:8080');
        setSocket(ws);

        // Handle incoming messages from the server
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse JSON data

            if (data.type === 'info') {
                // Server info message, e.g., welcome and user name assignment
                setUserName(data.message.split(', ')[1]); // Extract the user's name
                console.log(data.message);
            } else if (data.type === 'chat') {
                // Chat message with a name and text
                setMessages((prevMessages) => [...prevMessages, `${data.name}: ${data.message}`]);
            }
        };

        // Log errors
        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        // Log connection close
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // Cleanup WebSocket connection on component unmount
        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (socket && input.trim() !== '') {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(input); // Send the message to the WebSocket server
                setInput(''); // Clear the input field
            } else {
                console.error('WebSocket is not open');
            }
        }
    };

    return (
        <div className="App">
            <h1>Real-Time Chat with WebSocket</h1>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p> // Display each message
                ))}
            </div>
            <div className="input-box">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div className="user-info">
                <p>{userName && `Your name: ${userName}`}</p>
            </div>
        </div>
    );
}

export default App;
