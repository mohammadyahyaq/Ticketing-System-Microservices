import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
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

// ============= globally scoped functions (testing helpers) =============
// update the global type
declare global {
  var getAuthCookie: () => Promise<string[]>;
}

global.getAuthCookie = async () => {
  const email = "test@test.com";
  const password = "Test1234";

  // login
  const res = await request(app)
    .post("/api/auth/signup")
    .send({ email, password })
    .expect(201);

  const cookie = res.get("Set-Cookie");

  return cookie;
};
