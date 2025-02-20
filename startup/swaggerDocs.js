const swaggerJsDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Customer API",
    version: "1.0.0",
    description: "API for managing customers",
  },
  components: {
    securitySchemes: {
      jwt: {
        type: "apiKey",
        in: "header",
        name: "x-auth-token",
        description:
          "This header is used for authenticating users. It must contain a valid JWT (JSON Web Token) issued during login. \n\n" +
          "**x-auth-token**: The token used to authenticate requests. It should be passed as a header for every request requiring authentication.\n\n" +
          "Example:\n" +
          "```\n" +
          "x-auth-token: <your_jwt_token_here>\n" +
          "```",
      },
    },
    schemas: {
      Customer: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string", example: "John Doe" },
          isGold: { type: "boolean", example: true },
          phone: { type: "string", example: "0533333333" },
        },
        required: ["name", "phone"],
      },
      Genre: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string", example: "Action" },
        },
        required: ["name"],
      },
      Movie: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string", example: "The Matrix" },
          genre: {
            $ref: "#/components/schemas/Genre",
          },
          numberInStock: { type: "integer", example: 10 },
          dailyRentalRate: { type: "number", example: 2.5 },
        },
        required: ["title", "genre", "numberInStock", "dailyRentalRate"],
      },
      Rental: {
        type: "object",
        properties: {
          _id: { type: "string" },
          customer: {
            type: "object",
            properties: {
              _id: { type: "string" },
              name: { type: "string", example: "John Doe" },
              isGold: { type: "boolean", example: true },
              phone: { type: "string", example: "1234567890" },
            },
            required: ["name", "phone"],
          },
          movie: {
            type: "object",
            properties: {
              _id: { type: "string" },
              title: { type: "string", example: "The Matrix" },
              dailyRentalRate: { type: "number", example: 2.5 },
            },
            required: ["title", "dailyRentalRate"],
          },
          dateOut: { type: "string", format: "date-time" },
          dateReturned: { type: "string", format: "date-time" },
          rentalFee: { type: "number", example: 25 },
        },
        required: ["customer", "movie", "dateOut"],
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john.doe@example.com" },
          password: { type: "string", example: "P@ssw0rd123" },
          isAdmin: { type: "boolean", example: false },
        },
        required: ["name", "email", "password"],
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./index.js", "./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
