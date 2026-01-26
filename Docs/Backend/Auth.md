# Authentication API

This document details the Authentication system, including routes, controller logic, middleware, and validation schemas.

## Overview

- **Path Prefix**: `/api/auth`
- **Security**: HttpOnly Cookies + JWT
- **Validation**: Zod Schemas

## 1. Routes (`src/routes/auth.routes.js`)

Defines the endpoints for authentication.

| Method | Endpoint    | Middleware    | Controller Function | Description                             |
| :----- | :---------- | :------------ | :------------------ | :-------------------------------------- |
| `POST` | `/register` | -             | `register`          | Registers a new user.                   |
| `POST` | `/login`    | -             | `login`             | Authenticates a user and sets a cookie. |
| `POST` | `/logout`   | -             | `logout`            | Clears the auth cookie.                 |
| `GET`  | `/me`       | `verifyToken` | `getMe`             | Returns the currently logged-in user.   |

## 2. Controller Logic (`src/controllers/auth.controller.js`)

### `register`

1.  **Validation**: Validates `req.body` using `RegisterSchema` (Zod).
2.  **Check Existing**: Checks if email is already in use.
3.  **Hash Password**: Hashes the password using `bcrypt` (Salt Rounds: 12).
4.  **Create User**: Saves the new user to MongoDB.
5.  **Generate Token**: Signs a JWT with `userId` (valid for 7 days).
6.  **Set Cookie**: Sends the token in an identifying `httpOnly` cookie named `jwt`.
7.  **Response**: Returns 201 Created with the user object.

### `login`

1.  **Validation**: Validates inputs using `LoginSchema`.
2.  **Find User**: Looks up user by email.
3.  **Verify Password**: Compares input password with stored hash using `bcrypt`.
4.  **Generate Token**: Signs a JWT.
5.  **Set Cookie**: Sends `httpOnly` cookie.
6.  **Response**: Returns 200 OK with the user object.

### `logout`

1.  **Clear Cookie**: Clears the `jwt` cookie with matching options (httpOnly, Secure).
2.  **Response**: Returns 200 OK.

### `getMe`

1.  **Lookup**: Finds user by `req.userId` (attached by middleware).
2.  **Response**: Returns 200 OK with the user object (password excluded by Model).

## 3. Middleware (`src/middleware/auth.middleware.js`)

### `verifyToken`

Protects private routes.

1.  **Read Cookie**: Extracts token from `req.cookies.jwt`.
2.  **Verify**: Uses `jwt.verify` with the secret key.
3.  **Attach User**: If valid, sets `req.userId` and calls `next()`.
4.  **Error Handling**: Returns 401 (Missing) or 403 (Invalid).

## 4. Validation Schemas (`src/validations/auth.schema.js`)

Uses **Zod** for strict runtime validation.

### `RegisterSchema`

- `name`: Min 2 chars.
- `email`: Valid email format.
- `password`: Min 8 chars, must contain Number and Uppercase letter.
- `userType`: Enum (`user`, `business`).

### `LoginSchema`

- `email`: Valid email.
- `password`: Min 8 chars.
