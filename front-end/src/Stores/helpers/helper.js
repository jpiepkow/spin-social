export default {
  getVote: function(obj, songId, vote) {
    if (obj[songId]) {
      var redis = obj[songId] === 'true';
      if (vote === true) {
        if (redis === true) {
          return -1;
        } else {
          return 1;
        }
      } else {
        if (redis === true) {
          return -1;
        } else {
          return 1;
        }
      }
    } else {
      return vote ? 1 : -1;
    }
  },
  setRedisLocal: function(obj, songId, vote) {
    var _obj = obj;
    if (_obj[songId]) {
      var redis = _obj[songId] === 'true';
      if (vote === true) {
        if (redis === true) {
          delete _obj[songId];
        } else {
          delete _obj[songId];
        }
      } else {
        if (redis === true) {
          delete _obj[songId];
        } else {
          delete _obj[songId];
        }
      }
    } else {
      _obj[songId] = vote === true ? 'true' : 'false';
    }
    return _obj;
  }
};
