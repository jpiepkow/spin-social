var request = require('request');
var redis = require('./redis');
var spotifyWebApi = require('spotify-web-api-node');
var config = require('config');
var settings = config.get('default');
var db = require('mongo-micro-wrapper');
var uuid = require('uuid');
var jwt = require('jsonwebtoken');
var mongoUrl = process.DB_URL
var dbOBJ = new db({
  url: mongoUrl,
  collection: 'auth'
});
function validateToken(authObj) {
  return new Promise((resolve, reject) => {
    var tokens = null;
    var returnData = null;
    queryForUser(authObj)
      .then(userData => {
        tokens = userData;
        return tokens;
      })
      .then(testUserToken)
      .then(x => {
        return resolve(x);
      })
      .catch(e => {
        if (e === 'invalid token') {
          refreshToken(tokens)
            .then(tokens => {
              returnData = tokens;
              return returnData;
            })
            .then(t => createUser(t,tokens.tempSpinToken))
            .then(resolve)
            .catch(err => reject(err));
        } else {
          return reject({ err: 'Something went wrong with your tokens' });
        }
      });
  });
}
function testUserToken(tokens) {
  return new Promise((resolve, reject) => {
    var spotifyApi = new spotifyWebApi();
    spotifyApi.setAccessToken(tokens.accessToken);
    spotifyApi
      .getMe()
      .then(data => {
        return resolve(tokens);
      })
      .catch(e => {
        return reject('invalid token');
      });
  });
}
function refreshToken(tokens) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: process.SPOTIFY_TOKEN
        },
        form: {
          grant_type: 'refresh_token',
          refresh_token: tokens.refreshToken
        }
      },
      (err, body, r) => {
        if (err) {
          return reject(err);
        } else {
          var newReturn = tokens;
          r = JSON.parse(r);
          newReturn.accessToken = r.access_token;
          newReturn.scope = r.scope;
          newReturn.expiresIn = r.expires_in, newReturn.tokenType = r.token_type;
          return resolve(newReturn);
        }
      }
    );
  });
}
function getToken(code) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: process.SPOTIFY_TOKEN
        },
        form: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: `${settings.serverUrlBase}/v1/auth`,
          client_id: process.SPOTIFY_CLIENT_ID,
          client_secret: process.SPOTIFY_CLIENT_SECRET
        }
      },
      (err, body, r) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(r);
        }
      }
    );
  });
}
function getUserInfo(tokens) {
  return new Promise((resolve, reject) => {
    tokens = JSON.parse(tokens);
    var spotifyApi = new spotifyWebApi();
    spotifyApi.setAccessToken(tokens.access_token);
    spotifyApi
      .getMe()
      .then(x => {
        var returnObj = x.body;
        returnObj.accessToken = tokens.access_token, returnObj.tokenType = tokens.token_type, returnObj.expiresId = tokens.expires_id, returnObj.refreshToken = tokens.refresh_token, returnObj.scope = tokens.scope;
        resolve(returnObj);
      })
      .catch(e => {
        reject(e);
      });
  });
}
function createJWT(userInfo,rand) {
  if(rand) {
    return jwt.sign(
      { email: userInfo.email, id: userInfo.id,rand:rand },
      process.JWT_SECRET,
      { noTimestamp: true }
    );
  } else {
    return jwt.sign(
      { email: userInfo.email, id: userInfo.id },
      process.JWT_SECRET,
      { noTimestamp: true }
    );
  }
    
}
function createUser(userInfo,tempToken) {
  return new Promise((resolve, reject) => {
    let masterToken = createJWT(userInfo)
    let childToken = tempToken || createJWT(userInfo,uuid.v1())
        dbOBJ.init(function(err, r) {
          userInfo.spinToken = masterToken;
          userInfo.tempSpinToken = childToken;
          r.collection.update(
            { spinToken: masterToken },
            userInfo,
            { upsert: true },
            function(err, res) {
              if (err) {
                reject('Error saving user spotify information');
              } else {
                redis.setToken(userInfo.tempSpinToken,userInfo)
                  .then(res => {
                    resolve(userInfo);
                  })
                  .catch(e => {
                    resolve(userInfo);
                  })
              }
            }
          );
        })
  });
}
function queryCache(token) {
    return redis.getToken(token)
}
function queryMongo(authObj) {
  return new Promise((resolve,reject) => {
    dbOBJ.init(function(err, r) {
      r.collection.findOne(authObj, function(err, res) {
        if (!res) {
          reject('User does not exist by that token');
        } else {
          resolve(res);
        }
      });
    });
  })
}
function addToCache(userObj) {
  return new Promise((resolve,reject) => {
    redis.setToken(userObj.tempSpinToken,userObj) 
      .then(res => {
        resolve(userObj)
      })
      .catch(e => {
        resolve(userObj)
      })
  })
}
function queryForUser(authObj) {
  return new Promise((resolve, reject) => {
    if(Object.keys(authObj)[0] === 'tempSpinToken') {
      queryCache(authObj[Object.keys(authObj)[0]])
        .then(res => {
          if(!res) {
            queryMongo(authObj)
              .then(userObj => {
                addToCache(userObj)
                  .then(r => {
                    return resolve(r)
                  })
              })
              .catch(reject)
          } else {
            return resolve(res)
          }
        })
    } else {
      queryMongo(authObj)
        .then(resolve)
        .catch(reject)
    }
  });
}
module.exports = {
  getUserInfo: getUserInfo,
  getToken: getToken,
  createUser: createUser,
  queryForUser: queryForUser,
  validateToken: validateToken
};
