import React, { useState, useEffect, useRef } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { Ellipsis } from 'react-awesome-spinners';
import { withRouter } from 'react-router-dom';
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

const Chat = ({ location, history }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ONLINE');

  useEffect(() => {


    const ENDPOINT = window.location.hostname + ':' + 7070;
    
    const name = "User" + Math.floor(Math.random() * 10000).toString();
    setUsername(name);

    
    socket = io(ENDPOINT);
    
    

    const message = {
      name: name,
      type: "CONNECTED",
      status: status
    }
    
    socket.on('error', error => {
      alert(error);
      history.push('/');
    })

    socket.emit('join', message, (error) => {
      
      if(error) {
        alert(error);
        history.push("/");
      }
      else {
        clearTimeout(timeID);
        setLoading(false);
      }
    });

    // Waiting for 10s
    let timeID = setTimeout(() => {
      loading && history.push("/");
    }, 10000);
  }, [location.search]);

  useEffect(() => {

    socket.on('message', (sMessage) => {
      console.log(sMessage);
      const {message, pictureMsg, fileMsg, type,  name} = sMessage;

      if (name.toLowerCase() === "admin" || name === username) {
          setMessages([...messages, 
            {
              text: message, 
              image: pictureMsg, 
              file: {
                name: message, 
                data: fileMsg
              }, 
              sender: name, 
              type
            }]);
      }
    });

    return () => {
      socket.off();
      console.log(messages);
    }
  }, [messages, username]);

  

  // useEffect(() => {
  //   socket.on('status', (sMessage) => {
  //     const { userlist } = sMessage;
  //     const info = userlist.filter(user => user.name === name);
  //     console.log(userlist, name);
  //     const status = info[0].status;
  //     setStatus(status);
  //   })
  // }, [status]);

  useEffect(() => {
    console.log("[Chat] Component Did Mount")
    

    return () => {
      console.log("[Chat] Component Will Unmount")
      if (!socket.disconnected) {
        socket.disconnect();
      }
      socket.off();

    }
  }, [])


  const sendStatus = event => {
    event.preventDefault();
    const status = event.target.alt
    const sMessage = {
      username,
      type: "STATUS",
      status
    }
    socket.emit('sendStatus', sMessage, () => setStatus(status));
  }
  

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      const sMessage = {
        username,
        message,
        type: "USER",
        status: "ONLINE"
      }
      socket.emit('sendMessage', sMessage, () => setMessage(''));
    }
  }

  const sendImage = (base64) => {
    console.log(base64)
    if(base64) {
      const sMessage = {
        username,
        message: base64,
        type: "PICTURE",
        status: "ONLINE"
      }
      socket.emit('sendImage', sMessage);
    }
  }

  const sendFile = (filename, base64)  => {
    if(base64) {
      const sMessage = {
        username,
        message: base64,
        picture: filename,
        type: "FILE",
        status: "ONLINE"
      }
      socket.emit('sendFile', sMessage);
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
            <InfoBar name={username} status={status} sendStatus={sendStatus}/>
            <Messages messages={messages} name={username} />
            <Input message={message} setMessage={setMessage} sendFile={sendFile} sendImage={sendImage} sendMessage={sendMessage} />
        </div>
        <TextContainer />
      </div>
    }
    </div>
  );
}

export default withRouter(Chat);
