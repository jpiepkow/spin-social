import React, { Component } from 'react';
import { observer } from 'mobx-react';
import InfoContent from '../Home/InfoContent';
import disco from '../Assets/icons/icon.png';
import Load from '../Helpers/Load';
import SelectorConnector from '../songSelector/SelectorConnector';
import './JoinParty.css'
import { Link } from 'react-router';
class JoinPartyParent extends Component {
  componentWillMount() {
      this.props.route.stores.user.clearPlaylists()
    navigator.geolocation.getCurrentPosition(pos => {
      this.props.route.stores.user.setLocation(
        'join',
        pos.coords.latitude,
        pos.coords.longitude
      );
    });
  }
  render() {
    var isLoading = this.props.route.stores.uiStore.joinSpinner;
    var handleChange = text => {
      this.props.route.stores.user.filterNearby(text);
    };
    var shouldScroll = (this.props.route.stores.user.filteredPlaylist.length !=0)
    var playlists = this.props.route.stores.user.filteredPlaylist.map(
      playlist => {
        return (
          <div key={playlist._id} className="join-flex-row" style={{width:'90%'}}>
            <div  style={{textAlign: 'left' }}>
              <p className="bodyFont">
                <b>{playlist.name}</b>
              </p>
              <p className="bodyFont" style={{ marginTop: '-20px' }}>
                {Math.round(playlist.dist.calculated)} meters from you
              </p>
            </div>
            <div className="text-flex-join">
              <Link
                to={'/joinplaylist/' + playlist.playlistId}
                style={{ backgroundColor: '#6D15E6', color: 'white' }}
                className="button button-pill button-small"
              >
                Join
              </Link>
            </div>
          </div>
        );
      }
    );
    playlists = playlists.length === 0 ? <div className="joinImg">
        <div className="row center">
          <div className="joinImage">
            <p>No playlists near you</p>
          </div>
        </div>
      </div> : playlists;
    return (
      <div className="nameSong">
        <InfoContent imgSrc={disco}>
          <p style={{ paddingTop: '50px' }} className="fontRegularBig">
            lets get it started in here
          </p>
          <p style={{ paddingTop: '7px' }} className="requestFont">
            Look at you branching out, lets find you some funky music.<br />
            You can join a spin playlist by selecting a playlist near you.<br />
            Make sure to allow location services when asked so we can find you playlists!
          </p>
          <div className="container-fluid">
            <div className="row" style={{ paddingTop: '20px' }}>
              <SelectorConnector
                handleChange={handleChange}
                style={{ margin: '0 auto' }}
                width="500px"
                height="45px"
              />
            </div>
            <div className="row" style={{ paddingTop: '7px' }}>
              <hr style={{ width: '90%' }} />
              <div style={{ height: '350px', overflowY: shouldScroll ? 'scroll' : 'hidden',overflowX: 'hidden' }}>
                <Load loading={isLoading}>
                  {playlists}
                </Load>
              </div>
            </div>
          </div>
        </InfoContent>
      </div>
    );
  }
}
export default observer(JoinPartyParent);
