import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

import {encode, decode} from 'base64-arraybuffer'


const Message = ({ message: {text, image, file , sender, type}, name}) => {
  const _arrayBufferToBase64 = buffer => {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}
  
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if(sender === name) {
    isSentByCurrentUser = true;
  }

  let header, filetype;

  const switcher = {
    "zip": "data:application/zip;base64,",
    "pdf": "data:application/pdf;base64,",
    "mp3": "data:audio/mp3;base64,", 
    "jpg": "data:image/jpg;base64,",
    "png": "data:image/png;base64",
  }

  if (type === "FILE") {
    const str = file.name.split('.');
    filetype = str[str.length - 1];
    header = switcher[filetype]
  }
  


  console.log({text, image, file , sender, type});

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            {type === "USER" && <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>}
            {type === "PICTURE" && <img className="messageImage" src={`data:image/png;base64,${Uint8ToString(image)}`} />}
              {
                type === "FILE" && 
                (filetype === "zip" ? 
                  <a className="messageLink colorWhite" target='_blank' href={`${header}${Uint8ToString(file.data)}`}>
                    {file.name}
                  </a> :
                  <p className="messageText colorRed">{ReactEmoji.emojify(text)}</p>
                )
              }
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              {type === "USER" && <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>}
              {type === "PICTURE" && <img className="messageImage" src={`data:image/png;base64,${Uint8ToString(image)}`} />}
              {
                type === "FILE" && 
                (filetype === "zip" ? 
                  <a className="messageLink colorBlue" target='_blank' href={`${header}${Uint8ToString(file.data)}`}>
                    {file.name}
                  </a> :
                  <p className="messageText colorRed">{ReactEmoji.emojify(text)}</p>
                )
              }
            </div>
            <p className="sentText pl-10 ">{sender}</p>
          </div>
        )
  );
}

function Uint8ToString(u8a) {
  var CHUNK_SZ = 54000;
  var c = [];
  console.log(u8a.byteLength, u8a.slice(0, 10))
  for (var i=0; i < u8a.byteLength; i+=CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, new Uint8Array(u8a.slice(i, i+CHUNK_SZ))));
  }
  console.log(c.length)
  return c.join("");
}
export default Message;