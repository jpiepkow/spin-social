import React from 'react';
import { observer } from 'mobx-react';
const SongRowCurrent = props => {
  var artists = props.artist.map((artist, index) => {
    if (index + 1 === props.artist.length) {
      return <a key={index} target="_blank" rel="noopener noreferrer" href={artist.url}>{artist.name}</a>;
    } else {
      return <a key={index} target="_blank" rel="noopener noreferrer" href={artist.url}>{artist.name}, </a>;
    }
  });
  return (
    <div>
    <div className="song-row-flex">
        <div className="image flexImg">
          <img className="img-circle" role="presentation" src={props.image} />
        </div>
        <div
          className="flexText"
          style={{ textAlign: 'left'}}
        >

          <a href={props.name.url} target="_blank" rel="noopener noreferrer">
            <p className="rowFont-bold">{props.name.name}</p>
          </a>
          <br />
          <p className="rowFont" style={{ marginTop: '-35px' }}>
            {artists}
          </p>
        </div>

      </div>
      <hr style={{ width: '80%', margin:'0px auto 0px'}} />
      </div>
  );
};
export default observer(SongRowCurrent);
