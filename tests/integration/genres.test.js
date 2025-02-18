const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
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
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("Should return a genre i valid id is passed", async () => {
      const genre = new Genre({
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
    let token;
    let name;

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "*".repeat(10);
    });

    const exec = async () => {
      return await request(server)
        .post(`/api/genres/`)
        .set("x-auth-token", token)
        .send({ name });
    };

    it("Should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("Should return 400 if genre is less than 5 characters", async () => {
      name = "*".repeat(4);
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if genre is more than 50 characters", async () => {
      name = "*".repeat(51);
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("It should save the genre if it is valid", async () => {
      await exec();
      const genre = await Genre.find({ name: "*".repeat(10) });

      expect(genre).not.toBe(null);
    });

    it("It should return the genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "*".repeat(10));
    });
  });
});
