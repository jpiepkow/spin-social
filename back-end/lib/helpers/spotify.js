var spotifyWebApi = require('spotify-web-api-node');
var request = require('request');
var auth = require('./auth');
var firebase = require('./firebase.js');
var geo = require('./geo');
function tryForCurrent(spinToken) {
  return new Promise((resolve, reject) => {
    auth.validateToken({ spinToken: spinToken }).then(user => {
      //maybe pass along current time in ms so we can get the difference from time of request when settin next query
      var token = user.accessToken;
        getCurrentSongInfo(token)
        .then(res => {
          return resolve({ playerData: res,reqTime:(+new Date()), token: token, userId:user.id });
        })
        .catch(e => {
          console.log('spotify line 25 e');
          console.log(e);
          return reject(e);
        });
    });
  });
}
function isDifferenceMet(currentSongObj, playlistId, difInSec) {
  return new Promise((resolve, reject) => {
    if (!currentSongObj.playerData.context) {
      return resolve({ addSong: false, time: 60, fireEvent:true });
    } else if (
      currentSongObj.playerData.context.type != 'playlist' ||
        !currentSongObj.playerData.context.uri.includes(playlistId)
    ) {
      return resolve({ addSong: false, time: 60, fireEvent:true });
    } else {
      getPlaylist(currentSongObj.token,currentSongObj.userId,playlistId,currentSongObj.playerData.item.id)
        .then(res => {
          var scrub = currentSongObj.playerData.progress_ms / 1000;
      var total = currentSongObj.playerData.item.duration_ms / 1000;
      var timeLeftInSec = Math.round(total - scrub);
        let offsetDif =  Math.floor((+new Date() - currentSongObj.reqTime)/1000)
        let totalTimeTillNext = (Math.floor(res.lastSong/1000) - (difInSec - timeLeftInSec) - offsetDif)
      if(res.isLast || res.count/1000+timeLeftInSec - difInSec <= 0) {
      if(res.isLast) {
        return resolve({ addSong: true, nextSong:res.nextSong, time: 1 })
      }  
      else if (timeLeftInSec - difInSec <= 0) {
        
        return resolve({ addSong: true, nextSong:res.nextSong, time: totalTimeTillNext });
      } else {
        return resolve({ addSong: false, time: timeLeftInSec - difInSec });
      }
      } else if(((res.count/1000) + (timeLeftInSec - difInSec)) <= 15) {
        return resolve({ addSong: false, time: 15 });
      } else {
        return resolve({addSong:false , time: ((res.count/1000) + (timeLeftInSec - difInSec))})
      }
        })
        .catch(reject)
      
    }
  });
}
function getPlaylistLength(token,userId,playlistId) {
  return new Promise((resolve,reject) => {
    var spotifyApi = new spotifyWebApi();
    spotifyApi.setAccessToken(token);
    spotifyApi.getPlaylist(userId,playlistId)
      .then(data => {
        return resolve(data.body.tracks.total)
      })
      .catch(reject)
  })
}
function getPlaylist(token,userId,playlistId,songId) {
  return new Promise((resolve,reject) => {
    var nextSong = 0;
    var spotifyApi = new spotifyWebApi();
    spotifyApi.setAccessToken(token);
    spotifyApi.getPlaylist(userId,playlistId)
      .then(data => {
        nextSong = data.body.tracks.total;
        var playlistData = data.body.tracks.items.map(track => {
          return {
            id:track.track.id,
            duration:track.track.duration_ms
          }
        })
          var found = false;
          var totalCount = 0;
          var howMany = playlistData.filter(x => {
            return (x.id === songId)
          }).length
          
          var localCount = 0;
          isLast = null;
          playlistData.forEach((x,index) => {
            if(found === true) {
                isLast = false;
              if((playlistData.length-1===index) === false) {
                totalCount += x.duration
              }
            }
            if(x.id === songId) {
              localCount++;
              if(localCount === howMany) {
                found = true;
                isLast = true;
              }
            }
          })
          resolve({nextSong:nextSong,isLast:isLast,count:totalCount,lastSong:playlistData[playlistData.length-1].duration})
      })
      .catch(reject)
  })
}
function getCurrentSongInfo(token) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: 'GET',
        url: `https://api.spotify.com/v1/me/player`,
        headers: { Authorization: `Bearer ${token}` }
      },
      (err, body, res) => {
        var playerInfo = JSON.parse(res);
        if (err) {
          console.log('spotify line 67 e');
          console.log(err);
        }
        return err ? reject(err) : resolve(playerInfo);
      }
    );
  });
}
function freshenData(token, id) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: 'PUT',
        url: `https://api.spotify.com/v1/me/player/play?device_id=${id}`,
        headers: { Authorization: `Bearer ${token}` }
      },
      (err, res, body) => {
        if (err) {
          console.log('spotify line 82 e');
          console.log(err);
        }
        return err ? reject(err) : resolve(res);
      }
    );
  });
}
function getActiveDevice(token) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/devices',
        headers: { Authorization: `Bearer ${token}` }
      },
      (err, body, res) => {
        if (err) {
          console.log('spotify line 98 e');
          console.log(err);
        }
        var parsed = JSON.parse(res);
        var devices = parsed.devices;
        if (devices.length === 0) {
          return reject('No device available');
        } else {
          var active = devices.filter(x => x.is_active);
          return active.length > 0
            ? resolve(active[0].id)
            : reject('No active device');
        }
      }
    );
  });
}
function emptyVoteList(userData, playlistId,position) {
  var songName = '';
  var songTime = null;
  return new Promise((resolve, reject) => {
    getPlaylistLastFive(userData, playlistId)
      .then(res => {
        return getReccomendedTrack(res.token, res.seed);
      })
      .then(r => {
        songName = r.name;
        return addSong(userData, playlistId, r.uri, false,position);
      })
      .then(res => {
        songTime = res;
        return res;
      })
      .then(res => {
        return firebase.addSongAddedEvent(
          playlistId,
          `${songName} added to playlist`
        );
      })
      .then(res => {
        reject({ event: 'song added', time: songTime });
      })
      .catch(e => {
        console.log('spotify erro get empty', e);
        return reject(e);
      });
  });
}
function getReccomendedTrack(token, tracks) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: 'GET',
        url: `https://api.spotify.com/v1/recommendations?market=US&limit=10&seed_tracks=${tracks}`,
        headers: { Authorization: `Bearer ${token}` }
      },
      (err, body, res) => {
        if (err) {
          console.log('spotify line 159 e');
          console.log(err);
        }
        var ret = JSON.parse(res);
        var returnData = ret.tracks.map(x => {
          //x.name should be displayed in firebase
          return { uri: x.uri, name: x.name };
          // return x.uri;
        });
        resolve(returnData[0]);
      }
    );
  });
}
function search(token, q) {
  return new Promise((resolve, reject) => {
    var spotifyApi = new spotifyWebApi();
    spotifyApi.setAccessToken(token);
    spotifyApi
      .searchTracks(q)
      .then(data => {
        var returnData = data.body.tracks.items.map(x => {
          return {
            name: x.name,
            id: x.id,
            uri: x.uri,
            artist: x.artists[0].name,
            album: x.album.name,
            image: x.album.images[0]
          };
        });
        return resolve(returnData);
      })
      .catch(e => {
        console.log('spotify line 194 e');
        console.log(e);
        return reject(e);
      });
  });
}
function createPlaylist(userData, playlistName) {
  return new Promise((resolve, reject) => {
    var spotifyApi = new spotifyWebApi();
    spotifyApi.setAccessToken(userData.accessToken);
    console.log(userData,playlistName)
    spotifyApi
      .createPlaylist(userData.id, playlistName, { public: true })
      .then(
        function(data) {
          return resolve({
            href: data.body.external_urls.spotify,
            id: data.body.id,
            name: data.body.name
          });
        },
        function(err) {
          console.log('spotify line 215 e');
          console.log(err);
          return reject(err);
        }
      );
  });
}
// This function will happen after a user has paid and the payment has went through.
function addSongNow(playlistId, songId) {
  return new Promise((resolve, reject) => {
    geo
      .getPlaylistById(playlistId)
      .then(res => {
        console.log('this is res',res)
        return auth.validateToken({ spinToken: res.spinToken });
      })
      .then(res => {
        return getPlaylistLength(res.accessToken,res.id,playlistId)
          .then(r => {
            return {
              userdata:res,
              position:r
            }
          })
      })
      .then(res => {
        return addSong(res.userdata, playlistId, songId,false,res.position);
      })
      .then(res => {
        resolve({ worked: true });
      })
      .catch(e => {
        console.log(e)
        console.log('spotify line 237 e');
        console.log(e);
        reject({ failed: e });
      });
  });
}
function returnCurrentPlaylist(user, userId, playlistId, startAt) {
  return new Promise((resolve, reject) => {
        var spotifyApi = new spotifyWebApi();
        spotifyApi.setAccessToken(user.accessToken);
        return spotifyApi.getPlaylistTracks(userId, playlistId, {
          offset: startAt,
          limit: 100,
          fields: 'items'
        })
      .then(results => {
        var returnObj = results.body.items.map(item => {
          return { addedAt: item.added_at, track: item.track };
        });
        return resolve(returnObj);
      })
      .catch(e => {
        console.log('spotify line 263 e');
        console.log(e);
        return reject(e);
      });
  });
}
function getSongInfo(songId, token) {
  if (songId.substring(0, 7) === 'spotify') {
    songId = songId.split(':')[2];
  }
  return new Promise((resolve, reject) => {
    var spotifyApi = new spotifyWebApi();
    spotifyApi.setAccessToken(token);
    spotifyApi
      .getTrack(songId)
      .then(res => {
        return resolve(Math.floor(res.body.duration_ms / 1000));
      })
      .catch(e => {
        console.log('spotify line 263 e');
        console.log(e);
        return reject(e);
      });
  });
}
function addSong(userData, playlistId, spotifySongId, inital,position) {
  return new Promise((resolve, reject) => {
    var spotifyApi = new spotifyWebApi();
    spotifyApi.setAccessToken(userData.accessToken);
    songsArr = [];
    if (Array.isArray(spotifySongId)) {
      songsArr = spotifySongId.map(x => x.uri || x);
    } else {
      songsArr.push(spotifySongId);
    }
    if(position) {
      spotifyApi
      .addTracksToPlaylist(userData.id, playlistId, songsArr,{position:position} )
      .then(
        function(data) {
          if (!inital) {
            getSongInfo(spotifySongId, userData.accessToken)
              .then(res => {
                return resolve(res);
              })
              .catch(e => {
                console.log('spotify line 308 e');
                console.log(e);
                return reject(e);
              });
          } else {
            return resolve();
          }
        },
        function(err) {
          console.log('spotify line 315 e');
          console.log(err);
          return reject(err);
        }
      );

    } else {
      spotifyApi
      .addTracksToPlaylist(userData.id, playlistId, songsArr )
      .then(
        function(data) {
          if (!inital) {
            getSongInfo(spotifySongId, userData.accessToken)
              .then(res => {
                return resolve(res);
              })
              .catch(e => {
                console.log('spotify line 308 e');
                console.log(e);
                return reject(e);
              });
          } else {
            return resolve();
          }
        },
        function(err) {
          console.log('spotify line 315 e');
          console.log(err);
          return reject(err);
        }
      );

    }
    
  });
}
function getPlaylistAverageSongTime(spinToken, playlistId) {
  return new Promise((resolve, reject) => {
    auth.validateToken({ spinToken: spinToken }).then(user => {
      var spotifyApi = new spotifyWebApi();
      spotifyApi.setAccessToken(user.accessToken);
      spotifyApi
        .getPlaylist(user.id, playlistId)
        .then(data => {
          var durationArr = data.body.tracks.items.map(x => {
            return x.track.duration_ms;
          });
          var averageDuration = durationArr.reduce((p, c) => {
            return p + c;
          }) / data.body.tracks.items.length;
          resolve(Math.round(averageDuration / 1000));
        })
        .catch(e => {
          console.log('spotify line 338 e');
          console.log(e);
          return reject(e);
        });
    });
  });
}
function getPlaylistLastFive(userData, playlistId) {
  return new Promise((resolve, reject) => {
    var spotifyApi = new spotifyWebApi();
    spotifyApi.setAccessToken(userData.accessToken);
    spotifyApi
      .getPlaylist(userData.id, playlistId)
      .then(data => {
        durationArr = data.body.tracks.items.map(x => {
          return x.track.duration_ms;
        });
        var returnData = data.body.tracks.items.map(x => {
          return x.track.id;
        });
        if (!(returnData.length <= 3)) {
          returnData = returnData.slice(Math.max(returnData.length - 3, 1));
        }
        var returnString = returnData.join(',');
        resolve({ token: userData.accessToken, seed: returnString });
      })
      .catch(e => {
        console.log('spotify line 362 e');
        console.log(e);
        return reject(e);
      });
  });
}
module.exports = {
  search: search,
  tryForCurrent: tryForCurrent,
  isDifferenceMet: isDifferenceMet,
  getCurrentSongInfo: getCurrentSongInfo,
  getPlaylistAverageSongTime: getPlaylistAverageSongTime,
  createPlaylist: createPlaylist,
  addSong: addSong,
  emptyVoteList: emptyVoteList,
  returnCurrentPlaylist: returnCurrentPlaylist,
  addSongNow: addSongNow
};
