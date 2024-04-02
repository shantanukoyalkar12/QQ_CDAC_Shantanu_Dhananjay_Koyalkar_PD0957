
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import io from 'socket.io-client';
import  './ind.css';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCsKqsicalD0odA9nOdA19rcb0z0npM7eE",
  authDomain: "chatappshantanu.firebaseapp.com",
  databaseURL: "https://chatappshantanu-default-rtdb.firebaseio.com",
  projectId: "chatappshantanu",
  storageBucket: "chatappshantanu.appspot.com",
  messagingSenderId: "1038562343545",
  appId: "1:1038562343545:web:bf9b813f7ee66ca888f2a8",
  measurementId: "G-NKQBD9PSZZ"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const socket = io('http://localhost:3001');

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    const messagesRef = ref(db, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.values(data));
      }
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    signInWithPopup(auth, provider);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      text: newMessage,
      sender: user.displayName,
      timestamp: new Date().toISOString(),
    };

    push(ref(db, 'messages'), message);

    socket.emit('message', message);

    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <h1>Chat Application</h1>
      {user ? (
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div className="chat-message" key={index}>
                <strong>{message.sender}: </strong>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <button className="sign-in-button" onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;
