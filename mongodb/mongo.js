var MongoClient = require('mongodb').MongoClient;

var mongoV2Ready = { };

const client = new MongoClient('mongodb://localhost:27017/solmytest');

mongoV2Ready.prepare = async function()
{
    try {
        await client.connect();
        mongoV2Ready.db = client.db('solmytest');
        mongoV2Ready.db.collection('myusers').createIndex({ number :1 }, { unique: true }).then();
        mongoV2Ready.db.collection('myusers').createIndex({ username: 1 }, { unique: true }).then();
        console.log('connection successful');
    } catch (e) {
        await client.close();
    }
};

mongoV2Ready.close = async function() {
    await client.close();
}

mongoV2Ready.client = client;

module.exports = mongoV2Ready;

