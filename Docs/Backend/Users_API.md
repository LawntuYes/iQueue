# Users API

This document details the User management endpoints.

## Overview

- **Path Prefix**: `/api/users`
- **Controller**: `src/controllers/user.controller.js`

## 1. Routes (`src/routes/user.routes.js`)

| Method | Endpoint | Middleware    | Controller Function | Description                    |
| :----- | :------- | :------------ | :------------------ | :----------------------------- |
| `GET`  | `/get`   | `verifyToken` | `getUsers`          | Retrieves a list of all users. |

## 2. Controller Logic (`src/controllers/user.controller.js`)

### `getUsers`

1.  **Query**: Calls `User.find({})` to retrieve all documents from the `users` collection.
2.  **Response**: Returns 200 OK with the array of users.
3.  **Security Note**: This endpoint exposes all users and should likely be restricted to Admins in the future.
