import { observer } from 'mobx-react';
import React from 'react';
import TimerHelper from '../Helpers/T';

import './Home.css';
const InfoContent = props => {
  return (
    <div className="infoChunk row">
      <div style={{height:props.height}} className="innerContent">
        <div className="circleBase type1">
          <div className="infoLogo">
            {
              props.imgSrc
                ? <img className="logo-in-content" src={props.imgSrc} alt="spin" />
                : <TimerHelper time={props.time} uuid={props.uuid} />
            }
            {' '}
          </div>
        </div>
        {props.children}
      </div>
    </div>
  );
};
export default observer(InfoContent);
