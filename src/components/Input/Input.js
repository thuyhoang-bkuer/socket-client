import React from 'react';

import { FilePicker, ImagePicker } from 'react-file-picker';

import './Input.css';

const Input = ({ setMessage, sendMessage, sendImage, sendFile, message }) => {
  
  const handleFile = file => {
      const reader = new FileReader();
      // Read file content on file loaded event
      reader.onload = function(event) {
        console.log(reader)
        sendFile(file.name, getBase64(reader.result));
      };
      
      // Convert data to base64 
      reader.readAsDataURL(file);
    };
  


  return (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <button className="sendButton" onClick={e => sendMessage(e)}><span role="img" aria-label="emoji">➤</span></button>
    <div className="group">
      <div className="sendImage">
        <ImagePicker

          extensions={['jpg', 'jpeg', 'png']}
          dims={{minWidth: 100, maxWidth: 1024, minHeight: 100, maxHeight: 1980}}
          onChange={base64 => sendImage(getBase64(base64))}
          onError={errMsg => alert(errMsg)}
        >
        <span role="img" aria-label="emoji">🏞</span>
        </ImagePicker>
      </div>
      <div className="sendFile" >
        <FilePicker
          extensions={['zip', 'pdf', 'mp3', 'mp4']}
          onChange={fileObject => handleFile(fileObject)}
          onError={errMsg => alert(errMsg)}
        >
        <span role="img" aria-label="emoji">📂</span>
        </FilePicker>
      </div>
    </div>
  </form>
) 
}

function getBase64(dataURI) {
  const BASE64_MARKER = ';base64,';
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  
  return base64;
}

export default Input;