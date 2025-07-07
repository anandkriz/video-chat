import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
// import "./chat-interface.css";
import { io } from 'socket.io-client';

export default function ChatInterface() {
  const [inputMsg,setInputMsg]=useState("")
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey Elon How Tesla going? 😊", sender: '1124', timestamp: "1 hour ago", isSent: true },
    { id: 2, text: "Oh faced a lot of hard time but now everything is good", sender: "7665", timestamp: "1 hour ago", isSent: false },
  ]);

  const contacts = [
    { id: 1, name: "Paul Walker", status: "offline", avatar: "/placeholder.svg" },
    { id: 2, name: "Elon Musk", status: "offline", avatar: "/placeholder.svg" },
    { id: 3, name: "Mark ZuckerBurg", status: "offline", avatar: "/placeholder.svg" },
    { id: 4, name: "Chou Tzu-yu", status: "offline", avatar: "/placeholder.svg" },
  ];
  const scroll = useRef();
  const socket=useRef()
  const params = new URLSearchParams(window.location.search);
  const user = params.get('user');
  const {userId}=useParams()
  console.log(userId)
  useEffect(()=>{
    socket.current = io.connect("https://video-chat-7w68.onrender.com");

    // socket.current=io.connect("http://localhost:8001")
    socket.current.emit("newUser",userId );
    socket.current.on("getAllUsers", (id) => {
        console.log(id)
        // setYourID(id);
    });
    socket.current.on("getMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
        socket.current.disconnect();
    };

  },[])

  useEffect(()=> {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])

  const sentMessage = () => {
    const newMessage = {
      id: Date.now(),
      text: inputMsg,
      sender:userId,
      timestamp: "1 hour ago",
      isSent: true,
      receiverId:userId==="1124"?"7665":"1124"
    };

    // setMessages([...messages, newMessage]);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMsg("");
    socket.current.emit("sentMessage",newMessage)
    console.log(user)
  }

// useEffect(()=>{
//   socket.current.on("getMessage", (data) => {
//     setMessages([...messages,data])
//     alert(data.text)
//     console.log(data)
//   })
// },[])


  return (
    <div className="chat-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <h1>Chats</h1>
        <div className="contacts">
          {contacts.map((contact) => (
            <div key={contact.id} className="contact-item">
              <img src={contact.avatar} alt={contact.name} />
              <div>
                <div className="name">{contact.name}</div>
                <div className="status">{contact.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-area">
        {/* Top Navigation */}
        <div className="top-nav">
          <input type="text" placeholder="#Explore" />
          <div className="icons">
            <button>🔔</button>
            <button>⚙️</button>
            <button>💬</button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div
            ref={scroll}
              key={message.id}
              className={`chat-message ${message.sender===userId ? "sent" : "received"}`}
            >
              <div className={`message-bubble ${message.sender===userId ? "sent" : "received"}`}>
                <p>{message.text}</p>
                <p className="message-timestamp">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="message-input">
          <button>➕</button>
          <input onKeyDown={(e) => e.key === "Enter" && sentMessage()} value={inputMsg} onChange={(e)=>setInputMsg(e.target.value)} type="text" placeholder="Type a message" />
          <button>😊</button>
          <button onClick={sentMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useRef, useState } from "react";
// import { io } from 'socket.io-client';

// export default function ChatInterface() {
//   const [inputMsg, setInputMsg] = useState("");
//   const [messages, setMessages] = useState([
//     { id: 1, text: "Hey Elon, How is Tesla going? 😊", sender: '1124', timestamp: "1 hour ago", isSent: true },
//     { id: 2, text: "Oh, faced a lot of hard times but now everything is good.", sender: "7665", timestamp: "1 hour ago", isSent: false },
//   ]);

//   const scroll = useRef();
//   const socket = useRef();
//   const params = new URLSearchParams(window.location.search);
//   const user = params.get('user');

//   useEffect(() => {
//     socket.current = io("http://localhost:8001");
//     socket.current.emit("newUser", user);

//     socket.current.on("getAllUsers", (users) => {
//       console.log("Active Users: ", users);
//     });

//     socket.current.on("getMessage", (data) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, [user]); // Initialize socket only once with `user`

//   useEffect(() => {
//     scroll.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sentMessage = () => {
//     if (!inputMsg.trim()) return; // Prevent sending empty messages

//     const newMessage = {
//       id: Date.now(),
//       text: inputMsg,
//       sender: user,
//       timestamp: new Date().toLocaleTimeString(),
//       isSent: true,
//       receiverId: user === "1124" ? "7665" : "1124", // Example logic for receiver
//     };

//     setMessages((prevMessages) => [...prevMessages, newMessage]);
//     setInputMsg("");
//     socket.current.emit("sentMessage", newMessage);
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-area">
//         <div className="chat-messages">
//           {messages.map((message) => (
//             <div
//               ref={scroll}
//               key={message.id}
//               className={`chat-message ${message.sender === user ? "sent" : "received"}`}
//             >
//               <div className={`message-bubble ${message.sender === user ? "sent" : "received"}`}>
//                 <p>{message.text}</p>
//                 <p className="message-timestamp">{message.timestamp}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="message-input">
//           <input
//             value={inputMsg}
//             onChange={(e) => setInputMsg(e.target.value)}
//             type="text"
//             placeholder="Type a message"
//           />
//           <button onClick={sentMessage}>Send</button>
//         </div>
//       </div>
//     </div>
//   );
// }