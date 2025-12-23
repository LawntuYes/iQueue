# User Dashboard Documentation

This document provides a comprehensive technical overview of the **User Dashboard** functionality in iQueue. It details the frontend components, logic, service layers, and the complete data flow to the backend and database.

## 1. Overview

The User Dashboard (`/user/dashboard`) is the central hub for users to:

1.  **Book Appointments**: Select a date and time to queue.
2.  **View Appointments**: See a historical and upcoming list of their bookings.

## 2. File Structure & Dependencies

The following files work together to power this feature:

| Layer             | File Path                                            | Function                                     |
| :---------------- | :--------------------------------------------------- | :------------------------------------------- |
| **View (React)**  | `Frontend/src/pages/DashboardUser/DashboardUser.jsx` | Main UI component.                           |
| **Logic (Hook)**  | `Frontend/src/hooks/useAuth.js`                      | Provides the current logged-in user context. |
| **Service (API)** | `Frontend/src/services/appointments.js`              | Handles HTTP requests to the backend.        |
| **Style (CSS)**   | `Frontend/src/assets/styles/home.css`                | Global styles (glassmorphism, buttons).      |
| **Controller**    | `Backend/src/controllers/appointment.controller.js`  | Backend logic for creation and retrieval.    |
| **Model**         | `Backend/src/models/Appointment.model.js`            | Database schema definition.                  |

---

## 3. Frontend Component: `DashboardUser.jsx`

Located at: `Frontend/src/pages/DashboardUser/DashboardUser.jsx`

### Component State

- `user` (Object): The currently authenticated user (derived from `useAuth`).
- `appointments` (Array): Stores the list of appointment objects fetched from the API.
- `date` (String): Bound to the date input field.
- `time` (String): Bound to the time input field.
- `loading` (Boolean): Controls the disabled state of the "Book Now" button during API calls.
- `message` (String): Feedback message displayed to the user (Success/Error).

### Key Functions

#### 1. `useEffect(() => { fetchAppointments(); }, [])`

- **Purpose**: Runs once on component mount.
- **Action**: Calls `fetchAppointments()` to populate the list immediately when the user visits the page.

#### 2. `fetchAppointments()`

- **Purpose**: Asynchronously retrieves the user's booking history.
- **Logic**:
  1.  Calls `getMyAppointments()` from the service layer.
  2.  If successful (`data.success`), updates the `appointments` state.
  3.  Catches and logs errors.

#### 3. `handleBook(e)`

- **Purpose**: Specific handler for the "Book Now" form submission.
- **Logic**:
  1.  Prevents default form submission.
  2.  Sets `loading` to true.
  3.  Calls `createAppointment(date, time)` service.
  4.  **On Success**:
      - Sets success message.
      - Clears `date` and `time` inputs.
      - Calls `fetchAppointments()` to immediately refresh the list with the new booking.
  5.  **On Failure**: Sets error message.
  6.  **Finally**: Resets `loading` to false.

---

## 4. Service Layer: `appointments.js`

Located at: `Frontend/src/services/appointments.js`

This file abstracts the HTTP communication using the `api.js` wrapper (which handles base URL and credentials).

- **`createAppointment(date, time)`**:
  - **Method**: `POST`
  - **Endpoint**: `/appointments`
  - **Body**: JSON `{ date, time }`
- **`getMyAppointments()`**:
  - **Method**: `GET`
  - **Endpoint**: `/appointments/my-appointments`

---

## 5. Backend Logic & Database Connection

### Routes (`appointment.routes.js`)

- `POST /` -> Maps to `createAppointment` controller.
- `GET /my-appointments` -> Maps to `getMyAppointments` controller.
- **Middleware**: Uses `verifyToken` to ensure a user is logged in and populates `req.userId`.

### Controller (`appointment.controller.js`)

#### `createAppointment`

1.  **Input**: Receives `date`, `time`, `businessId` (optional) from `req.body` and `userId` from `req.userId` (from middleware).
2.  **Database Action**:
    - Creates a new instance of the `Appointment` Mongoose model.
    - `save()` runs the insert command to MongoDB.
3.  **Output**: Returns 201 Created with the new object.

#### `getMyAppointments`

1.  **Input**: Uses `req.userId`.
2.  **Database Action**:
    - `Appointment.find({ user: userId })`: Queries the `appointments` collection.
    - `.sort({ createdAt: -1 })`: Orders results by newest created.
3.  **Output**: Returns 200 OK with the array of appointments.

### Database Model (`Appointment.model.js`)

This defines the structure of the data stored in MongoDB (Collection: `appointments`).

| Field       | Type                       | Description                                            |
| :---------- | :------------------------- | :----------------------------------------------------- |
| `user`      | `ObjectId` (Ref: User)     | **Required**. Links the booking to a specific user.    |
| `business`  | `ObjectId` (Ref: Business) | _Optional_. Links the booking to a business.           |
| `date`      | `Date`                     | **Required**. The date of the appointment.             |
| `time`      | `String`                   | **Required**. The time slot (e.g., "14:30").           |
| `status`    | `String` (Enum)            | Default: "pending". Options: "confirmed", "cancelled". |
| `createdAt` | `Date`                     | Automatically managed by Mongoose timestamps.          |

---

## Summary of Data Flow

1.  **User** clicks "Book Now" in `DashboardUser.jsx`.
2.  **React** calls `services/appointments.js`.
3.  **Browser** sends POST request to `/api/appointments`.
4.  **Express** (Backend) receives request, `verifyToken` middleware extracts User ID from secure HTTP-only cookie.
5.  **Controller** creates a Mongoose object.
6.  **Mongoose** connects to **MongoDB** and inserts the document into the `appointments` collection.
7.  **Response** travels back up the chain, and React updates the list in real-time.
