# Project Code Documentation

## Backend

### Models

#### `src/models/User.model.js`

Defines the structure for User documents in MongoDB.

- **`userSchema`**: Mongoose schema defining user fields.
  - `name`: String, required.
  - `email`: String, required, unique.
  - `passwordHash`: String, stores the bcrypt hash of the password.
  - `userType`: String, enum ['user', 'business', 'admin'], defaults to 'user'.
  - `timestamps`: Adds `createdAt` and `updatedAt`.
- **`userSchema.methods.toJSON`**: Custom method to control what is returned when a user document is converted to JSON (e.g., in API responses).
  - Removes `passwordHash` for security.
  - Maps `userType` to `role` for consistency with frontend expectations.
- **`User`**: The Mongoose model exported for use in controllers.

#### `src/models/Business.model.js`

Defines the structure for Business documents.

- **`businessSchema`**:
  - `owner`: ObjectId referencing the `User` model. Required and unique (one business per user).
  - `name`: String, required.
  - `description`: String.
  - `operatingHours`: String, default "9:00 AM - 5:00 PM".
  - `category`: String, enum ['Barber Shop', 'Restaurant', 'Shows', 'Other'].
- **`Business`**: Exported Mongoose model.

#### `src/models/Appointment.model.js`

Defines the structure for Appointment documents.

- **`appointmentSchema`**:
  - `user`: ObjectId referencing `User` (the customer).
  - `business`: ObjectId referencing `Business` (the service provider).
  - `date`: Date object.
  - `time`: String (e.g., "14:00").
  - `status`: String, enum ['pending', 'confirmed', 'cancelled'], default 'pending'.
- **`Appointment`**: Exported Mongoose model.

### Middleware

#### `src/middleware/auth.middleware.js`

- **`verifyToken(req, res, next)`**: Middleware to protect routes.
  - Retrieves the JWT from the `jwt` cookie.
  - If no token is found, returns 401 Unauthorized.
  - Verifies the token using `jwt.verify` and `JWT_SECRET`.
  - If valid, attaches `decoded.userId` to `req.userId` for the next controller.
  - If invalid, returns 403 Forbidden.

### Controllers

#### `src/controllers/auth.controller.js`

Handles user authentication logic.

- **`validate(schema, data)`**: Helper to validate request data against Zod schemas. Throws detailed errors if validation fails.
- **`register(req, res)`**:
  - Validates body against `RegisterSchema`.
  - Checks if email already exists in the database.
  - Hashes password using `bcrypt` (SALT_ROUNDS=12).
  - Creates and saves a new `User`.
  - Generates a JWT and sets it as an HTTP-only `jwt` cookie (expires in 7 days).
  - Returns the created user (without password).
- **`login(req, res)`**:
  - Validates body against `LoginSchema`.
  - Finds user by email.
  - Compares provided password with stored hash using `bcrypt.compare`.
  - If successful, generates JWT and sets HTTP-only `jwt` cookie.
  - Returns user object.
- **`logout(req, res)`**:
  - Clears the `jwt` cookie.
  - Returns success message.

#### `src/controllers/business.controller.js`

Handles business entity logic.

- **`createBusiness(req, res)`**:
  - Gets user ID from `req.userId`.
  - Checks if user already has a business (logic enforced: one business per user).
  - Creates new `Business` linked to the user owner.
- **`getMyBusiness(req, res)`**:
  - Finds the business document owned by the logged-in user (`req.userId`).
  - Returns the business object or null if none exists.
- **`getBusinessAppointments(req, res)`**:
  - Finds the business owned by the user.
  - Finds all appointments where `business` matches the found business ID.
  - Populates `user` field to show who made the booking.
- **`getAllBusinesses(req, res)`**:
  - Returns a list of all businesses, selecting `name`, `description`, `category`, `operatingHours`, and `owner`.

#### `src/controllers/appointment.controller.js`

Handles appointment booking logic.

- **`createAppointment(req, res)`**:
  - Creates a new appointment for the logged-in user (`req.userId`).
  - Links to a specific `businessId` provided in the request body.
  - Saves `date` and `time`.
- **`getMyAppointments(req, res)`**:
  - Finds all appointments where the `user` matches `req.userId`.
  - Populates the `business` field to show business names.
  - Sorts results by `createdAt` in descending order.

#### `src/controllers/user.controller.js`

- **`getUsers(req, res)`**:
  - Returns a list of all users in the database. (Admin/Debug helper).

### Routes

#### `src/routes/auth.routes.js`

- `POST /register`: Calls `authController.register`.
- `POST /login`: Calls `authController.login`.
- `POST /logout`: Calls `authController.logout`.

#### `src/routes/business.routes.js`

