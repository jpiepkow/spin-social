var firebase = require('./firebase');
var geo = require('./geo');
var spotify = require('./spotify');
var addSongToPlaylist = null;
var agenda = require('./agenda');

var cancelAllPlaylists = function(token) {
  //need to delete everything here.
  return new Promise((resolve, reject) => {
    agenda.cancel({ 'data.token': token }, function(err, jobs) {
      return err ? reject(err) : resolve({ cancel: true });
    });
  });
};
var cleanUp = function(token, userId, playlistId) {
  return new Promise((resolve, reject) => {
    var promiseArr = [
    geo.removePlaylistByUserId(userId),
    cancelAllPlaylists(token),
    firebase.deleteSpinPlaylist(playlistId, userId)
    ];
    Promise.all(promiseArr).then(resolve).catch(reject);
  });
};
agenda.define('stop playlist', function(job, done) {
  //need to delete everything here.
  cleanUp(
    job.attrs.data.token,
    job.attrs.data.userId,
    job.attrs.data.playlistId
    )
  .then(res => {
    done();
  })
  .catch(e => {
    console.log('error agenda 38');
    console.log(e);
  });
});
agenda.define('add song', function(job, done) {
  try {
    spotify
    .tryForCurrent(job.attrs.data.token)
    .then(res => spotify.isDifferenceMet(res, job.attrs.data.playlistId, 30))
    .then(res => {
      if (res.addSong === true) {
        addSongWrapper(job.attrs.data.token,job.attrs.data.playlistId,res.nextSong)
          .then(r => {
            addSong(job.attrs.data,res.time,true)
            done()
          })
          .catch(console.log)
      } else {
        if(res.fireEvent) {
          firebase.addSongAddedEvent(
            job.attrs.data.playlistId,
            `${new Date()}:Playlist owner is not yet playing spin playlist in spotify client`
          )
        }
        addSong(job.attrs.data,res.time,false)
        done()
      }
    })
    .catch(e => {
      console.log(e)
      addSong(job.attrs.data,40,false)
      done()
    });
  } catch (e) {
    console.log('error agenda 121');
    console.log(e);
    done()
  }
});
var addSongWrapper = function(token,playlistId,position) {
 return new Promise((resolve,reject) => {
   addSongToPlaylist(
        {
          token: token,
          playlistId: playlistId,
          position:position
        },
        (err, r) => {
           return err ? reject(err) : resolve(r) 
      });
  }) 
}
var addSong = function(data,time,add) {
  if(add === true) {
    data.localCounter = data.localCounter + 1
  }
  var localTime = new Date(); 
  localTime.setSeconds(localTime.getSeconds()+time);
  firebase.addNewDropTime(data.playlistId,time);
  agenda.schedule(localTime, 'add song',data)
}
var registerAddSong = function(func) {
  return new Promise((resolve, reject) => {
    addSongToPlaylist = func;
    resolve();
  });
};

var isFuncReg = function() {
  return !(addSongToPlaylist === null);
};
var startSchedule = function(userInformation, time, playlistId) {
  return new Promise((resolve, reject) => {
    var otherT = new Date();
    otherT.setSeconds(otherT.getSeconds() + time);
    agenda.schedule(otherT, 'stop playlist', {
      token: userInformation.spinToken,
      userId: userInformation.id,
      playlistId: playlistId
    });
    addSong({
      token: userInformation.spinToken,
      playlistId: playlistId,
      localCounter: 1
    },20,false)
    resolve();
  });
};
module.exports = {
  cancelAllPlaylists: cancelAllPlaylists,
  registerAddSong: registerAddSong,
  isFuncReg: isFuncReg,
  startSchedule: startSchedule,
  cleanUp: cleanUp
};
