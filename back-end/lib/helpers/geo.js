var db = require('mongo-micro-wrapper');
var mongoUrl = process.DB_URL
var dbOBJ = new db({
  url: mongoUrl,
  collection: 'geo'
});
var addPlaylist = function(
  lat,
  long,
  playlistId,
  spinToken,
  name,
  userId,
  distanceAllowed
) {
  return new Promise((resolve, reject) => {
    dbOBJ.init(function(err, r) {
      var coll = r.collection;
      coll.insert(
        {
          playlistId: playlistId,
          createdAt: new Date(),
          spinToken: spinToken,
          name: name,
          userId: userId,
          distanceAllowed: distanceAllowed || 1000,
          loc: { type: 'Point', coordinates: [ lat, long ] }
        },
        function(err, res) {
          return err ? reject(err) : resolve(res);
        }
      );
    });
  });
};
var removePlaylist = function(playlistId) {
  return new Promise((resolve, reject) => {
    dbOBJ.init(function(err, r) {
      var coll = r.collection;
      coll.remove({ playlistId: playlistId }, (err, res) => {
        return err ? reject(err) : resolve(res);
      });
    });
  });
};
var removePlaylistByUserId = function(id) {
  return new Promise((resolve, reject) => {
    dbOBJ.init(function(err, r) {
      var coll = r.collection;
      coll.remove({ userId: id }, (err, res) => {
        return err ? reject(err) : resolve(res);
      });
    });
  });
};
var getPlaylistById = function(playlistId) {
  return new Promise((resolve, reject) => {
    dbOBJ.init(function(err, r) {
      var coll = r.collection;
      coll.findOne({ playlistId: playlistId }, (err, res) => {
        return err ? reject(err) : resolve(res);
      });
    });
  });
};
var getPlaylistByToken = function(spinToken) {
  return new Promise((resolve, reject) => {
    dbOBJ.init(function(err, r) {
      var coll = r.collection;
      coll.findOne({ spinToken: spinToken }, (err, res) => {
        return res
          ? reject(
            `/startplaylist/${res.playlistId}?href=http://open.spotify.com/user/${res.userId}/playlist/${res.playlistId}`
          )
          : resolve();
      });
    });
  });
};
var findPlaylist = function(lat, long, distanceAllowed) {
  return new Promise((resolve, reject) => {
    dbOBJ.init(function(err, r) {
      var coll = r.collection;
      coll
        .aggregate([
          {
            $geoNear: {
              near: { type: 'Point', coordinates: [ lat, long ] },
              distanceField: 'dist.calculated',
              includeLocs: 'dist.location',
              maxDistance: distanceAllowed || 10000,
              spherical: true
            }
          }
        ])
        .toArray(function(err, res) {
          return err
            ? reject(err)
            : resolve(res.filter(x => x.dist.calculated < x.distanceAllowed));
        });
    });
  });
};

module.exports = {
  getPlaylistByToken: getPlaylistByToken,
  addPlaylist: addPlaylist,
  findPlaylist: findPlaylist,
  getPlaylistById: getPlaylistById,
  removePlaylistByUserId: removePlaylistByUserId,
  removePlaylist: removePlaylist
};
