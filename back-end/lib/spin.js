var auth = require('./helpers/auth.js');
var spotify = require('./helpers/spotify.js');
var moment = require('moment');
var firebase = require('./helpers/firebase.js');
var stripe = require('./helpers/stripe.js');
var redis = require('./helpers/redis.js');
var geo = require('./helpers/geo.js');
var uuid = require('uuid');
var schedule = require('./helpers/agendaScheduler.js');
var spin = {
  logout: function(opts,callback) {
    redis.removeToken(opts.token)
      .then(res => {
        callback(null,res)
      })
      .catch(e => {
        callback(e,null)
      })
  },
  auth: function(opts, callback) {
    auth
      .getToken(opts.code)
      .then(res => {
        return res;
      })
      .then(tokens => auth.getUserInfo(tokens))
      .then(userInfo => auth.createUser(userInfo))
      .then(returnData => callback(null, returnData))
      .catch(e => callback(e, null));
  },
  chargeCard: function(opts, callback) {
      stripe.chargeCard(opts.chargeObject)
      .then( res => spotify.addSongNow(opts.playlistId, opts.songId))
      .then(
        res =>
          firebase.addSongAddedEvent(
            opts.playlistId,
            `${opts.songName} paid to be added to playlist`
          )
      )
      .then(res => callback(null, res))
      .catch(e => callback(e, null));
  },
  getVoteList: function(opts, callback) {
  redis.returnVoteList(opts.userData.id, opts.playlistId)
      .then(result => {
        callback(null, result);
      })
      .catch(e => callback(e, null));
  },
  getCurrentPlaylist: function(opts, callback) {
    spotify
      .returnCurrentPlaylist(
        opts.userData,
        opts.userId,
        opts.playlistId,
        opts.offSet
      )
      .then(res => {
        callback(null, res);
      })
      .catch(e => {
        callback(e, null);
      });
  },
  cancelPlaylist: function(opts, callback) {
    schedule.cleanUp(opts.userData.spinToken, opts.userData.id, opts.playlistId)
      .then(res => {
        callback(null, { cleanedUp: opts.playlistId });
      })
      .catch(e => {
        callback(e, null);
      });
  },
  findPlaylists: function(opts, callback) {
    geo.findPlaylist(opts.latitude, opts.longitude, opts.distance)
      .then(res => {
        res.forEach(playlist => {
          delete playlist.spinToken;
        });
        callback(null, res);
      })
      .catch(e => {
        return callback(e, null);
      });
  },
  addSongToPlaylist: function(opts, callback) {
    var user = null;
    var songId = null;
    var name = null;
    var songTime = null;
    auth.validateToken({ spinToken: opts.token }).then(userData => {
      firebase
        .getHighest(opts.playlistId)
        .then(res => {
          if (!res) {
            return spotify.emptyVoteList(userData, opts.playlistId,opts.position);
          } else {
            return res;
          }
        })
        .then(res => {
          name = res.name;
          return spotify
            .addSong(userData, opts.playlistId, res.uri, false,opts.position)
            .then(r => {
              songTime = r;
              return res;
            });
        })
        .then(res => {
          return firebase.deleteSong(opts.playlistId, res.uniqueId);
        })
        .then(
          res =>
            firebase.addSongAddedEvent(
              opts.playlistId,
              `${name} was added to playlist`
            )
        )
        .then(res => callback(null, { added: songTime }))
        .catch(e => {
          if (e.event) {
            return callback(null, { added: e.time });
          } else {
            return callback(e, null);
          }
        });
    });
  },
  createPlaylist: function(opts, callback) {
    user = null;
    geo
      .getPlaylistByToken(opts.userData.spinToken)
      .then(res => {
            opts.list.map(x => {
              x.voteCount = 0;
              return x;
            });
            var playlistData = {
              location: { latitude: opts.latitude, longitude: opts.longitude },
              name: opts.name,
              distance: opts.distance || 1000,
              playlistId: uuid.v4(),
              userId: opts.userData.id,
              voteList: []
            };
            spotify
              .createPlaylist(opts.userData, opts.name)
              .then(res => {
                playlistData.playlistId = res.id, playlistData.href = res.href;
                return playlistData;
              })
              .catch(e => {
                callback(e, null);
            })
          .then(firebase.createSpinPlaylist)
          .then(res => {
            spotify
              .addSong(opts.userData, res.playlistId, opts.list, true)
              .then(r => {
                if (!schedule.isFuncReg()) {
                  return schedule.registerAddSong(spin.addSongToPlaylist);
                } else {
                  return r;
                }
              })
              .then(r => {
                return schedule.startSchedule(
                  opts.userData,
                  opts.playlistTime || 10800,
                  res.playlistId
                );
              })
              .then(r => {
                return geo.addPlaylist(
                  opts.latitude,
                  opts.longitude,
                  res.playlistId,
                  opts.userData.spinToken,
                  opts.name,
                  opts.userData.id,
                  opts.distance
                );
              })
              .then(r => callback(null, res))
              .catch(e => callback(e, null));
          })
          .catch(e => callback(e, null));
      })
      .catch(url => {
        return callback(null, { alreadyCreated: url });
      });
  },
  search: function(opts, callback) {
      spotify
        .search(opts.userData.accessToken, opts.q)
        .then(data => callback(null, data))
        .catch(e => callback(e, null));
  },
  vote: function(opts, callback) {
    var voteList = {};
      redis
        .returnVoteList(opts.userData.id, opts.playlistId)
        .then(res => {
          if (!res) {
            return res;
          } else {
            voteList = res;
            if (res[opts.songId]) {
              //if nothing in redis...do vote and add
              //if opposide in redis..do vote and clear
              //if same in redis...do opposide vote and clear
              return {
                firebase: !(res[opts.songId] === opts.vote.toString()),
                redis: false
              };
            } else {
              return { firebase: true, redis: true };
            }
          }
        })
        .then(res => {
          if (res.firebase) {
            return firebase
              .vote(opts.playlistId, opts.songId, opts.vote)
              .then(r => {
                return res;
              });
          } else {
            return firebase
              .vote(opts.playlistId, opts.songId, !opts.vote)
              .then(r => {
                return res;
              });
          }
        })
        .//if marked as reverse kill out of redis
        then(res => {
          if (res.redis) {
            return redis
              .addSongToVoteList(
                opts.userData.id,
                opts.playlistId,
                opts.songId,
                opts.vote
              )
              .then(r => {
                return res;
              });
          } else {
            return redis
              .removeSongVote(opts.userData.id, opts.playlistId, opts.songId)
              .then(r => {
                return res;
              });
          }
        })
        .then(rs => redis.returnVoteList(opts.userData.id, opts.playlistId))
        .then(data => {
          callback(null, data);
        })
        .catch(e => {
          if (typeof e === 'string') {
            e = { err: e };
          }
          callback(e, null);
        });
  },
  addSong: function(opts, callback) {
      redis
        .canAddSong(opts.userData.id, opts.playlistId)
        .then(res => {
          if (res === true) {
            return res;
          } else {
            //moment
            return Promise.reject({
              err: `can't post another song for another ${Math.round(
                (+new Date(res) - (+new Date())) / 1000
              )}s`
            });
          }
        })
        .then(res => {
          return firebase.addSong(opts.playlistId, opts.song);
        })
        .then(res => {
          return redis.updateSongTime(opts.userData.id, opts.playlistId, 180);
        })
        .then(data => callback(null, data))
        .catch(e => callback(e, null));
  },
  //createPlaylist will not be called alone it will go in conjunction with creating a playlist in firebase
  getPlaylist: function(opts, callback) {
    auth.validateToken({ spinToken: opts.token }).then(userData => {
      spotify
        .getPlaylist(userData, opts.playlistId)
        .then(data => callback(null, data))
        .catch(e => {
          if (typeof e === 'string') {
            e = { err: e };
          }
          callback(e, null);
        });
    });
  }
};
schedule.registerAddSong(spin.addSongToPlaylist);
module.exports = spin;
