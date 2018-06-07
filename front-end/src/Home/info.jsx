import React, { Component } from 'react';
import { observer } from 'mobx-react';
import InfoDetail from './infoDetail';
import './Home.css';
import logoOne from '../Assets/icons/icon.png';
import logoTwo from '../Assets/icons/icon2.png';
import logoThree from '../Assets/icons/icon3.png';
class Info extends Component {
  render() {
    var infoArr = [
      (
        <InfoDetail
          key="1"
          imgSrc={logoOne}
          title="join a playlist"
          text="Whether it’s night out with the friends, listening to your favorite tune at your local coffee shop,
							or a day at your 9-5, joining a spin playlist can create a collabrative way to share music you want played."
        />
      ),
      (
        <InfoDetail
          key="2"
          imgSrc={logoTwo}
          title="add your song"
          text="Once you join a spin playlist, start adding your flare by suggesting what you want played.
							Everyone has a chance to add songs they want played, creating the most awesome playlist ever."
        />
      ),
      (
        <InfoDetail
          key="3"
          imgSrc={logoThree}
          title="vote on music"
          text="Vote on what songs you want to hear next on the spin playlist and request your own songs.
          End up with the most votes, that means your song is the chosen one that everyone will get to jam along to."
        />
      )
    ];
    return (
      <div className="bottom">
        {infoArr}
      </div>
    );
  }
}
export default observer(Info);
