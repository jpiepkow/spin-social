var db = require('mongo-micro-wrapper');
var dbOBJ = new db({
  url: process.DB_URL,
  collection: 'geo'
});
var testFunc = function(lat, long, playlistId, distanceAllowed, userId) {
  return new Promise((resolve, reject) => {
    dbOBJ.init(function(err, r) {
      var coll = r.collection;
      var newDb = r.db;
      //coll.createIndex({point:"2dsphere"});
      coll
        .find({
          loc: {
            $near: {
              $geometry: { type: 'Point', coordinates: [ 71.0603, 42.3583 ] },
              $maxDistance: 1000
            }
          }
        })
        .toArray(function(err, res) {
          console.log(err, res);
        });
      // coll.insert({ name: "Boston", loc : { type : "Point", coordinates : [ 71.0603, 42.3583 ] } },function(err,res) {
      // 	console.log(err,res)
      // })
      //coll.find(function(err,res) {console.log(err,res)})
    });
  });
};
testFunc()
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });
