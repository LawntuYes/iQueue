# Backend Configuration

This document explains the configuration files and the entry point of the server.

## 1. Server Entry Point (`index.js`)

This file is the specific starting point of the application. It initializes the Express app, connects to the database, and starts the server.

### Code Breakdown

1.  **Imports**:

    ```javascript
    import express from "express"; // Web framework
    import cors from "cors"; // Internal security middleware (Cross-Origin Resource Sharing)
    import { connectDB } from "./src/lib/connect.js"; // DB Connection utility
    import allRoutes from "./src/routes/index.js"; // Aggregated routes
    import cookieParser from "cookie-parser"; // Parses cookies from request headers
    ```

2.  **Initialization**:

    ```javascript
    const app = express();
    const PORT = process.env.PORT || 3000; // Defaults to port 3000
    ```

3.  **Middleware Setup**:

    ```javascript
    // Allow requests from Frontend (localhost:5173) and allow credentials (Cookies)
    app.use(cors({ origin: "http://localhost:5173", credentials: true }));
    app.use(cookieParser()); // Parse cookies
    app.use(express.json()); // Parse incoming JSON bodies
    ```

4.  **Routing**:

    ```javascript
    // Mount all API routes under the prefix '/api'
    app.use("/api", allRoutes);
    ```

5.  **Server Start**:
    ```javascript
    app.listen(PORT, () => {
      connectDB(); // Connect to MongoDB when server starts
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    ```

## 2. Database Connection (`src/lib/connect.js`)

Handles the connection to the MongoDB instance using Mongoose.

### Code Breakdown

```javascript
import mongoose from "mongoose";

export async function connectDB() {
  try {
    // Attempt to connect using the connection string from Environment Variables
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database Connection Error:", error);
  }
}
```

## 3. Environment Variables (`.env`)

The application relies on a `.env` file for secrets.

- `DATABASE_URL`: Connection string for MongoDB (e.g., `mongodb+srv://...`).
- `JWT_SECRET`: Secret key used to sign JSON Web Tokens.
- `NODE_ENV`: Environment (development/production).

## 4. Scripts (`package.json`)

- `"start"`: `node --env-file=.env --watch index.js`
  - Runs the server using Node 20+ native `.env` support `--env-file`.
  - `--watch`: Automatically restarts the server on file changes (no need for `nodemon`).
