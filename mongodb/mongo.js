var MongoClient = require("mongodb").MongoClient;

var mongoV2Ready = {};

const client = new MongoClient(
  "mongodb://localhost:27017,localhost:27018,localhost:27019/solmytest?replicaSet=rs0&serverSelectionTimeoutMS=60000"
); // Add all replica set members

mongoV2Ready.prepare = async function () {
  try {
    await client.connect();
    mongoV2Ready.db = client.db("solmytest");
    mongoV2Ready.db
      .collection("myusers")
      .createIndex({ number: 1 }, { unique: true })
      .then();
    mongoV2Ready.db
      .collection("myusers")
      .createIndex({ username: 1 }, { unique: true })
      .then();
    console.log("connection successful");

    await mongoV2Ready.db
      .collection("myusers_count")
      .updateOne(
        { key: "user_id" },
        { $setOnInsert: { number: 1 } },
        { upsert: true }
      );

    const adminDb = mongoV2Ready.db.admin();
    const replicaSetStatus = await adminDb
      .command({ replSetGetStatus: 1 })
      .catch(() => null);
    if (!replicaSetStatus) {
      console.log("Initiating the replica set");
      await adminDb.command({
        replSetInitiate: {
          _id: "rs0",
          members: [
            { _id: 0, host: "localhost:27017" },
            { _id: 1, host: "localhost:27018" },
            { _id: 2, host: "localhost:27019" },
          ],
        },
      });
    } else {
      console.log("Replica set already initiated");
    }
  } catch (e) {
    await client.close();
  }
};

mongoV2Ready.close = async function () {
  await client.close();
};

mongoV2Ready.client = client;

module.exports = mongoV2Ready;
