import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Home = () => {
  const [input, setInput] = useState('');
  let socket;

  useEffect(() => {
    // Fetch to ensure server is up (you can adjust the endpoint)
    async function socketInitializer() {
      await fetch('/api/socket');
      // Establish a Socket.IO connection
      socket = io('http://localhost:3000');

      socket.on('connect', () => {
        console.log('connected');
      });

      socket.on('update-input', (msg) => {
        setInput(msg);
      });
    }

    socketInitializer();

    return () => {
      // Clean up the socket connection when the component unmounts
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const onChangeHandler = (e) => {
    const newInput = e.target.value;
    setInput(newInput);

    // Console log the input value
    console.log('Input value:', newInput);

    // Emit the 'input-change' event to the server
    if (socket) {
      socket.emit('input-change', newInput);
    }
  };

  return (
    <div>
      <input
        placeholder="Type something"
        value={input}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default Home;
