import request from "supertest";
import app from "../../app.js";
import User from "../../models/User/User.model.js";

let token;

describe("Authentication API Tests", () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  test("Should register a new user", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "sharuk@yopmail.com",
      password: "Sharuk@2002",
      confirmPassword: "Sharuk@2002",
      role: "admin",
    });

    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("userDetails");
  });

  test("Should not register with an existing email", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "sharuk@yopmail.com",
      password: "Sharuk@2002",
      confirmPassword: "Sharuk@2002",
      role: "admin",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "failure");
  });

  test("Should login a user", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "sharuk@yopmail.com", // Use the email from the registration test
      password: "Sharuk@2002",
      role: "admin",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("userDetails");

    token = response.body.userDetails.token;
  });

  test("Should not login with wrong password", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "sharuk@yopmail.com",
      password: "Sharu@2002",
      role: "admin",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", "failure");
  });

  test("Should logout user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty(
      "message",
      "User logged out successfully."
    );
  });

  test("Should not fetch registered users without authentication", async () => {
    const response = await request(app).get("/api/v1/auth/users");

    expect(response.status).toBe(404);
  });
});
