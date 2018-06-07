import React from 'react';
import { observer } from 'mobx-react';
import PayForSong from '../JoinParty/PayForSong';
import FontAwesome from 'react-fontawesome';
const SongRow = props => {
  return (
    <div style={{"backgroundColor":"#f6f6f6"}}>
      <div className="song-row-flex">
        <div className="image flexImg">
          <img
            className="img-circle"
            alt=""
            src={props.image}
          />
        </div>
        <div
          className="flexText"
          style={{ textAlign: 'left', marginLeft: '-5px' }}
        >
          <p className="rowFont-bold" style={{marginTop:'15px'}}> <b>{props.name}</b></p>
          <br />
          <p className="rowFont" style={{ marginTop: '-35px' }}>
            {props.artist}
          </p>
        </div>
        <div className="flexAdd">
          <PayForSong 
          chargeCard={props.chargeCard} 
          songName={props.name}
          songId={props.id.id}
          />
        </div>
        <div className="flexAdd">
          <a onClick={() => props.handleVote(props.uuid, true)}>
            <FontAwesome
              name="chevron-up"
              style={{
                color: props.canUpvote ? '#7937E4' : 'orange',
                cursor: props.canUpvote ? 'pointer' : 'pointer'
              }}
            />
          </a>
          <p
            className="bodyFontNoPad"
            style={{ marginTop: '-4px', marginBottom: '-7px' }}
          >
            {props.vote}
          </p>
          <a onClick={() => props.handleVote(props.uuid, false)}>
            <FontAwesome
              name="chevron-down"
              style={{
                color: props.canDownvote ? '#7937E4' : 'orange',
                cursor: props.canDownvote ? 'pointer' : 'pointer'
              }}
            />
          </a>
        </div>
      </div>
      <hr style={{ width: '80%', margin:'0px auto 0px'}} />
    </div>
  );
};
export default observer(SongRow);
