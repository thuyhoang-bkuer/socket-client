import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import busyIcon from '../../icons/busyIcon.png';
import awayIcon from '../../icons/awayIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ name, status, sendStatus }) => {
  
  return (
  <div className="infoBar">
    <div className="leftInnerContainer">
      {status === "ONLINE" && <img className="icon" onClick={e => sendStatus(e)} src={onlineIcon} alt="AWAY" />}
      {status === "AWAY"   && <img className="icon" onClick={e => sendStatus(e)} src={awayIcon} alt="BUSY" />}
      {status === "BUSY"   && <img className="icon" onClick={e => sendStatus(e)} src={busyIcon} alt="ONLINE" />}
      <h3>{name}</h3>
    </div>
    <div className="rightInnerContainer">
      <a href="/"><img src={closeIcon} alt="close icon" /></a>
    </div>
  </div>
)};

export default InfoBar;