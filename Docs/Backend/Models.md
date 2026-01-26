# Database Models

The application uses **Mongoose** to define the schema for data stored in MongoDB.

## 1. User Model (`src/models/User.model.js`)

Represents a registered user of the system (Customer, Business Owner, or Admin).

### Schema Fields

| Field          | Type   | Required | Unique | Description                                            |
| :------------- | :----- | :------- | :----- | :----------------------------------------------------- |
| `name`         | String | Yes      | No     | Full name of the user.                                 |
| `email`        | String | Yes      | Yes    | Unique email address.                                  |
| `passwordHash` | String | Yes      | No     | Bcrypt hashed password.                                |
| `userType`     | String | No       | No     | Role: `user`, `business`, or `admin`. Default: `user`. |
| `timestamps`   | Date   | -        | -      | `createdAt` and `updatedAt`.                           |

### Methods

- **`toJSON`**: This method is overridden to:
  1.  Remove the `passwordHash` from the object before sending to the client (Security).
  2.  Map `userType` to `role` for frontend consistency.

## 2. Business Model (`src/models/Business.model.js`)

Represents a business entity that users can book appointments with.

### Schema Fields

| Field            | Type                 | Required | Unique | Description                                  |
| :--------------- | :------------------- | :------- | :----- | :------------------------------------------- |
| `owner`          | ObjectId (Ref: User) | Yes      | Yes    | The user who owns this business.             |
| `name`           | String               | Yes      | No     | Name of the business.                        |
| `description`    | String               | No       | No     | Short description.                           |
| `operatingHours` | String               | No       | No     | String representation of hours (e.g. "9-5"). |
| `category`       | String               | No       | No     | Business category (e.g., "Barber Shop").     |
| `timestamps`     | Date                 | -        | -      | `createdAt` and `updatedAt`.                 |

## 3. Appointment Model (`src/models/Appointment.model.js`)

Represents a scheduled appointment between a User and a Business.

### Schema Fields

| Field        | Type                     | Required | Default   | Description                                                                             |
| :----------- | :----------------------- | :------- | :-------- | :-------------------------------------------------------------------------------------- |
| `user`       | ObjectId (Ref: User)     | Yes      | -         | The customer booking the appointment.                                                   |
| `business`   | ObjectId (Ref: Business) | No\*     | -         | The business being booked. (\*Currently optional in schema but logic implies required). |
| `date`       | Date                     | Yes      | -         | The date of the appointment.                                                            |
| `time`       | String                   | Yes      | -         | The time slot (e.g. "14:00").                                                           |
| `status`     | String                   | No       | `pending` | `pending`, `confirmed`, `cancelled`.                                                    |
| `timestamps` | Date                     | -        | -         | `createdAt` and `updatedAt`.                                                            |
