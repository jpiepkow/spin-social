var firebase = require('firebase');
var uuid = require('uuid');
var config = {
  apiKey: process.FIREBASE_API_KEY,
  authDomain: process.FIREBASE_AUTH_DOMAIN,
  databaseURL:process.FIREBASE_DB_URL, 
  storageBucket: process.FIREBASE_STORAGE_BUCKET
};
var app = firebase.initializeApp(config);
var database = firebase.database();
var auth = app.auth();
auth.signInWithEmailAndPassword(process.FIREBASE_EMAIL, process.FIREBASE_PASSWORD);
function createSpinPlaylist(config) {
  return new Promise((resolve, reject) => {
    database.ref(`playlists/${config.playlistId}`).set(config, function(err) {
      if (err) {
        return reject(err);
      } else {
        return resolve(config);
      }
    });
  });
}
function deleteSpinPlaylist(playlistId, id) {
  return new Promise((resolve, reject) => {
    database.ref(`playlists/${playlistId}`).once('value', snapshot => {
      if (!snapshot.val()) {
        return reject('Playlist does not exist');
      }
      if (snapshot.val().userId === id) {
        database.ref(`playlists/${playlistId}`).remove(function(err, res) {
          return err ? reject(err) : resolve(res);
        });
      } else {
        return resolve();
      }
    });
  });
}
function addSong(playlistId, song) {
  song.votes = 1;
  song.uniqueId = uuid.v1();
  song.timeAdded = +new Date();
  return new Promise((resolve, reject) => {
    doesSongExistAlready(playlistId, song.id).then(res => {
      if (res === true) {
        return reject({ err: 'Song already exists on playlist' });
      } else {
        //check here if playlist by that id still exists
        database
          .ref(`playlists/${playlistId}/voteList/${song.uniqueId}`)
          .set(song, function(err) {
            if (err) {
              return reject(err);
            } else {
              return resolve(song);
            }
          });
      }
    });
  });
}
function vote(playlistId, songId, vote) {
  return new Promise((resolve, reject) => {
    var voteCount = vote ? 1 : -1;
    database
      .ref(`playlists/${playlistId}/voteList/${songId}`)
      .once('value', snapshot => {
        database
          .ref(`playlists/${playlistId}/voteList/${songId}/votes`)
          .set(snapshot.val().votes + voteCount, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ voted: true });
            }
          });
      });
  });
}
function addNewDropTime(playlistId, newTime) {
  return new Promise((resolve, reject) => {
    var mills = newTime * 1000;
    var date = +new Date();
    var totalTime = mills + date;
    database
      .ref(`playlists/${playlistId}/dropTime`)
      .set(totalTime, function(err) {
        if (err) {
          return reject(err);
        } else {
          return resolve({ worked: true });
        }
      });
  });
}
function addSongAddedEvent(playlistId, str) {
  return new Promise((resolve, reject) => {
    database.ref(`playlists/${playlistId}/songEvent`).set(str, function(err) {
      if (err) {
        return reject(err);
      } else {
        return resolve({ worked: true });
      }
    });
  });
}
function getHighest(playlistId) {
  return new Promise((resolve, reject) => {
    database
      .ref(`playlists/${playlistId}/voteList`)
      .orderByChild('votes')
      .once(
        'value',
        snapshot => {
          var newArr = [];
          snapshot.forEach(function(child) {
            newArr.push(child.val());
          });
          var tempArr = newArr.filter(
            x => x.votes === newArr[newArr.length - 1].votes
          );
          var sortedArr = tempArr.sort((a, b) => {
            return new Date(b.timeAdded) - new Date(a.timeAdded);
          });
          resolve(sortedArr[sortedArr.length - 1]);
        },
        function(err) {
          reject(err);
        }
      );
  });
}
function doesSongExistAlready(playlistId, songId) {
  return new Promise((resolve, reject) => {
    database.ref(`playlists/${playlistId}/voteList`).once('value', snapshot => {
      var newArr = [];
      snapshot.forEach(function(child) {
        if (child.val().id === songId) {
          return resolve(true);
        }
      });
      resolve(false);
    }, function(err) {
      reject(err);
    });
  });
}
function deleteSong(userId, songId) {
  return new Promise((resolve, reject) => {
    database
      .ref(`playlists/${userId}/voteList/${songId}`)
      .remove(function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
}
module.exports = {
  createSpinPlaylist: createSpinPlaylist,
  addSongAddedEvent: addSongAddedEvent,
  addSong: addSong,
  addNewDropTime: addNewDropTime,
  vote: vote,
  getHighest: getHighest,
  deleteSong: deleteSong,
  deleteSpinPlaylist: deleteSpinPlaylist
};
