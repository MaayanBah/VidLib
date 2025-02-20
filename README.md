# VidLib 📽️

> [!NOTE]
>
> ### 🚀 Project Status
>
> This project will be launched into production soon 🔨

## Setup

### 1. Install MongoDB

To run this project, you must first install the latest version of MongoDB.

https://www.mongodb.com/try/download/community

### 2. Dependency Installation

From the project folder, install the required dependencies:

```cmd
npm install
```

### 3. Run the Tests

Execute the unit and integration tests to verify that everything is functioning correctly:

```cmd
npm test
```

All tests should pass.

### 4. Start the Server

```cmd
node index.js
```

The server should now be running on port 3000: http://localhost:3000

## API Documentation

You can view the detailed API documentation generated using Swagger by navigating to the following URL in your browser:

http://localhost:3000/api-docs/

The Swagger UI will provide you with a user-friendly interface where you can explore all available routes, their descriptions, required parameters, and possible responses.

### Authentication

Some endpoints require authentication. You can authenticate users using JWT tokens. After logging in or registering a user, you will receive a token that needs to be included in the headers of requests that require authentication.

For example, to access the /users/me include the JWT token in the x-auth-token header.

### Available Routes

Here is a detailed overview of the main routes available in the VidLib API:

#### 🎬 Movies

- GET /movies – List all movies.
- GET /movies/:id – Get a specific movie by ID.
- POST /movies – Add a new movie (requires auth).
- PUT /movies/:id – Update an existing movie (requires auth).
- DELETE /movies/:id – Delete a movie (requires auth).

#### 🎭 Genres:

- GET /genres: Retrieve a list of all genres.
- GET /genres/:id: Retrieve details of a specific genre.
- POST /genres: Add a new genre.
- PUT /genres/:id: Update an existing genre.
- DELETE /genres/:id: Delete a genre.

#### 👥 Customers:

- GET /customers: Retrieve a list of all customers.
- GET /customers/:id: Retrieve details of a specific customer.
- POST /customers: Add a new customer.
- PUT /customers/:id: Update an existing customer.
- DELETE /customers/:id: Delete a customer.

#### 📀 Rentals

- GET /rentals – List all rentals.
- GET /rentals/:id – Get a specific rental by ID.
- POST /rentals – Create a new rental (requires auth).

#### 👤 Users

- GET /users/me – Get the authenticated user's profile (requires auth).
- POST /users – Register a new user.

#### 🔄 Returns

- POST /returns – Process a movie return (requires auth).

#### 🔐 Authentication

- POST /auth – Authenticate a user and receive a JWT token.

### Sample Requests

You can explore the API using the Swagger UI. Simply select an endpoint, provide the necessary parameters, and click "Execute" to view the response.
