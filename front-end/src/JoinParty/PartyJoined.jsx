import React, { Component } from 'react';
import { observer } from 'mobx-react';
import InfoContent from '../Home/InfoContent';
import SongRow from './SongRow';
import Modal from '../Helpers/Modal';
import FlipMove from 'react-flip-move';
import RequestSong from '../RequestSong/RequestSong';
import ViewCurrentPlaylist from './ViewCurrentPlaylist';
import PayForSong from './PayForSong';
class PartyJoined extends Component {
  componentWillMount() {
    this.props.route.stores.user.setPlaylistId(this.props.params.partyId);
    this.props.route.stores.user.connectToFirebase(this.props.params.partyId);
    this.props.route.stores.user.getVoteList(this.props.params.partyId);
  }
  shouldScroll() {
    return  this.props.route.stores.user.voteList.length != 0
  }
  renderList() {
    if (this.props.route.stores.user.voteList.length === 0) {
      return (
        <div className="noSongImg">
            <div className="noSongImage">
              <p>No songs requested</p>
            </div>
        </div>
      );
    } else {
      return this.props.route.stores.user.voteList.map(x => {
        return (
          <SongRow
            key={x.uniqueId}
            chargeCard={this.props.route.stores.user.chargeCard}
            id={x}
            name={x.name}
            artist={x.artist}
            image={x.image.url}
            vote={x.votes}
            uuid={x.uniqueId}
            canUpvote={x.canUpvote}
            canDownvote={x.canDownvote}
            handleVote={this.props.route.stores.user.vote}
          />
        );
      });
    }
  }
  render() {
    var assignObject = {
      requestSong: (

        <div style={{paddingTop:'40px'}}>
        <RequestSong
          modal={true}
          loading={this.props.route.stores.uiStore.songRequestSpinner}
          uiStore={this.props.route.stores.uiStore}
          chargeCard={this.props.route.stores.user.chargeCard}
          onChange={this.props.route.stores.user.searchSong}
          submit={this.props.route.stores.user.submitSong}
          toggleUi={this.props.route.stores.uiStore.toggleRequestModal}
          songList={this.props.route.stores.user.searchedSongs}
        />
        </div>
      ),
      pay: <PayForSong />,
      viewPlaylist: (
        <ViewCurrentPlaylist
          currentPlaylist={this.props.route.stores.user.currentPlaylist}
          playlistUrl={
            `https://open.spotify.com/user/${this.props.route.stores.user.playlistUserId}/playlist/${this.props.route.stores.user.playlistId}`
          }
          isLoading={this.props.route.stores.uiStore.currentPlaylistsSpinner}
        />
      )
    };
    var assignment = this.props.route.stores.user.modalAssignment;
    var modalContent = assignObject[assignment];
    return (
      <div className="nameSong">
        <Modal
          showing={this.props.route.stores.uiStore.showRequestModal}
          handleClose={this.props.route.stores.uiStore.toggleRequestModal}
        >
          {modalContent}
        </Modal>
        <InfoContent
          time={this.props.route.stores.user.timeTillDrop}
          uuid={this.props.route.stores.user.dropUUID}
        >
          <p style={{ paddingTop: '50px' }} className="fontRegular">
            {this.props.route.stores.user.playlistName}
          </p>
          <div style={{ display: 'inline-block', width: '100%' }}>
            <div style={{ width: '100%'}}>
            <div style={{width:'80%',margin:'auto'}}>
              <p
                className="bodyFont song-r"
              >
                SONGS REQUESTED
              </p>
              </div>
              <div className="bodyFont" />
              <div style={{maxHeight:'30vh',width:'100%',overflowY:this.shouldScroll() ? 'scroll' : 'hidden',overflowX:'hidden'}}>
              <FlipMove easing="cubic-bezier(0, 0.7, 0.8, 0.1)">
                {this.renderList()}
              </FlipMove>
              </div>
            </div>
            <div>
              <a
                style={{ margin:'10px auto 10px', backgroundColor: '#6D15E6', color: 'white' }}
                onClick={() => {
                  this.props.route.stores.user.setModalContent('requestSong');
                  this.props.route.stores.uiStore.toggleRequestModal(true);
                }}
                className="button button-pill button-giant"
              ><p className="lt">REQUEST A SONG</p></a>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.props.route.stores.user.getCurrentPlaylist();
                  this.props.route.stores.user.setModalContent('viewPlaylist');
                  this.props.route.stores.uiStore.toggleRequestModal(true);
                }}
              >
                <a>
                  <p className="bodyFont">or view current playlist</p>
                </a>
              </div>
            </div>
          </div>
        </InfoContent>
      </div>
    );
  }
}
export default observer(PartyJoined);
