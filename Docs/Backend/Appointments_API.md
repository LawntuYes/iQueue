# Appointments API

This document details the Appointment scheduling endpoints.

## Overview

- **Path Prefix**: `/api/appointments`
- **Controller**: `src/controllers/appointment.controller.js`
- **Middleware**: All routes protected by `verifyToken`.

## 1. Routes (`src/routes/appointment.routes.js`)

| Method   | Endpoint           | Description                                            |
| :------- | :----------------- | :----------------------------------------------------- |
| `POST`   | `/`                | Creates a new appointment.                             |
| `GET`    | `/my-appointments` | Get appointments booked _by_ the user (as a customer). |
| `DELETE` | `/:id`             | Cancels/Deletes an appointment.                        |

## 2. Controller Logic (`src/controllers/appointment.controller.js`)

### `createAppointment`

1.  **Input**: Expects `date`, `time`, `businessId` in body.
2.  **Create**: Instantiates Appointment model.
    - `user`: Set to `req.userId`.
    - `business`: Set to `req.body.businessId`.
3.  **Save**: Persists to Database.
4.  **Response**: Returns 201 Created.

### `getMyAppointments`

1.  **Query**: Finds appointments where `user` equals `req.userId`.
2.  **Populate**: Includes `business` name.
3.  **Sort**: Descending by creation time (`createdAt: -1`).
4.  **Response**: Returns 200 OK.

### `deleteAppointment`

1.  **Input**: `id` from URL params.
2.  **Action**: Calls `Appointment.findByIdAndDelete(id)`.
3.  **Response**: Returns 200 OK w/ message.
4.  **Note**: MVP implementation lacks strict ownership check (e.g. verifying the user deleting it is the one who booked it or owns the business), but requires login.
