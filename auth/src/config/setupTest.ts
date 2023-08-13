import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  // setup the environment variables
  process.env.JWT_KEY = "asdfasdf";

  // create a mongodb memory server instance
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  // establish the connection between mongoose and the server
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoUri, {});
});

// before starting any test reset the database
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// after the test clean up the db
afterAll(async () => {
  await mongo?.stop();
  await mongoose.connection.close();
});
