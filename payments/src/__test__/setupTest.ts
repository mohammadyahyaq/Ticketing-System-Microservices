import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";

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

  // clear mocks
  jest.clearAllMocks();
});

// after the test clean up the db
afterAll(async () => {
  await mongo?.stop();
  await mongoose.connection.close();
});

// ============= globally scoped functions (testing helpers) =============
// update the global type
declare global {
  var getAuthCookie: (id?: string) => string[];
}

global.getAuthCookie = (id?: string) => {
  // create the token
  const token = jwt.sign(
    {
      id: id || new Types.ObjectId().toHexString(),
      email: "test@test.com",
    },
    process.env.JWT_KEY!
  );

  // create a session object
  const session = { jwt: token };

  // convert to json
  const sessionJSON = JSON.stringify(session);

  // encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};

// mocks
jest.mock("../config/SingletonNatsClient");
