const {MongoClient} = require('mongodb');
const database ='to-do'
 const url = 'mongodb://localhost:27017';
 //const bodyparser = require("body-parser")

const client = new MongoClient(url);

async function dbconnection()
{
    let result = await client.connect();
    let db = result.db(database);
    return db.collection('list_all');
}
module.exports = dbconnection;