- All routes protected by `verifyToken` middleware.
- `GET /`: Calls `getAllBusinesses` (List all businesses).
- `POST /`: Calls `createBusiness` (Create a new business).
- `GET /mybusiness`: Calls `getMyBusiness` (Get current user's business).
- `GET /appointments`: Calls `getBusinessAppointments` (Get appointments for the user's business).

#### `src/routes/appointment.routes.js`

- All routes protected by `verifyToken`.
- `POST /`: Calls `createAppointment` (Book a new appointment).
- `GET /my-appointments`: Calls `getMyAppointments` (Get user's booking history).

#### `src/routes/user.routes.js`

- Protected by `verifyToken`.
- `GET /get`: Calls `getUsers`.

#### `src/routes/index.js`

Main API router entry point.

- `/auth`: Mounts auth routes.
- `/users`: Mounts user routes.
- `/appointments`: Mounts appointment routes.
- `/business`: Mounts business routes.

---

## Frontend

### Entry Points

#### `src/main.jsx`

- Initializes the React application.
- Sets up `BrowserRouter` for routing.
- Renders the root `App` component into the DOM.

#### `src/App.jsx`

- Main component wrapper.
- Wraps the application in `AuthProvider` to provide authentication state globally.
- Renders `AppRouter` to handle page navigation.

### Context

#### `src/context/AuthProvider.jsx`

Manages global authentication state.

- **`AuthProvider`**: Component that wraps the app.
  - **State**:
    - `user`: Holds the currently logged-in user object. Initialized from `localStorage` if available.
    - `loading`: Boolean to indicate async operations.
    - `error`: Stores error messages.
  - **Functions**:
    - `login(email, password)`: Calls `authService.login`, updates `user` state, and saves to `localStorage`.
    - `register(name, email, password, userType)`: Calls `authService.register`, updates `user` state.
    - `logout()`: Calls `authService.logout`, clears `user` state and `localStorage`.

### Services (API Layer)

#### `src/services/api.js`

- **`request(endpoint, options)`**: Generic helper for making HTTP requests to the backend (`http://localhost:3000/api`).
  - Adds default JSON headers.
  - Includes `credentials: 'include'` to send cookies (for JWT).
  - Throws errors if the response status is not OK.

#### `src/services/auth.js`

- `login(email, password)`: POST to `/auth/login`.
- `register(name, email, password, userType)`: POST to `/auth/register`.
- `logout()`: POST to `/auth/logout`.

#### `src/services/business.js`

- `createBusiness(data)`: POST to `/business`.
- `getMyBusiness()`: GET to `/business/mybusiness`.
- `getBusinessAppointments()`: GET to `/business/appointments`.
- `getAllBusinesses()`: GET to `/business`.

#### `src/services/appointments.js`

- `createAppointment(dateOrObj, time)`: POST to `/appointments`. Handles overloading where first arg can be a date string or an object.
- `getMyAppointments()`: GET to `/appointments/my-appointments`.

### Router

#### `src/router/AppRouter.jsx`

Defines the application's navigation structure.

- **Public Routes**:
  - `/` (Home): Wrapped in `MainLayout`.
  - `/business/:id` (Business details): Wrapped in `MainLayout`.
- **Auth Routes**:
  - `/login` & `/register`: Wrapped in `AuthLayout`.
- **Private Routes** (Protected by `PrivateRoute`):
  - `/dashboard/admin`: Admin dashboard.
  - `/dashboard/business`: Business owner dashboard.
  - `/user/dashboard`: Regular user dashboard.
  - Wrapped in `DashboardLayout`.
- **Catch-all**: `*` renders `NotFound` page.

#### `src/router/PrivateRoute.jsx`

- Checks `useAuth()` to see if `user` is present.
- If not logged in, redirects to `/login`.
- If logged in, renders the child route (`Outlet`).

### Pages

#### `src/pages/Home/Home.jsx`

- Landing page.
- Displays "Get Started" / "Login" buttons if user is guest.
- Displays "Welcome [Name]" if user is logged in.

#### `src/pages/Login/Login.jsx`

- Handles user login.
- **`handleSubmit`**:
  - Validates email format and password length.
  - Calls `login()` from `useAuth`.
  - Redirects to home on success.

#### `src/pages/Register/Register.jsx`

- Handles user registration.
- **`handleSubmit`**:
  - Validates passwords match.
  - Validates password complexity (regex: 8+ chars, number, uppercase).
  - Calls `register()` from `useAuth`.
  - Redirects to Login on success.

#### `src/pages/DashboardUser/DashboardUser.jsx`

- Main interface for standard users.
- **State**:
  - `appointments`: List of user's bookings.
  - `businesses`: List of available businesses.
  - `selectedBusiness`, `showModal`: For the booking popup.
- **Effects**:
  - Fetches user appointments and all businesses on mount.
- **Functions**:
  - `openBookingModal(business)`: Opens the modal to book `business`. Calculates strict `timeMin`/`timeMax` from business operating hours.
  - `handleBook(e)`: Submits the booking request. Validates time is within operating hours.
  - `parseOperatingHours`: Helper to extract open/close times from string.

#### `src/pages/DashboardBusiness/DashboardBusiness.jsx`

- Interface for business owners.
- **State**:
  - `business`: The user's business profile.
  - `appointments`: List of incoming queues/bookings.
  - `formData`: For creating a new business.
- **Logic**:
  - If `business` is null, displays a "Create Business" form.
  - If `business` exists, displays business details and the "Current Queue" (list of appointments).
- **Functions**:
  - `handleCreateBusiness`: POSTs new business data.
  - `fetchBusinessData`: Loads business profile and appointments.

#### `src/pages/BusinessPage/BusinessPage.jsx`

- Placeholder for public business profile view.

#### `src/pages/DashboardAdmin/DashboardAdmin.jsx`

- Placeholder for admin dashboard.

#### `src/pages/NotFound/NotFound.jsx`

- Simple 404 error page.
