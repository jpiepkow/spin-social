import React, { Component } from 'react';
import './Footer.css';
import SocialBubble from './SocialBubble';
import { observer } from 'mobx-react';
import facebook from '../Assets/icons/icon7.png';
import twitter from '../Assets/icons/icon8.png';
import instagram from '../Assets/icons/icon9.png';
class Footer extends Component {
  render() {
    let socialBubbles = [
      (
        <SocialBubble
          key="facebook"
          icon={facebook}
          href="https://www.facebook.com/spindotsocial"
        />
      ),
      (
        <SocialBubble
          key="twitter"
          icon={twitter}
          href="https://twitter.com/spindotsocial"
        />
      ),
      (
        <SocialBubble
          key="instagram"
          icon={instagram}
          href="https://instagram.com/spinsocial"
        />
      )
    ];
    return (
      <div style={{height:'100%'}}>
        <div className="App-footer">
          <div className="flex-row">
            {socialBubbles}
          </div>
        </div>
      </div>
    );
  }
}

export default observer(Footer);
