const request = require("supertest");
const moment = require("moment");
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const mongoose = require("mongoose");
const { User } = require("../../models/user");

describe("/api/returns", () => {
  let server;
  let rental;
  let token;
  let customerId;
  let movieId;
  let payload;
  let movie;

  beforeEach(async () => {
    server = require("../../index");
    token = new User().generateAuthToken();
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    payload = { customerId, movieId };

    movie = new Movie({
      _id: movieId,
      title: "movie",
      dailyRentalRate: 2,
      genre: {
        name: "*****",
      },
      numberInStock: 10,
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "*****",
        phone: "0533333333",
      },
      movie: {
        _id: movieId,
        title: "*****",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    await server.close();
  });

  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send(payload);
  };

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if client ID is not provided", async () => {
    payload = { movieId };
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movie ID is not provided", async () => {
    payload = { customerId };
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for the customer/movie", async () => {
    await Rental.deleteMany({});
    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if we have a valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the dateReturned if we have a valid request", async () => {
    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const dif = new Date() - rentalInDb.dateReturned;
    expect(dif).toBeLessThan(10 * 1000);
  });

  it("should set the rentalFee if we have a valid request", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase the movie stock if we have a valid request", async () => {
    await exec();
    const movieInDb = await Movie.findById(movie._id);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return the rental if input is valid", async () => {
    const res = await exec();

    const expectedProperties = [
      "dateOut",
      "dateReturned",
      "rentalFee",
      "customer",
      "movie",
    ];
    expectedProperties.forEach((prop) => expect(res.body).toHaveProperty(prop));
  });
});
