## You have 3 tasks to fulfill:

1. //Complete sign up and sign in, properly encrypting password using bcrypt library. and check the current implementation of incremental id per user.
2. //Wrap the signup, using transactions to ensure no race condition occurs during signup process.
3. //Wrap the signup, using lock or semaphore to ensure no race condition occurs during signup process.

* Restrictions: You should use mongodb driver for your code. Use of mongoose or any other ERD is not allowed.
* You may need to install npm packages if needed to.
* You may convert this project into typescript if you think that is better to you.


* Note: This code is meant to connect to the device's localhost mongoDB instance. You many change this setup in mongodb/mongo.js

GETTING STARTED
1) Run following command to install all the necessary modules
npm install

2) Create 3 empty directories as db1, db2, and db3 and run the following 3 commands in bash on separate terminals each to start up the replica ports
*Remember to setup your dbPath to each directory accordingly in the .yaml files (etc: dbPath: C:\src\mongoDB\db1)
mongod --config home_port.yaml
mongod --config proxy1.yaml
mongod --config proxy1.yam3

3) Run the following command
mongosh --port 27017 to check if the port is up and running

4) If successful, run the following command in the connection instance to initialise the db
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" }
  ]
})

5) run the following command to check the status of the replica set to ensure it is properly configured:
rs.status()
