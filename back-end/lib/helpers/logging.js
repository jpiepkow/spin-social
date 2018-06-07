const db = require('mongo-micro-wrapper');
const uuid =  require('uuid');
const mongoUrl = process.DB_URL
const dbOBJ = new db({
  url: mongoUrl,
  collection: 'log'
});
const requestLog = function(requestId,opts,endpoint) {
	var storedObj = {}	
	for(var key in opts) {
		if(key != 'userData') {
			storedObj[key] = opts[key]	
		}
	}
	var userData = {
		birthdate:opts.userData.birthdate,
		country:opts.userData.country,
		displayName:opts.userData.display_name,
		email:opts.userData.email,
		userURL:(opts.userData.external_urls) ?opts.userData.external_urls.spotify : null,
		id:opts.userData.id
	}
	return new Promise((resolve,reject) => {
		dbOBJ.init(function(err, r) {
      var coll = r.collection;
      coll.update(
      	{
        	requestId:requestId
        },
        {'$set': {
        	request: storedObj,
        	endpoint:endpoint,
        	userData:userData, 
        	date:new Date()
        }},
        {upsert:true},
        function(err, res) {
          return err ? reject(err) : resolve(res);
        }
      );
    });
	})
}
const responseLog = function(requestId,response,requestTime) {
	return new Promise((resolve,reject) => {
		dbOBJ.init(function(err, r) {
      var coll = r.collection;
      coll.update(
        {
        	requestId:requestId
        },
        {
        	'$set': {response:response,requestTime:requestTime}
        },
        {upsert:true},
        function(err, res) {
          return err ? reject(err) : resolve(res);
        }
      );
    });	
	})
}
const getRequestId = function() {
	return uuid.v1()
}

module.exports = {
	requestLog:requestLog,
	responseLog:responseLog,
	getRequestId:getRequestId
}