import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SelectorConnector from '../songSelector/SelectorConnector';
import Load from '../Helpers/Load';
import SongRow from './SongRowReq';
import './RequestSong.css';

class RequestSong extends Component {
  constructor(props) {
    super(props);
    this.state = { color: props.initialColor };
  }
  handleChange = change => {
    this.props.onChange(change);
  };
  render() {
    var isLoading = this.props.loading;
    var list = this.props.songList.map(x => {
      return (
        <SongRow
          key={x.id}
          chargeCard={this.props.chargeCard}
          createPlaylist={this.props.createPlaylist}
          width={this.props.uiStore.width}
          name={x.name}
          isAdded={x.isAdded}
          artist={x.artist}
          image={x.image ? x.image.url : null}
          vote={x.votes}
          handleSub={this.props.submit}
          buttonText={this.props.buttonText || 'ADD'}
          toggleUi={this.props.toggleUi || null}
          id={x}
        />
      );
    });
    return (
      <div style={{ textAlign: 'center',height:this.props.height || '100%' }}>
        <div>
        <div> 
          <p className="fontRegular">what is your flavor?</p>
        </div>
        {(this.props.uiStore.height >= 770) ? <div>
          <p className="requestFont">
            Search for your favorite songs below.
          </p>
          <p className="requestFont" style={{ marginTop: '-10px' }}>
            Request a song to be added to the playlist, if it gets enough upvotes it will be played.
          </p>
        </div> : ''}
        </div>
        <div>
        <div>
          <SelectorConnector
            handleChange={this.handleChange}
            style={{ margin: '0 auto',height: '10%' }}
            height="45px"
          />
        </div>
        <div style={{height:'100%'}}>
          <div style={{overflow: (isLoading) ? 'visible': 'scroll'}} className={this.props.modal ? "requestRow-modal": "requestRow"}>
            <Load top={this.props.loader || "22.5vh"} loading={isLoading}>
              {list}
            </Load>
          </div>
        </div>
        </div>
      </div>
    );
  }
}
export default observer(RequestSong);
