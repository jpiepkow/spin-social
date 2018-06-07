import { observable, toJS, action } from 'mobx';
import 'whatwg-fetch';
import ui from './UIStore';
import uuid from 'uuid';
import helpers from './helpers/helper';
import { notify } from 'react-notify-toast-fix';
import { browserHistory } from 'react-router';
import firebase from 'firebase';
var urlBase = (process.env.NODE_ENV === 'development') ? 'http://localhost:8000' : 'https://api.spin.social';
var myLocation =(process.env.NODE_ENV === 'development') ? 'http://localhost:3000' : 'https://spin.social';
var obx = observable({
  isLoggedIn: false,
  nextSongTime:0,
  storageChange:'',
  playlistUserId: '',
  searchId:'',
  userObj: {},
  show:notify.createShowQueue(),
  voteLocked: false,
  errorEvent: null,
  createdPlaylist: {},
  searchedSongs: [],
  lat: null,
  long: null,
  searchTimeout: null,
  dropUUID: '',
  playlistId: '',
  filteredPlaylist: [],
  timeTillDrop: null,
  playlistName: '',
  modalAssignment: 'requestSong',
  voteObj: {},
  voteList: [],
  createPlaylist: { songs: [] },
  playlistsNearby: [],
  lastSearchTime: null,
  currentPlaylist: [],
  notifyCopy: action(function(obj) {
    obx.show('copied to clipboard', 'success', 4000);   
  }),
  setTimeAndDistance: action(function(obj) {
    obx.createPlaylist.distance = obj.select.distance.filter(
      x => x.selected
    )[0].key;
    obx.createPlaylist.playlistTime = obj.select.time.filter(
      x => x.selected
    )[0].key;
    browserHistory.push(`/startplaylist/picksongs`);
  }),
  setModalContent: action(function(assignment) {
    obx.modalAssignment = assignment;
  }),
  clearSongs: action(function() {
    obx.createPlaylist.songs = [];
    obx.searchedSongs = [];
  }),
  chargeCard: action(function(token, songId, songName) {
    var url = `${urlBase}/v1/chargeCard`;
    var body = {
      playlistId: obx.playlistId,
      chargeObject: token,
      songId: `spotify:track:${songId}`,
      songName: songName
    };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: obx.userObj.spinToken
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if(response.status === 401) {
                  obx.logUserOut();
                }
        return response.json();
      })
      .then(body => {
        if (body.err) {
          obx.show('Error charging your card.', 'error');
        } else {
        }
      })
      .catch(e => {
      });
  }),
  showCreateTips: action(function() {
    let myColor = { background: '#6d15e6', text: "#FFFFFF" };
    obx.show('Please make sure your using a spotify client and not the web player. Also make sure your not in shuffle mode. For best results use chrome and press play. Do not skip songs once your spin playlist is started.', 'custom',10000,myColor);
  }),
  logOutPost:action(function() {
    var url = `${urlBase}/v1/logout`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: obx.userObj.spinToken
      }
    })
      .then(response => {
        return response.json();
      })
      .then(body => {
      })
      .catch(e => {
      });
  }),
  getCurrentPlaylist: action(function() {
    ui.setCurrentPlaylistSpinner(true);
    var url = `${urlBase}/v1/currentPlaylist?userId=${obx.playlistUserId}&playlistId=${obx.playlistId}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: obx.userObj.spinToken
      }
    })
      .then(response => {
        if(response.status === 401) {
                  obx.logUserOut();
                }
        return response.json();
      })
      .then(body => {
        if (body.err) {
          obx.show('Error getting current playlist', 'error');
        }
        ui.setCurrentPlaylistSpinner(false);
        obx.currentPlaylist = body;
      })
      .catch(e => {
      });
  }),
  endPlaylist: action(function(playlistId) {
    var url = `${urlBase}/v1/cancelPlaylists`;
    var body = { playlistId: playlistId };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: obx.userObj.spinToken
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if(response.status === 401) {
                  obx.logUserOut();
                }
        return response.json();
      })
      .then(body => {
        if (body.err) {
          obx.show(
            'Error ending playlist.(It will still delete it self at the set time)',
            'error'
          );
        }
      })
      .catch(e => {
      });
  }),
  setLocation: action(function(type, lat, long) {
    if (type === 'create') {
      obx.createPlaylist.latitude = lat;
      obx.createPlaylist.longitude = long;
    } else {
      this.lat = lat;
      this.long = long;
      var url = `${urlBase}/v1/findPlaylists?latitude=${this.lat}&longitude=${this.long}&distance=8045`;
      fetch(url, { headers: { token: this.userObj.spinToken } })
        .then(response => {
          if(response.status === 401) {
                  obx.logUserOut();
                }
          return response.json();
        })
        .then(body => {
          if (body.err) {
            obx.show('Error finding playlists near you', 'error');
          }
          ui.setJoinSpinner(false);
          this.playlistsNearby = body;
          this.filteredPlaylist = this.playlistsNearby;
        })
        .catch(x => {});
    }
  }),
  clearPlaylists: action(function() {
    this.playlistNearby = [];
    this.filteredPlaylist = [];
    ui.setJoinSpinner(true);
  }),
  filterNearby: action(function(filterQ) {
    this.filteredPlaylist = this.playlistsNearby.filter(near => {
      return near.name.toLowerCase().includes(filterQ.toLowerCase());
    });
  }),
  clearPlaylistData: action(function() {
    if (!obx.createPlaylist.name) {
      browserHistory.push(`/startplaylist/nameparty`);
    }
  }),
  postPlaylist: action(function() {
    var url = `${urlBase}/v1/createPlaylist`;
    var body = {
      list: obx.createPlaylist.songs,
      latitude: obx.createPlaylist.latitude,
      longitude: obx.createPlaylist.longitude,
      distance: obx.createPlaylist.distance,
      name: obx.createPlaylist.name,
      playlistTime: obx.createPlaylist.playlistTime
    };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: obx.userObj.spinToken
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if(response.status === 401) {
                  obx.logUserOut();
                }
        return response.json();
      })
      .then(body => {
        if (body.alreadyCreated) {
          obx.show(
            'You already have another spin playlist running',
            'error'
          );
          browserHistory.push(body.alreadyCreated);
        } else if (body.err || body.statusCode === 400) {
          obx.show('Error creating playlist', 'error');
        } else {
          browserHistory.push(
            `/startplaylist/${body.playlistId}?href=${body.href}`
          );
          obx.createdPlaylist = body;
        }
      })
      .catch(e => {
      });
  }),
  isUserLogged: action(function() {
    if (localStorage.getItem('spotifyUserInfo')) {
      this.userObj = JSON.parse(localStorage.getItem('spotifyUserInfo'));
      this.toggleLogged();
    }
  }),
  addSongToCreate: action(function(song) {
    obx.searchedSongs = obx.searchedSongs.map(s => {
      if (s.id === song.id) {
        s.isAdded = true;
      }
      return s;
    });
    obx.createPlaylist.songs.push(song);
  }),
  setPlaylistId: action(function(id) {
    obx.playlistId = id;
  }),
  setCreateName: action(function(name) {
    obx.createPlaylist.name = name;
  }),
  vote: action(function(songId, vote) {
    if (!obx.voteLocked) {
      obx.triggerVoteLock();
      obx.mutateVote(songId, vote);
      var url = `${urlBase}/v1/${obx.playlistId}/vote/${songId}`;
      var body = { vote: vote };
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: obx.userObj.spinToken
        },
        body: JSON.stringify(body)
      })
        .then(response => {
          if(response.status === 401) {
                  obx.logUserOut();
                }
          return response.json();
        })
        .then(body => {
          if (body.err) {
            obx.show('Error sending vote', 'error');
          } else {
            obx.setVoteObj(body);
          }
        })
        .catch(e => {
        });
    } else {
    }
  }),
  setVoteObj: action(function(obj) {
    obx.voteObj = obj;
    obx.setVoteList();
  }),
  getVoteList: action(function(playlistId) {
    var url = `${urlBase}/v1/voteList/${playlistId}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: obx.userObj.spinToken
      }
    })
      .then(response => {
        if(response.status === 401) {
                  obx.logUserOut();
                }
        return response.json();
      })
      .then(body => {
        if (body.err) {
          obx.show('Error getting songs you have voted on already', 'error');
        }
        obx.setVoteObj(body);
      })
      .catch(e => {
      });
  }),
  isDisabled: action(function(id, bool) {
    if (obx.voteObj[id]) {
      return !(bool === JSON.parse(obx.voteObj[id]));
    } else {
      return true;
    }
  }),
  triggerVoteLock: action(function() {
    obx.voteLocked = true;
    setTimeout(
      () => {
        obx.voteLocked = false;
      },
      750
    );
  }),
  submitSong: action(function(song) {
    var url = `${urlBase}/v1/addSong`;
    var body = { playlistId: obx.playlistId, song: toJS(song) };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: obx.userObj.spinToken
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if(response.status === 401) {
                  obx.logUserOut();
                }
        return response.json();
      })
      .then(body => {
        if (body.err) {
          // obx.startNextSongTimer();
          obx.show(body.err, 'error');
        } else {
          obx.show('Song added', 'success');
        }
      })
      .catch(e => {
      });
  }),
  startNextSongTimer: action(function() {
    setInterval(() => {
      obx.nextSongTime += .55555555555;
    },1000)
    setTimeout(() => {
      clearInterval(obx.nextSongTimer);
      obx.nextSongTime = 0;
    },180000)
  }),
  setPlaylistUserId: action(function(userId) {
    obx.playlistUserId = userId;
  }),
  connectToFirebase: action(function(playlistId) {
    if (!this.database) {
      var config = {
        apiKey: process.FIREBASE_API_KEY,
        authDomain: process.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.DATABASE_URL,
        storageBucket: process.STORAGE_BUCKET,
        messagingSenderId: process.MESSAGEING_SENTER_ID
      };
      firebase.initializeApp(config);
      this.database = firebase.database();
    }
    this.firebaseNameRef = this.database.ref(`playlists/${playlistId}/name`);
    this.userIdRef = this.database.ref(`playlists/${playlistId}/userId`);
    this.firebaseRef = this.database.ref(`playlists/${playlistId}/voteList`);
    this.dropTime = this.database.ref(`playlists/${playlistId}/dropTime`);
    this.songEvent = this.database.ref(`playlists/${playlistId}/songEvent`);
    this.disconnectRef = this.database.ref(`playlists`);
    this.firebaseNameRef.once('value', dataSnapshot => {
      if (dataSnapshot.key === 'name') {
        this.setPlaylistName(dataSnapshot.val());
      }
    });
    this.userIdRef.once('value', dataSnapshot => {
      if (dataSnapshot.key === 'userId') {
        this.setPlaylistUserId(dataSnapshot.val());
      }
    });
    this.firebaseRef.on('value', snapShot => {
      this.setVoteSongObj(snapShot.val());
    });
    this.disconnectRef.on('value', snapShot => {
      if (!snapShot.hasChild(playlistId)) {
        this.firebaseNameRef.off();
        this.firebaseRef.off();
        this.dropTime.off();
        this.disconnectRef.off();
        obx.playlistId = '';
        obx.show('Playlist has ended.', 'success', 10000);
        browserHistory.push(`/joinplaylist`);
      }
    });
    this.songEvent.on('value', snapShot => {
      if (snapShot.val()) {
        obx.show(snapShot.val(), 'success');
      }
    });
    this.dropTime.on('value', snapShot => {
      this.setDropTime(snapShot.val());
    });
  }),
  setPlaylistName: action(function(val) {
    this.playlistName = val;
  }),
  setDropTime: action(function(dropTime) {
    obx.dropUUID = uuid.v1();
    obx.timeTillDrop = (dropTime - (+new Date())) / 1000;
  }),
  setVoteSongObj: action(function(obj) {
    this.voteSongObj = obj;
    this.setVoteList();
  }),
  mutateVote: action(function(songId, vote) {
    for (var song in obx.voteSongObj) {
      if (song === songId) {
        obx.voteSongObj[song].votes += helpers.getVote(
          obx.voteObj,
          songId,
          vote
        );
        obx.voteObj = helpers.setRedisLocal(obx.voteObj, songId, vote);
      }
    }
    obx.setVoteList();
  }),
  setVoteList: action(function() {
    var localArray = [];
    for (var songData in this.voteSongObj) {
      if (this.voteSongObj.hasOwnProperty(songData)) {
        localArray.push(this.voteSongObj[songData]);
      }
    }
    localArray.map(song => {
      song.canUpvote = obx.isDisabled(song.uniqueId, true);
      song.canDownvote = obx.isDisabled(song.uniqueId, false);
      return song;
    });
    this.voteList = localArray.sort((a, b) => {
      if (a.votes === b.votes) {
        if(a.timeAdded < b.timeAdded) {
          return -1;
        } else {
          return 1;
        }
      }
      return a.votes < b.votes ? 1 : -1;
    });
  }),
  toggleLogged: action(function() {
    this.isLoggedIn = true;
  }),
  updateStore: action(function() {
    if(localStorage.getItem('spotifyUserInfo') === null) {
      if(this.isLoggedIn === true) {
        obx.logUserOut();
      }
    } else {
     this.userObj =  JSON.parse(localStorage.getItem('spotifyUserInfo'))
     if(this.isLoggedIn === false) {
     this.isLoggedIn = true;
     }
    }
  }),
  recievedUserData: action(function(userData) {
    localStorage.setItem('spotifyUserInfo', JSON.stringify(userData));
    this.userObj = userData;
    this.isLoggedIn = true;
    window.location = myLocation;
  }),
  logUserIn: action(function() {
    //window.location = 'http://api.spin.social/v1/login';
    window.location = `${urlBase}/v1/login`;
  }),
  requireAuth: action(function(nextState, replace) {
    if (
      !this.stores.user.isLoggedIn && !localStorage.getItem('spotifyUserInfo')
    ) {
      replace({
        pathname: '/startlogin',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }),
  searchSong: action(function(searchParam) {
    if(searchParam === '') {
      obx.searchId = '';
      ui.setRequestSpinner(false);
      return;
    }
    obx.searchId = uuid.v1();
    var localId = obx.searchId
    ui.setRequestSpinner(true);
    clearTimeout(obx.searchTimeout);
    obx.searchTimeout = setTimeout(
      () => {
        if (true) {
          if (searchParam) {
            //var url = `http://api.spin.social/v1/search?q=${searchParam}`
            var url = `${urlBase}/v1/search?q=${searchParam}`;
            fetch(url, { headers: { token: obx.userObj.spinToken } })
              .then(response => {
                if(response.status === 401) {
                  obx.logUserOut();
                }
                return response.json();
              })
              .then(body => {
                if (body.err) {
                  obx.show('Error searching for songs', 'error');
                }
                if(obx.searchId === localId) {
                  obx.searchedSongs = body;
                  ui.setRequestSpinner(false);
                }
              })
              .catch(e => {
                
              });

            obx.lastSearchTime = (+new Date()) / 1000;
          } else {
            obx.lastSearchTime = (+new Date()) / 1000;
          }
          if (!obx.userObj.spinToken) {
            return;
          }
        }
      },
      400
    );
  }),
  logUserOut: action(function() {
    obx.logOutPost();
    localStorage.clear();
    this.userObj = {};
    this.isLoggedIn = false;
    this.searchedSongs = [];
    //window.location = 'http://spin.social';
    window.location = myLocation;
  })
});
export default obx;
