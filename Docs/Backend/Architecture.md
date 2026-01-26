# Backend Architecture

This document provides a high-level overview of the Backend architecture for the iQueue application.

## 🏗️ Technical Stack

- **Runtime**: [Node.js](https://nodejs.org/) (JavaScript runtime)
- **Framework**: [Express.js](https://expressjs.com/) (Web server framework)
- **Database**: [MongoDB](https://www.mongodb.com/) (NoSQL database)
- **ODM**: [Mongoose](https://mongoosejs.com/) (Object Data Modeling)
- **Authentication**: JWT (JSON Web Tokens) in HTTP-only Cookies

## 📂 Directory Structure

The backend source code is located in `Backend/src`.

```
Backend/
├── index.js                # Entry point of the server
├── src/
│   ├── controllers/        # Logic layer: Handles incoming requests and sends responses
│   ├── lib/                # Library/Utility layer: Database connection, external services
│   ├── middleware/         # Middleware layer: Request processing (Auth, Validation)
│   ├── models/             # Data layer: Mongoose Schemas and Models
│   ├── routes/             # Routing layer: Defines API endpoints and maps them to controllers
│   └── validations/        # Validation layer: Zod schemas for request input validation
└── package.json            # Project dependencies and scripts
```

## 🔄 Data Flow

The application follows the **MVC (Model-View-Controller)** pattern (where the 'View' is handled by the Frontend).

1.  **Request**: An HTTP request reaches the server (`index.js`).
2.  **Routing**: The request is routed to the appropriate module via `src/routes`.
3.  **Middleware**: Optional middleware (Authentication, Validation) runs to check the request's validity.
4.  **Controller**: If valid, the controller function (`src/controllers`) executes the business logic.
5.  **Model**: The controller interacts with Mongoose Models (`src/models`) to query or commit to the MongoDB database.
6.  **Response**: The controller sends a JSON response back to the client.
