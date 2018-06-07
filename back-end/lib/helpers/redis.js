var redis = require('redis');
var moment = require('moment');
client = redis.createClient({
  host: process.REDIS_HOST,
  port: process.REDIS_PORT,
  password: process.REDIS_PASSWORD
});
client.on('error', function(err) {
  console.log('Error ' + err);
});
var canAddSong = function(userId, playlistId) {
  return new Promise((resolve, reject) => {
    client.get(`${userId}:${playlistId}:songAddTime`, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        if (!res) {
          return resolve(true);
        } else {
          var newDate = new Date(res);
          return moment().isBefore(moment(newDate))
            ? resolve(res)
            : resolve(true);
        }
      }
    });
  });
};
var setToken = function(token,obj) {
  return new Promise((resolve,reject) => {
    client.set(token,JSON.stringify(obj),(err,res) => {
      return err ? reject(err) : resolve(res)
    }) 
  })
};
var getToken = function(token) {
  return new Promise((resolve,reject) => {
    client.get(token,(err,res) => {
      return err ? reject(err) : resolve(JSON.parse(res)) 
    }) 
  })
}
var removeToken = function(token) {
  return new Promise((resolve,reject) => {
   client.del(token,(err,res) => {
    return err ? reject(err) : resolve(res);
   }) 
  })
}
var removeSongVote = function(userId, playlistId, songUUID) {
  return new Promise((resolve, reject) => {
    client.hdel(`${userId}:${playlistId}:voteList`, songUUID, (err, res) => {
      var returnObj = res || {};
      return err ? reject(err) : resolve(true);
    });
  });
};
var updateSongTime = function(userId, playlistId, waitTimeInSeconds) {
  return new Promise((resolve, reject) => {
    var time = moment().add(waitTimeInSeconds, 'seconds');
    var stringTime = time.toString();
    client.set(`${userId}:${playlistId}:songAddTime`, time.toString(), (
      err,
      res
    ) =>
      {
        if(!err) {
          addExpire(`${userId}:${playlistId}:songAddTime`)
          .then(r => {
            return resolve(res);
          })
          .catch(e => {
            return resolve(res);
          })
        } else {
          return reject(err);
        }
      });
  });
};
var addSongToVoteList = function(userId, playlistId, songUUID, vote) {
  return new Promise((resolve, reject) => {
    client.hset(`${userId}:${playlistId}:voteList`, songUUID, vote, (
      err,
      res
    ) =>
      {
        addExpire(`${userId}:${playlistId}:voteList`)
          .then(r => {
          var returnObj = res || {};
        return err ? reject(err) : resolve(returnObj);
          })
          .catch(e => {
            reject(e)
          })
        
      });
  });
};
var addExpire = function(key) {
  return new Promise((resolve,reject) => {
    client.expire(key,86400,(err,res) => {
      return err ? reject(err) : resolve(res)
    }) 
  })
}
var returnVoteList = function(userId, playlistId) {
  return new Promise((resolve, reject) => {
    client.hgetall(`${userId}:${playlistId}:voteList`, (err, res) => {
      var returnObj = res || {};
      return err ? reject(err) : resolve(returnObj);
    });
  });
};

module.exports = {
  setToken:setToken,
  getToken:getToken,
  removeToken:removeToken,
  canAddSong: canAddSong,
  updateSongTime: updateSongTime,
  addSongToVoteList: addSongToVoteList,
  returnVoteList: returnVoteList,
  removeSongVote: removeSongVote
};
