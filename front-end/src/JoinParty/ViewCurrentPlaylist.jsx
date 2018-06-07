import React from 'react';
import { observer } from 'mobx-react';
import Load from '../Helpers/Load';
import SongRowCurrent from './SongRowCurrent';
var ViewCurrentPlaylist = props => {
  var songList = props.currentPlaylist.map((item,index) => {
    var artists = item.track.artists.map(artist => {
      return { name: artist.name, url: artist.external_urls.spotify };
    });
    return (
      <SongRowCurrent
        name={{ name: item.track.name, url: item.track.external_urls.spotify }}
        key={index}
        url={item.track.external_urls.spotify}
        artist={artists}
        image={item.track.album.images[0].url}
      />
    );
  });
  return (
    <div style={{ width: '100%', overflow:'scroll',height:'80vh', textAlign: 'center' }}>
      <div style={{ paddingTop: '20px' }}>
        <p className="fontRegular">Current Playlist</p>
      </div>
      <div>
        <p className="bodyFont">
          Below are the songs that have been voted on and added to the playlist!
        </p>
          <a href={props.playlistUrl} rel="noopener noreferrer" target="_blank">
            <p>View Playlist in Spotify</p>
          </a>
        
      </div>
      <Load loading={songList.length === 0 && props.isLoading}>
        {songList}
      </Load>
    </div>
  );
};

export default observer(ViewCurrentPlaylist);
