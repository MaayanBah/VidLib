const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("Should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => (g.name = "genre1"))).toBeTruthy();
      expect(res.body.some((g) => (g.name = "genre2"))).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("Should return a genre i valid id is passed", async () => {
      const genre = new Genre({
        _id: new mongoose.Types.ObjectId(),
        name: "genre1",
      });

      await genre.save();

      const res = await request(server).get(`/api/genres/` + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("Should return 404 if invalid id is passed", async () => {
      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("Should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post(`/api/genres/`)
        .send({ name: "genre1" });

      expect(res.status).toBe(401);
    });

    it("Should return 400 if genre is less than 5 characters", async () => {
      const token = User().generateAuthToken();
      const res = await request(server)
        .post(`/api/genres/`)
        .set("x-auth-token", token)
        .send({ name: "*".repeat(4) });

      expect(res.status).toBe(400);
    });

    it("Should return 400 if genre is more than 50 characters", async () => {
      const token = User().generateAuthToken();
      const res = await request(server)
        .post(`/api/genres/`)
        .set("x-auth-token", token)
        .send({ name: "*".repeat(51) });

      expect(res.status).toBe(400);
    });

    it("It should save the genre if it is valid", async () => {
      const token = User().generateAuthToken();
      const res = await request(server)
        .post(`/api/genres/`)
        .set("x-auth-token", token)
        .send({ name: "*".repeat(10) });

      const genre = await Genre.find({ name: "*".repeat(10) });
      expect(genre).not.toBe(null);
    });

    it("It should return the genre if it is valid", async () => {
      const token = User().generateAuthToken();
      const res = await request(server)
        .post(`/api/genres/`)
        .set("x-auth-token", token)
        .send({ name: "*".repeat(10) });

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "*".repeat(10));
    });
  });
});
