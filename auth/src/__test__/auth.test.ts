import request from "supertest";
import { app } from "../app";

it("should returns 201 after successful signup request", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "test@test.com",
      password: "Test1234",
    })
    .expect(201);
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
