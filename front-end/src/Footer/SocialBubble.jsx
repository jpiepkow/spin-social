import React from 'react';
import { observer } from 'mobx-react';
const SocialBubble = props => (
  <div className={'social-flex'}>
    <div className="circleBase type2">
      <a href={props.href}>
        <img className="socialLogo" src={props.icon} alt="spin" />
      </a>
    </div>
  </div>
);
export default observer(SocialBubble);
