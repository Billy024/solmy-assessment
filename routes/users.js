require("dotenv").config();
var express = require("express");
var router = express.Router();
const mongoDB = require("../mongodb/mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { Mutex } = require("async-mutex");

const mutex = new Mutex();

router.post("/sign-up", async function (req, res) {
  const release = await mutex.acquire();
  const session = mongoDB.client.startSession();
  try {
    await session.withTransaction(async () => {
      let { username, password } = req.body;
      let hash = await bcrypt.hash(password, saltRounds);
      const user_username = await mongoDB.db
        .collection("myusers")
        .findOne({ username }, { session });
      if (user_username) {
        const error = new Error(
          "Existing username, please choose a new username"
        );
        error.status = 500;
        throw error;
      }
      const userCount = await mongoDB.db
        .collection("myusers_count")
        .findOne({ key: "user_id" }, { session });
      let number = 1;
      if (userCount) {
        number = userCount.number;
      }
      let user = await mongoDB.db
        .collection("myusers")
        .insertOne({ number: number, username, password: hash }, { session });
      if (!user.acknowledged) {
        const error = new Error("Failed to insert user:");
        error.status = 500;
        throw error;
      }
      let count = mongoDB.db
        .collection("myusers_count")
        .updateOne(
          { key: "user_id" },
          { $set: { number: number + 1 } },
          { upsert: true, session }
        );
      if (!count) {
        const error = new Error("Failed to update user count:");
        error.status = 500;
        throw error;
        s;
      }

      const token = jwt.sign(
        { userId: user._id, username: username },
        process.env.SOLUTINO_AUTH_KEY,
        { expiresIn: "1h" }
      );

      req.session.token = token;
      res.status(200).json({ msg: "ok" });
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  } finally {
    release();
    session.endSession();
  }
});

router.post("/sign-in", async function (req, res) {
  try {
    let { username, password } = req.body;
    let user = await mongoDB.db.collection("myusers").findOne({ username });
    if (!user) {
      let error = new Error("Invalid username");
      error.status = 401;
      throw error;
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      const error = new Error("Invalid password");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SOLUTINO_AUTH_KEY,
      { expiresIn: "1h" }
    );

    req.session.token = token;
    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

module.exports = router;
