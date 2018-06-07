import React, { Component } from 'react';
import { observer } from 'mobx-react';
import InfoContent from '../Home/InfoContent';
import SongRow from '../JoinParty/SongRow';
import Modal from '../Helpers/Modal';
import FlipMove from 'react-flip-move';
import RequestSong from '../RequestSong/RequestSong';
import Share from './Share';
import './StartParty.css'
class PartyJoined extends Component {
  componentWillMount() {
    this.props.route.stores.user.setPlaylistId(this.props.params.partyId);
    this.props.route.stores.user.connectToFirebase(this.props.params.partyId);
    this.props.route.stores.user.clearSongs();
    this.props.route.stores.user.getVoteList(this.props.params.partyId);
  }
  componentDidMount() {
    this.props.route.stores.user.showCreateTips();
  }
  shouldScroll() {
    return  this.props.route.stores.user.voteList.length != 0
  }
  renderList() {
    if (this.props.route.stores.user.voteList.length === 0) {
      return (
        <div className="noSongImg">
          <div className="row center">
            <div className="col-md-12 noSongImage">
              <p>No song requested</p>
            </div>
          </div>
        </div>
      );
    } else {
      return this.props.route.stores.user.voteList.map(x => {
        return (
          <SongRow
            name={x.name}
            key={x.uniqueId}
            chargeCard={this.props.route.stores.user.chargeCard}
            artist={x.artist}
            image={x.image.url}
            vote={x.votes}
            uuid={x.uniqueId}
            canUpvote={x.canUpvote}
            canDownvote={x.canDownvote}
            handleVote={this.props.route.stores.user.vote}
            id={x}
          />
        );
      });
    }
  }
  render() {
    
    return (

      <div className="nameSong">
        <Modal
          showing={this.props.route.stores.uiStore.showRequestModal}
          handleClose={this.props.route.stores.uiStore.toggleRequestModal}
        >
        <div style={{paddingTop:'40px'}}>
          <RequestSong
            modal={true} 
            uiStore={this.props.route.stores.uiStore}
            loading={this.props.route.stores.uiStore.songRequestSpinner}
            chargeCard={this.props.route.stores.user.chargeCard}
            onChange={this.props.route.stores.user.searchSong}
            submit={this.props.route.stores.user.submitSong}
            toggleUi={this.props.route.stores.uiStore.toggleRequestModal}
            songList={this.props.route.stores.user.searchedSongs}
          />
          </div>
        </Modal>
        <InfoContent
          time={this.props.route.stores.user.timeTillDrop}
          uuid={this.props.route.stores.user.dropUUID}
        >
          <p style={{ paddingTop: '10px', width:'100%'}} className="fontRegular">
            {this.props.route.stores.user.playlistName}
          </p>
          <div style={{ display: 'inline-block', width: '100%' }}>
            <div style={{ width: '100%'}}>
              <div className="play-flex">
              <iframe
                title="playbutton"
                className="play-button"
                src={
                  `https://embed.spotify.com/?uri=spotify:user:erebore:playlist:${this.props.location.query.href}&view=coverart&theme=white`
                }
                frameBorder="0"
                height="85px"
                allowTransparency="true"
              />
              
              </div>
              <div style={{ width: '100%', textAlign: 'center' }} />
              <div className="textFlex">
              <p
                style={{marginTop:'0px', padding:'0px',marginBottom:'0px'}}
                className="bodyFont-bold songReq"
              >
                SONGS REQUESTED
              </p>
              <div
                onClick={() => {
                  this.props.route.stores.user.endPlaylist(
                    this.props.params.partyId
                  );
                }}
                style={{ cursor: 'pointer', marginLeft:'auto' }}
              >
                <p
                  style={{color: 'red', padding:'0px',marginTop:'0px',marginBottom:'0px'}}
                  className="bodyFont"
                >
                  END PLAYLIST
                </p>
              </div>

              </div>
              <div style={{maxHeight:'30vh',width:'100%',overflowY:this.shouldScroll() ? 'scroll' : 'hidden',overflowX:'hidden'}}>
              <FlipMove easing="cubic-bezier(0, 0.7, 0.8, 0.1)">
                {this.renderList()}
              </FlipMove>
              </div>
            </div>
            <div className="b-flex">
              <a
                style={{ margin:'10px auto 10px', backgroundColor: '#6D15E6', color: 'white' }}
                onClick={() => {
                  this.props.route.stores.uiStore.toggleRequestModal(true);
                }}
                className="button button-pill button-giant"
              ><p className="lt">REQUEST A SONG</p></a>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                }}
              >
                <Share
                notifyCopy={this.props.route.stores.user.notifyCopy}
                copyText={`https://spin.social/joinplaylist/${this.props.route.stores.user.playlistId}`}
              className="share-container"
                url={
                  `https://spin.social/joinplaylist/${this.props.route.stores.user.playlistId}`
                }
              />
              </div>
            </div>
          </div>
        </InfoContent>
      </div>
    );
  }
}
export default observer(PartyJoined);
