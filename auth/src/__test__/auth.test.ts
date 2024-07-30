import request from "supertest";
import { app } from "../app";

// ================ Sign up ================
it("should returns 201 after successful signup request", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "test@test.com",
      password: "Test1234",
    })
    .expect(400);
});

it("should returns a status code 400, after sending an invalid email", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "incorrect email",
      password: "Test1234",
    })
    .expect(400);
});

it("should returns a status code 400, if we have less than 8 characters password length", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "test@test.com",
      password: "wrong",
    })
    .expect(400);
});

it("should returns a status 400, if the body is missing the email or password", async () => {
  // test if we sent email only
  await request(app)
    .post("/api/auth/signup")
    .send({ email: "test@test.com" })
    .expect(400);

  // test if we sent password only
  await request(app)
    .post("/api/auth/signup")
    .send({ password: "Test1234" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  // create an email
  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "test@test.com",
      password: "Test1234",
    })
    .expect(201);

  // create the same email again
  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "test@test.com",
      password: "Test1234",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const res = await request(app)
    .post("/api/auth/signup")
    .send({
      email: "test@test.com",
      password: "Test1234",
    })
    .expect(201);

  expect(res.get("Set-Cookie")).toBeDefined();
});

// ================ Sign in ================
it("fails if user tried to logged in with an incorrect credintials", async () => {
  await request(app)
    .post("/api/auth/signin")
    .send({
      email: "test@test.com",
      password: "Test1234",
    })
    .expect(401);
});

it("fails if user entered an incorrect password", async () => {
  // create the user
  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "test@test.com",
      password: "Test1234",
    })
    .expect(201);

  // login with an incorrect password
  await request(app)
    .post("/api/auth/signin")
    .send({
      email: "test@test.com",
      password: "1234Test",
    })
    .expect(401);
});

it("logins successfully, if the user entered a correct credintials", async () => {
  // create the user
  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "test@test.com",
      password: "Test1234",
    })
    .expect(201);

  // login with that user
  const res = await request(app)
    .post("/api/auth/signin")
    .send({
      email: "test@test.com",
      password: "Test1234",
    })
    .expect(200);

  // check the cookie if it's exist
  expect(res.get("Set-Cookie")).toBeDefined();
});

// ================ Sign out ================
it("removes the cookie if the user logged out", async () => {
  // create the user, and login
  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "test@test.com",
      password: "Test1234",
    })
    .expect(201);

  // logout the user
  const res = await request(app).post("/api/auth/signout").send({}).expect(200);

  // check if we removed the cookie
  expect(res.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});

// ================ Current user ================
it("response with details of the current user", async () => {
  // get an authenticated cookie
  const cookie = await getAuthCookie();

  // get the user details
  const res = await request(app)
    .get("/api/auth/user")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  // check the body
  expect(res.body.currentUser.email).toEqual("test@test.com");
});

it("response with null if the user not authenticated", async () => {
  // get the user details, and attatch the cookie
  const res = await request(app).get("/api/auth/user").send().expect(200);

  expect(res.body.currentUser).toEqual(null);
});
