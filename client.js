const {Redis} =require('ioredis');

const client=new Redis({
  host: 'localhost', // or your Redis host
  port: 6379,
  maxRetriesPerRequest: null, // disables the retry limit
  enableReadyCheck: false // optional: disables ready check

});

module.exports=client;