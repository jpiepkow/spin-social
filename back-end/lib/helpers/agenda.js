var mongoDB = process.DB_URL
var Agenda = require('agenda');
module.exports = new Agenda({ db: { address: mongoDB } });
