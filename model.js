const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const uriSecondary = process.env.MONGODB_URI_SECONDARY;

const client = new MongoClient(uri);
const clientSecondary = new MongoClient(uriSecondary);

async function getCollection(dbName, collectionName, useSecondary = false) {
    const usedClient = useSecondary ? client : clientSecondary;
    if (!usedClient.topology || !usedClient.topology.isConnected()) {
        await usedClient.connect();
    }
    return usedClient.db(dbName).collection(collectionName);
}

const userFields = ['name', 'age', 'email', 'phoneNumber'];

async function addUser(user) {
    // Optionally validate fields here
    const collection = await getCollection('ReplicaDb', 'Primary');
    return collection.insertOne({
        name: user.name,
        age: user.age,
        email: user.email,
        phoneNumber: user.phoneNumber
    });
}

async function test() {
  const client = new MongoClient('mongodb://mongo-primary:27017');
  await client.connect();
  const col = client.db('ReplicaDb').collection('Primary');
  await col.insertOne({ test: true });
  console.log('Inserted!');
  await client.close();
}
test();

module.exports = { addUser, getCollection, userFields };