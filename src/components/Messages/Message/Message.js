import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

import {encode, decode} from 'base64-arraybuffer'


const Message = ({ message: {text, image, file , sender, type}, name}) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim();

  if(sender === name) {
    isSentByCurrentUser = true;
  }

  let mime, filetype;

  const switcher = {
    "zip": "data:application/zip;base64,",
    "pdf": "data:application/pdf;base64,",
    "txt": "data:text/plain;base64,",
    "mp3": "data:audio/mp3;base64,", 
    "mp4": "data:video/mp4;base64,",
    "jpg": "data:image/jpg;base64,",
    "png": "data:image/png;base64",
  }

  if (type === "FILE") {
    const str = file.name.split('.');
    filetype = str[str.length - 1];
    mime = switcher[filetype]
  }
  

  const generateDownloader = (data, filename, mime) => {

    const blob = b64toBlob(Uint8ToString(data),mime);
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were 
        // revoked by closing the blob for which they were created. 
        // These URLs will no longer resolve as the data backing 
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        const blobURL = window.URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename); 
        
        // Safari thinks _blank anchor are pop ups. We only want to set _blank
        // target if the browser does not support the HTML5 download attribute.
        // This allows you to download files in desktop safari if pop up blocking 
        // is enabled.
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }
        
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
    }
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
                type === "FILE" && mime &&
                
                  
                  <p className="messageLink colorWhite" onClick={() => generateDownloader(file.data, text, mime)}>
                    {ReactEmoji.emojify(text)}
                  </p>
                   
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
                
                  
                  <p className="messageLink colorBlue" onClick={() => generateDownloader(file.data, text, mime)}>
                    {ReactEmoji.emojify(text)}
                  </p> 
                  
                
              }
            </div>
            <p className="sentText pl-10 ">{sender}</p>
            {/* <a className="messageLink colorBlue" target='_blank' href={`${mime}${Uint8ToString(file.data)}`}>
                    {file.name}
                  </a> : */}
          </div>
          
        )
  );
}

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
    
  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function Uint8ToString(u8a) {
  var CHUNK_SZ = 54000;
  var c = [];

  for (var i=0; i < u8a.byteLength; i+=CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, new Uint8Array(u8a.slice(i, i+CHUNK_SZ))));
  }
  console.log(c.length)
  return c.join("");
}
export default React.memo(Message, 
  ({ message, name}) => {
    return message === message;
  }
);