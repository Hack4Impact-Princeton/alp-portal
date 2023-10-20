// // import { useEffect, useState } from 'react'
// // // import io from 'Socket.IO-client'
// // const io = 'socket.io-client'

// // const Home = () => {
// //   const [input, setInput] = useState('')
// //   const [receivedInput, setReceivedInput] = useState('')
// //   useEffect(() => socketInitializer(), [])
// //   const socketInitializer = async () => {
// //         await fetch('api/socket')
// //         socket = io()
// //         socket.on('connect', () => {
// //           console.log("connected in the client")
// //         })
// //         socket.on('update-input', msg => {
// //           setReceivedInput(msg)
// //         })
// //   }

// //   const onChangeHandler = async(e) => {
// //     setInput(e.target.value)
// //     console.log("emitting this value", e.target.value)
// //     await socket.emit('input-change', e.target.value)
// //   }

// //   return (
// //     <>
// //     <input
// //       placeholder="Type something"
// //       value={input}
// //       onChange={onChangeHandler}
// //       />
// //     <input value={receivedInput} readOnly/>
// //       </>
// //   )
// // }

// // export default Home;
// // import io from 'socket.io-client'
// // import {useState, useEffect} from 'react'
// // let socket;

// // const Home = () => {
// //   const [input, setInput] = useState('')

// //   useEffect(() => socketInitializer(), [])

// //   const socketInitializer = async () => {
// //     await fetch('/api/socket');
// //     socket = io()

// //     socket.on('connect', () => {
// //       console.log('connected')
// //     })

// //     socket.on('update-input', msg => {
// //       setInput(msg)
// //     })
// //   }

// //   const onChangeHandler = (e) => {
// //     setInput(e.target.value)
// //     socket.emit('input-change', e.target.value)
// //   }

// //   return (
// //     <input
// //       placeholder="Type something"
// //       value={input}
// //       onChange={onChangeHandler}
// //     />
// //   )
// // }

// // export default Home;
// import { useEffect, useState } from 'react';

// const HomePage = () => {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [message, setMessage] = useState<string>('');
//   const [socket, setSocket] = useState<WebSocket | null>(null);

//   useEffect(() => {
//     const newSocket = new WebSocket('ws://localhost:3000/ws');

//     newSocket.addEventListener('open', () => {
//       setSocket(newSocket);
//     });

//     newSocket.addEventListener('message', (event) => {
//       setMessages((prevMessages) => [...prevMessages, event.data]);
//     });

//     return () => {
//       if (socket) {
//         socket.close();
//       }
//     };
//   }, [socket]);

//   const handleSendMessage = () => {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(message);
//       setMessage('');
//     } else {
//       console.error('WebSocket is not open.');
//     }
//   };

//   return (
//     <div>
//       <h1>WebSocket Messaging</h1>
//       <div>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//       <div>
//         {messages.map((msg, index) => (
//           <div key={index}>{msg}</div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HomePage;
