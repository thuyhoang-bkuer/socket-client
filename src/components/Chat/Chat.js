import React, { useState, useEffect, useRef } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { Ellipsis } from 'react-awesome-spinners';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

function useDidUpdate (callback, deps) {
  const hasMount = useRef(false)

  useEffect(() => {
    if (hasMount.current) {
      callback()
    } else {
      hasMount.current = true
    }
  }, deps)
}

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { name, host, port } = queryString.parse(location.search);
    const ENDPOINT = host + ':' + port;

    console.log("Info: ", name, host, port);

    socket = io(ENDPOINT);
    
    setName(name);

    const message = {
      name: name,
      type: "CONNECTED",
      status: "ONLINE"
    }
    socket.emit('join', message, (error) => {
      setLoading(false)
      if(error) {
        alert(error);
      }
    });
  }, [location.search]);

  useEffect(() => {
    socket.on('message', (sMessage) => {
      console.log(sMessage);
      const {message, name} = sMessage;
      setMessages([...messages, {text: message, sender: name} ]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    })

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      const sMessage = {
        name,
        message,
        type: "USER",
        status: "ONLINE"
      }
      socket.emit('sendMessage', sMessage, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
    {
      loading ?
      <Ellipsis/>
      :
      <div className="outerContainer">
        <div className="container">
            <InfoBar room={room} />
            <Messages messages={messages} name={name} />
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
        <TextContainer users={users}/>
      </div>
    }
    </div>
  );
}

export default Chat;
