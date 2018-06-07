import React from 'react';
import PayForSong from '../JoinParty/PayForSong';
import { observer } from 'mobx-react';
const SongRow = props => {
    var inner = ''
    if(props.isAdded) {
            inner = <i style={{
              color: '#6D15E6',
              marginTop: '10px',
              fontSize:'24px',
              opacity: '.30',
              cursor: props.isAdded ? 'not-allowed' : 'pointer'
            }} className="ion-ios-checkmark-outline"></i>

    } else {
            inner = <i style={{
              color: '#6D15E6',
              fontSize:'24px',
              marginTop: '10px',
              cursor: props.isAdded ? 'not-allowed' : 'pointer'
            }} onClick={() => {
              if (props.toggleUi) {
                props.toggleUi(false);
              }
              props.handleSub(props.id);
            }} className="icon ion-ios-plus-outline"></i>
    }
var button = <div className="col-xs-2">
           {inner} 
            </div>
  return (
    <div>
      <div className="song-row-flex">
        <div className="image flexImg">
          <img className="img-circle" alt="" src={props.image} />
        </div>
        <div
          className="flexText"
          style={{ textAlign: 'left'}}
        >
          <p className="rowFont-bold"> <b>{props.name}</b></p>
          <br />
          <p className="rowFont" style={{ marginTop: '-35px' }}>
            {props.artist}
          </p>
        </div>
        <div className="flexAdd">
          {
            !props.createPlaylist
              ? <PayForSong
                chargeCard={props.chargeCard}
                songName={props.name}
                songId={props.id.id}
              />
              : ''
          }
        </div>
       {button} 
      </div>
      <hr style={{ width: '80%', margin:'auto'}} />
    </div>
  );
};
export default observer(SongRow);
