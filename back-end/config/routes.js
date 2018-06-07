var spin = require('./../lib/spin');
var auth = require('./../lib/helpers/auth');
var log = require('./../lib/helpers/logging');
var Joi = require('joi');
var config = require('config');
var functionTimer = require('function-timer')
var settings = config.get('default');
module.exports = [
  {
    method: 'GET',
    path: '/v1/auth',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        opts = { code: request.query.code, state: request.query.state };
        spin.auth(opts, function(err, r) {
          if (err) {
            reply(err);
          } else {
              let newR = {
                id: r.id,
                display_name:r.display_name,
                images:r.images,
                spinToken:r.tempSpinToken
              }
            //this will be the url that retireves the urserData, stores locally and redirects again.
            serialize = function(obj, prefix) {
              var str = [], p;

              for (p in obj) {
                if (obj.hasOwnProperty(p)) {
                  var k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
                  str.push(
                    v !== null && typeof v === 'object'
                      ? serialize(v, k)
                      : encodeURIComponent(k) + '=' + encodeURIComponent(v)
                  );
                }
              }
              return str.join('&');
            };
            var redirectBase = `${settings.clientUrlBase}/login?${serialize(
              newR 
            )}`;
            reply.redirect(redirectBase);
          }
        });
      },
      validate: { query: { code: Joi.string(), state: Joi.string() } },
      tags: [ 'api' ]
    }
  },
  // {
  //   method: 'GET',
  //   path: '/v1/pullSong',
  //   config: {
  //     cors: {
  //       headers: [
  //         'Accept',
  //         'Authorization',
  //         'Content-Type',
  //         'If-None-Match',
  //         'Accept-language',
  //         'token'
  //       ]
  //     },
  //     handler: function(request, reply) {
  //       opts = { token: request.headers.token };
  //       spin.addSongToPlaylist(opts, function(err, r) {
  //         if (err) {
  //           reply(err);
  //         } else {
  //           reply(r);
  //         }
  //       });
  //     },
  //     validate: {
  //       headers: Joi
  //         .object({ token: Joi.required() })
  //         .options({ allowUnknown: true })
  //     },
  //     tags: [ 'api' ]
  //   }
  // },
  //DONE
  {
    method: 'GET',
    path: '/v1/voteList/{playlistId}',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var timer = new functionTimer({});
        timer.time('req')
        let requestId = log.getRequestId();
        opts = {
          playlistId: request.params.playlistId
        };
        auth.validateToken({ tempSpinToken: request.headers.token })
          .then(res => {
            opts.userData = res;
            try {
              log.requestLog(requestId,opts,'/v1/voteList/{playlistId}')
            } catch(e) {
              console.log(e)
            }
            spin.getVoteList(opts, function(err, r) {
              timer.time('req')
          try {
            log.responseLog(requestId,{err:err,res:r},timer.report());
          } catch(e) {
            console.log(e)  
          }
              if (err) {
                reply(err);
              } else {
                reply(r);
              }
            });
          })
          .catch(e => {
            return reply(e).code(401)
          })
      },
      validate: {
        headers: Joi
          .object({ token: Joi.required() })
          .options({ allowUnknown: true }),
        params: { playlistId: Joi.string().required() }
      },
      tags: [ 'api' ]
    }
  },
  //DONE
  {
    method: 'GET',
    path: '/v1/currentPlaylist',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var timer = new functionTimer({});
        timer.time('req')
        let requestId = log.getRequestId();
        opts = {
          offSet: request.query.offSet || 0,
          userId: request.query.userId,
          playlistId: request.query.playlistId
        };
        auth.validateToken({ tempSpinToken: request.headers.token })
          .then(res => {
            opts.userData = res;
            try {
              log.requestLog(requestId,opts,'/v1/currentPlaylist')
            } catch(e) {
              console.log(e)
            }
            spin.getCurrentPlaylist(opts, function(err, r) {
              timer.time('req')
              try {
            log.responseLog(requestId,{err:err,res:r},timer.report());
          } catch(e) {
            console.log(e)  
          }
              if (err) {
                reply(err);
              } else {
                reply(r);
              }
          });
        })
        .catch(e => {
          return reply(e).code(401)
        })
      },
      validate: {
        headers: Joi
          .object({ token: Joi.required() })
          .options({ allowUnknown: true }),
        query: {
          offSet: Joi.number().optional(),
          userId: Joi.string().required(),
          playlistId: Joi.string().required()
        }
      },
      tags: [ 'api' ]
    }
  },
  //DONE
  {
    method: 'GET',
    path: '/v1/findPlaylists',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var timer = new functionTimer({});
        timer.time('req')
        let requestId = log.getRequestId();
        opts = {
          latitude: request.query.latitude,
          longitude: request.query.longitude,
          distance: request.query.distance
        };
        auth.validateToken({ tempSpinToken: request.headers.token })
          .then(res => {
            opts.userData = res;
            try {
              log.requestLog(requestId,opts,'/v1/findPlaylists')
            } catch(e) {
             console.log(e) 
            }
            spin.findPlaylists(opts, function(err, r) {
            timer.time('req')
            try {
            log.responseLog(requestId,{err:err,res:r},timer.report());
          } catch(e) {
            console.log(e)  
          }
            if (err) {
              reply(err);
            } else {
              reply(r);
            }
          });
        })
        .catch(e => {
          return reply(e).code(401)
        })
        
      },
      validate: {
        headers: Joi
          .object({ token: Joi.required() })
          .options({ allowUnknown: true }),
        query: {
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          distance: Joi.number().required().min(0).max(10000)
        }
      },
      tags: [ 'api' ]
    }
  },
  //DONE
  {
    method: 'POST',
    path: '/v1/cancelPlaylists',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var timer = new functionTimer({});
        timer.time('req')
        let requestId = log.getRequestId();
        opts = {
          playlistId: request.payload.playlistId
        };
      auth.validateToken({ tempSpinToken: request.headers.token })
        .then(res => {
          opts.userData = res;
          try {
            log.requestLog(requestId,opts,'/v1/cancelPlaylists')
          } catch(e) {
            console.log(e)
          }
          spin.cancelPlaylist(opts, function(err, r) {
            timer.time('req')
            try {
            log.responseLog(requestId,{err:err,res:r},timer.report());
          } catch(e) {
            console.log(e)  
          }
            if (err) {
              reply(err);
            } else {
              reply(r);
            }
          });
        })
        .catch(e => {
          return reply(e).code(401)
        })
      },
      validate: {
        headers: Joi
          .object({ token: Joi.required() })
          .options({ allowUnknown: true }),
        payload: { playlistId: Joi.string().required() }
      },
      tags: [ 'api' ]
    }
  },
  //DONE
  {
    method: 'POST',
    path: '/v1/chargeCard',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var timer = new functionTimer({});
        timer.time('req')
        let requestId = log.getRequestId();
        opts = {
          chargeObject: request.payload.chargeObject,
          songId: request.payload.songId,
          songName: request.payload.songName,
          playlistId: request.payload.playlistId
        };
        auth.validateToken({ tempSpinToken: request.headers.token })
        .then(res => {
          opts.userData = res;
          try {
            log.requestLog(requestId,opts,'/v1/chargeCard')
          } catch(e) {
            console.log(e)  
          }
          spin.chargeCard(opts, function(err, r) {
            timer.time('req')
            try {
            log.responseLog(requestId,{err:err,res:r},timer.report());
          } catch(e) {
            console.log(e)  
          }
            if (err) {
              reply(err);
            } else {
              reply(r);
            }
          });
        })
        .catch(e => {
          return reply(e).code(401)
        })
      },
      validate: {
        headers: Joi
          .object({ token: Joi.required() })
          .options({ allowUnknown: true }),
        payload: {
          playlistId: Joi.string().required(),
          chargeObject: Joi.object().required(),
          songName: Joi.string().required(),
          songId: Joi.string().required()
        }
      },
      tags: [ 'api' ]
    }
  },
  //DONE
  {
    method: 'POST',
    path: '/v1/createPlaylist',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var timer = new functionTimer({});
        timer.time('req')
        let requestId = log.getRequestId();
        opts = {
          list: request.payload.list,
          playlistTime: request.payload.playlistTime || null,
          latitude: request.payload.latitude,
          longitude: request.payload.longitude,
          name: request.payload.name,
          distance: request.payload.distance || null
        };
        auth.validateToken({ tempSpinToken: request.headers.token })
        .then(res => {
          opts.userData = res;
          try {
            log.requestLog(requestId,opts,'/v1/createPlaylist')
          } catch(e) {
            console.log(e)  
          }
          spin.createPlaylist(opts, function(err, r) {
            timer.time('req')
            try {
            log.responseLog(requestId,{err:err,res:r},timer.report());
          } catch(e) {
            console.log(e)  
          }
            if (err) {
              reply(err);
            } else {
              reply(r);
            }
          });
        })
        .catch(e => {
          return reply(e).code(401)
        })
      },
      validate: {
        headers: Joi
          .object({ token: Joi.required() })
          .options({ allowUnknown: true }),
        payload: {
          list: Joi.array().min(2).required(),
          playlistTime: Joi.number().optional().min(0).max(86400),
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          distance: Joi.number().optional().min(0).max(10000),
          name: Joi.string().required().min(1).max(100)
        }
      },
      tags: [ 'api' ]
    }
  },
  //DONE
  {
    method: 'POST',
    path: '/v1/{playlistId}/vote/{songId}',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var timer = new functionTimer({});
        timer.time('req')
        let requestId = log.getRequestId();
        opts = {
          playlistId: request.params.playlistId,
          songId: request.params.songId,
          vote: request.payload.vote
        };
        auth.validateToken({ tempSpinToken: request.headers.token })
        .then(res => {
          opts.userData = res;
          try {
            log.requestLog(requestId,opts,'/v1/{playlistId}/vote/{songId}')
          } catch(e) {
            console.log(e)  
          }
          spin.vote(opts, function(err, r) {
            timer.time('req')
            try {
            log.responseLog(requestId,{err:err,res:r},timer.report());
          } catch(e) {
            console.log(e)  
          }
            if (err) {
              reply(err);
            } else {
              reply(r);
            }
          });
        })
        .catch(e => {
          return reply(e).code(401)
        })
      },
      validate: {
        headers: Joi
          .object({ token: Joi.required() })
          .options({ allowUnknown: true }),
        payload: { vote: Joi.boolean().required() },
        params: {
          playlistId: Joi.string().required(),
          songId: Joi.string().required()
        }
      },
      tags: [ 'api' ]
    }
  },
  //DONE
  {
    method: 'POST',
    path: '/v1/addSong',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var timer = new functionTimer({});
        timer.time('req')
        let requestId = log.getRequestId();
        opts = {
          playlistId: request.payload.playlistId,
          song: request.payload.song
        };
        auth.validateToken({ tempSpinToken: request.headers.token })
        .then(res => {
          opts.userData = res;
          try {
            log.requestLog(requestId,opts,'/v1/addSong')
          } catch(e) {
            console.log(e)  
          }
          spin.addSong(opts, function(err, r) {
            timer.time('req')
            try {
            log.responseLog(requestId,{err:err,res:r},timer.report());
          } catch(e) {
            console.log(e)  
          } 
            if (err) {
              reply(err);
            } else {
              reply({ worked: true });
            }
          });
        })
        .catch(e => {
          return reply(e).code(401)
        })
      },
      validate: {
        headers: Joi
          .object({ token: Joi.required() })
          .options({ allowUnknown: true }),
        payload: {
          playlistId: Joi.string(),
          song: Joi
            .object({
              name: Joi.string().required(),
              id: Joi.string().required(),
              uri: Joi.string().required(),
              artist: Joi.string().required(),
              album: Joi.string().required(),
              image: Joi
                .object({
                  height: Joi.number().required(),
                  url: Joi.string().required(),
                  width: Joi.number().required()
                })
                .required()
            })
            .required()
        }
      },
      tags: [ 'api' ]
    }
  },
  //DONE
  {
    method: 'GET',
    path: '/v1/search',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var timer = new functionTimer({});
        timer.time('req')
        let requestId = log.getRequestId();
        opts = {
          q: request.query.q.toLowerCase()
        };
        auth.validateToken({ tempSpinToken: request.headers.token })
        .then(res => {
          opts.userData = res;
          try {
            log.requestLog(requestId,opts,'/v1/search')
          } catch(e) {
            console.log(e)
          }
          spin.search(opts, function(err, r) {
            timer.time('req')
            try {
            log.responseLog(requestId,{err:err,res:'TOLONG'},timer.report());
          } catch(e) {
            console.log(e)  
          }
            if (err) {
              reply(err);
            } else {
              reply(r);
            }
          });
        })
        .catch(e => {
          return reply(e).code(401)
        })
      },
      validate: {
        query: { q: Joi.string() },
        headers: Joi
          .object({ token: Joi.required() })
          .options({ allowUnknown: true })
      },
      tags: [ 'api' ]
    }
  },
  {
    method: 'POST',
    path: '/v1/logout',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var opts  = {
         token : request.headers.token 
        }
        spin.logout(opts,function(err,res) {
          if(err) {
          reply({logout:false})
          } else {
          reply({logout:true})
          }
        })
      },
      tags: [ 'api' ],
      validate: {
        headers: Joi
          .object({ token: Joi.required() })
          .options({ allowUnknown: true })
      }
    }
  },
  {
    method: 'GET',
    path: '/v1/login',
    config: {
      cors: {
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
          'token'
        ]
      },
      handler: function(request, reply) {
        var scope = 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-read-private user-read-birthdate user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-email';
        var redirectUrl = `${settings.serverUrlBase}/v1/auth`;
        reply.redirect(
          `https://accounts.spotify.com/authorize/?client_id=${process.CLIENT_ID}&response_type=code&redirect_uri=${redirectUrl}&scope=${encodeURIComponent(
            scope
          )}`
        );
      },
      tags: [ 'api' ]
    }
  }
];
