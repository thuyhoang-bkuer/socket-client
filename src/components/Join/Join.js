import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

import './Join.css';




function SignIn() {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  

  const isInvalid = () => {
    const validPort = port.match(/[0-9]*/) && port.match(/[0-9]*/)[0] === port && parseInt(port) > 1024 && parseInt(port) < 65535;
    return !name || !port || !host || !validPort;
  }


  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Host" className="joinInput" type="text" onChange={(event) => setHost(event.target.value)} />
        </div>
        <div>
          <input placeholder="Port" className="joinInput" type="text" onChange={(event)   => setPort(event.target.value)} />
        </div>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <Link onClick={e => isInvalid() ? e.preventDefault() : null} to={`/chat?name=${name}&host=${host}&port=${port}`}>
          <button className={'button mt-20'} type="submit">Sign In</button>
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
