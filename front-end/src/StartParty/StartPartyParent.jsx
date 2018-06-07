import React, { Component } from 'react';
import { observer } from 'mobx-react';
import InfoContent from '../Home/InfoContent';
import logoOne from '../Assets/icons/icon6.png';
import SelectorConnector from '../songSelector/SelectorConnector';
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
    var handleSubmit = text => {
      this.props.route.stores.user.setCreateName(text);
    };
    return (
      <div className="nameSong">
        <InfoContent imgSrc={logoOne}>
          <p style={{ paddingTop: '50px' }} className="fontRegular">
            what are you waiting for?
          </p>
          <p style={{ paddingTop: '7px' }} className="bodyFont">
            Create a spin playlist below and invite your friends, family,<br />
            or jam out with some new people. <br />Make sure to allow location services when asked so people can find your playlist!
          </p>
          <div style={{ display: 'inline-block' }}>
            <div className="row" style={{ paddingTop: '20px' }}>
              <SelectorConnector
                icon={<i style={{color:'white',fontSize:'24px'}} className="icon ion-ios-arrow-right"></i>}
                to="/startplaylist/distanceandtime"
                handleSubmit={handleSubmit}
                limit={"100"}
                style={{ margin: '0 auto' }}
                height="45px"
              />
            </div>
          </div>
        </InfoContent>
      </div>
    );
  }
}
export default observer(StartPartyParent);
