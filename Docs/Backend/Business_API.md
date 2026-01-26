# Business API

This document details the Business management endpoints.

## Overview

- **Path Prefix**: `/api/business`
- **Controller**: `src/controllers/business.controller.js`
- **Middleware**: All routes are protected by `verifyToken`.

## 1. Routes (`src/routes/business.routes.js`)

| Method | Endpoint        | Description                                                 |
| :----- | :-------------- | :---------------------------------------------------------- |
| `GET`  | `/`             | Retrieves all businesses.                                   |
| `POST` | `/`             | Creates a new business for the authenticated user.          |
| `GET`  | `/mybusiness`   | Retrieves the business owned by the logged-in user.         |
| `GET`  | `/appointments` | Retrieves all appointments booked _at_ the user's business. |

## 2. Controller Logic (`src/controllers/business.controller.js`)

### `createBusiness`

1.  **Input**: Expects `name`, `description`, `operatingHours`, `category` in body.
2.  **Check**: Verifies if the user already owns a business (`Business.findOne({ owner: userId })`). Returns 400 if true.
3.  **Create**: Instantiates new Business model with `req.userId` as owner.
4.  **Save**: Persists to MongoDB.
5.  **Response**: Returns 201 Created.

### `getMyBusiness`

1.  **Query**: Finds business where `owner` equals `req.userId`.
2.  **Response**:
    - If found: Returns 200 OK with business object.
    - If not found: Returns 200 OK with `business: null` (Valid state for new users).

### `getBusinessAppointments`

1.  **Identify Business**: Finds the business owned by `req.userId`.
2.  **Validation**: If no business found, returns 404.
3.  **Query**: Finds all `Appointment` documents where `business` matches the business ID.
    - **Populate**: Includes user details (`name`, `email`) for the person who booked.
    - **Sort**: Ascending by date/time.
4.  **Response**: Returns 200 OK with array of appointments.

### `getAllBusinesses`

1.  **Query**: Selects specific fields (`name`, `description`, `category`, `operatingHours`, `owner`) for all businesses.
2.  **Response**: Returns 200 OK with list.
