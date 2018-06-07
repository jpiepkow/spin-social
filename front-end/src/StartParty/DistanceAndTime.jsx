import React, { Component } from 'react';
import { observer } from 'mobx-react';
import InfoContent from '../Home/InfoContent';
import logoOne from '../Assets/icons/icon6.png';
import NLForm from '../NLForm';
class StartPartyParent extends Component {
  componentWillMount() {
    navigator.geolocation.getCurrentPosition(pos => {
      this.props.route.stores.user.setLocation(
        'create',
        pos.coords.latitude,
        pos.coords.longitude
      );
    });
  }

  render() {
    var callbackFunction = state => {
      this.props.route.stores.user.setTimeAndDistance(state);
    };
    var selectObj = {
      time: [
        { key: 3600, value: '1 hour', selected: true },
        { key: 7200, value: '2 hour', selected: false },
        { key: 10800, value: '3 hour', selected: false },
        { key: 14400, value: '4 hour', selected: false },
        { key: 18000, value: '5 hour', selected: false },
        { key: 21600, value: '6 hour', selected: false },
        { key: 25200, value: '7 hour', selected: false },
        { key: 28800, value: '8 hour', selected: false },
        { key: 86400, value: '24 hour', selected: false }
      ],
      distance: [
        { key: 50, value: '50 meters', selected: true },
        { key: 100, value: '100 meters', selected: false },
        { key: 500, value: '500 meters', selected: false },
        { key: 1609, value: '1 mile', selected: false },
        { key: 3218, value: '2 mile', selected: false },
        { key: 4827, value: '3 mile', selected: false },
        { key: 6436, value: '4 mile', selected: false },
        { key: 8045, value: '5 mile', selected: false }
      ]
    };
    var sentence = 'i want my playlist to last {time} and joinable from up to {distance}';
    return (
      <div className="nameSong">
        <InfoContent style={{ width: '80%' }} imgSrc={logoOne}>
        <div style={{paddingTop:'30px'}} >
            
          <NLForm
            sentence={sentence}
            select={selectObj}
            onSub={callbackFunction}
          />
          </div>
        </InfoContent>
      </div>
    );
  }
}
export default observer(StartPartyParent);
