import React, { Component } from 'react';
import { observer } from 'mobx-react';
import InfoContent from '../Home/InfoContent';
import RequestSong from '../RequestSong/RequestSong';
import logoOne from '../Assets/icons/icon4.png';
class PickSongs extends Component {
  componentWillMount() {
    this.props.route.stores.user.clearPlaylistData();
    this.props.route.stores.user.clearSongs();
  }
  render() {
    var button = this.props.route.stores.user.createPlaylist.songs.length < 2
      ? <a
        style={{backgroundColor: '#6D15E6', margin:'10px', opacity: '.30', color: 'white' }}
        onClick={() => {
        }}
        className="button button-pill button-giant"
      >
        <p className="lt">
          {
            `add ${2 -
              this.props.route.stores.user.createPlaylist.songs.length} more songs`
          }
        </p>
      </a>
      : <a
        style={{backgroundColor: '#6D15E6', margin:'10px', color: 'white' }}
        onClick={() => {
          this.props.route.stores.user.postPlaylist();
        }}
        className="button button-pill button-giant"
      ><p className="lt">START SPINNING</p></a>;
    return (
      <div className="nameSong">
        <InfoContent imgSrc={logoOne}>
          <RequestSong
            height={'85%'}
            loader={'8%'}
            loading={this.props.route.stores.uiStore.songRequestSpinner}
            onChange={this.props.route.stores.user.searchSong}
            submit={this.props.route.stores.user.addSongToCreate}
            songList={this.props.route.stores.user.searchedSongs}
            buttonText="ADD"
            uiStore={this.props.route.stores.uiStore}
            createPlaylist={true}
          />
          <div className="b-flex">
            {button}
          </div>
        </InfoContent>
      </div>
    );
  }
}
export default observer(PickSongs);
