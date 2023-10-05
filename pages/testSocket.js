import { useEffect, useState } from 'react'
import io from 'Socket.IO-client'
let socket;

const Home = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
  async function socketInitializer() {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('update-input', (msg) => {
      setInput(msg);
    });
  }

  socketInitializer(); // Call the async function immediately
  return () => {
  };
}, []); // Ensure you pass an empty dependency array if the effect doesn't depend on any props or state

  const onChangeHandler = (e) => {
    setInput(e.target.value)
    socket.emit('input-change', e.target.value)
  }

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  )
}

export default Home;