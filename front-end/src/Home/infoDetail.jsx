import { observer } from 'mobx-react';
import React from 'react';
import './Home.css';
const InfoDetail = props => {
  return (
    <div className="infoChunk row">
      <div className="innerContent">
        <div className="circleBase type1">
          <div className="infoLogo">
            <img className="logo-in-content" src={props.imgSrc} alt="spin" />
          </div>
        </div>
        <div className="infoDetailTitle">
          <p className="fontRegular">{props.title}</p>
        </div>
        <div className="infoDetailText">
          <p className="bodyFont">{props.text}</p>
        </div>
      </div>
    </div>
  );
};
export default observer(InfoDetail);
