# 🛡️ iQueue Admin Functions Documentation

Welcome to the **Admin Functions Documentation** for the iQueue application! This guide covers every frontend and backend function specifically tailored for system administrators to manage Users and Businesses.

---

## 🎨 Frontend: React Components & Functions

These functions run inside the admin dashboard panels (`DashboardAdmin.jsx` and `AdminBusinesses.jsx`), interacting with the backend APIs to render or update data.

### 👤 User Management (`DashboardAdmin.jsx`)

#### 1. `fetchUsers()`

- **Type:** React `useEffect` Hook
- **Endpoint Called:** `GET /api/users/get`
- **Description:** Called automatically when the Admin Users panel mounts. It fetches a complete list of all registered users from the backend and stores them in the local React state to populate the grid.

#### 2. `handleEditUser(user)`

- **Type:** Event Handler
- **Endpoint Called:** `GET /api/appointments/user/:id`
- **Description:** Triggered when the admin clicks a user card. It opens the popup modal, populates the input fields with the user's data, and immediately fires an API request to fetch all appointments tied to that specific user.

#### 3. `handleSaveEdit()`

- **Type:** Event Handler
- **Endpoint Called:** `PUT /api/users/:id`
- **Description:** Triggered when the admin confirms user detail edits in the modal. It packages the updated `name` and `email` properties and saves it to the database, instantly updating the frontend UI upon completion.

#### 4. `handleDeleteUser()`

- **Type:** Event Handler
- **Endpoint Called:** `DELETE /api/users/:id`
- **Description:** The final confirmation trigger for deleting a user. Removes the targeted user from the database and scrubs them from the frontend grid.

---

### 🏪 Business Management (`AdminBusinesses.jsx`)

#### 1. `fetchBusinesses()`

- **Type:** React `useEffect` Hook
- **Endpoint Called:** `GET /api/business/`
- **Description:** Automatically fires on page load to fetch an array of all businesses attached to the platform, including dynamically joining the owner's Name and Contact Email.

#### 2. `handleOpenModal(business)`

- **Type:** Event Handler
- **Endpoint Called:** None
- **Description:** Opens the detailed popup modal for a specific business, loading the read-only stats and initializing the `description` edit state.

#### 3. `handleSaveEdit()`

- **Type:** Event Handler
- **Endpoint Called:** `PATCH /api/business/:id/description`
- **Description:** Saves the new locally-edited business description by passing it back to the backend service. Triggers the conditional rendering to flip back from `textarea` to a read-only paragraph.

#### 4. `handleDeleteBusiness()`

- **Type:** Event Handler
- **Endpoint Called:** `DELETE /api/business/:id`
- **Description:** Removes a business from the platform permanently when the 3-step delete sequence is fully completed by the admin.

---

## ⚙️ Backend: Controllers & API Routes

These are the core Node.js/Express functions running on the server that authorize, locate, and process admin requests.

### 👥 User Controller (`src/controllers/user.controller.js`)

#### 1. `getUsers(req, res)`

- **Route:** `GET /api/users/get`
- **Description:** Queries the database (`User.find({})`) to return all users. Extremely lightweight, providing a fast baseline array for the frontend Dashboard.

#### 2. `updateUser(req, res)`

- **Route:** `PUT /api/users/:id`
- **Description:** Takes the `name` and `email` from the request body, and safely triggers `User.findByIdAndUpdate()` against the database, enforcing strict validation to prevent identical emails.

#### 3. `deleteUser(req, res)`

- **Route:** `DELETE /api/users/:id`
- **Description:** Invokes `User.findByIdAndDelete()` for a given user ID.

---

### 🏢 Business Controller (`src/controllers/business.controller.js`)

#### 1. `getAllBusinesses(req, res)`

- **Route:** `GET /api/business/`
- **Description:** Admin-centric endpoint that utilizes MongoDB `.populate("owner", "name email")` to return all business collections merged efficiently with their underlying owner profiles.

#### 2. `updateBusinessDescription(req, res)`

- **Route:** `PATCH /api/business/:id/description`
- **Description:** Narrowly-scoped method ensuring that only the `description` payload provided by the admin is updated. It ignores other fields, protecting business owners from unauthorized structural edits.

#### 3. `deleteBusiness(req, res)`

- **Route:** `DELETE /api/business/:id`
- **Description:** Robust deletion handler. Locates the business in question, deletes it (`findByIdAndDelete`), and _then_ cleans the database by finding and erasing all active appointments (`Appointment.deleteMany`) attached to that specific business.

---

### 📅 Appointment Controller (`src/controllers/appointment.controller.js`)

#### 1. `getUserAppointments(req, res)`

- **Route:** `GET /api/appointments/user/:id`
- **Description:** Created inherently for the Admin panel. Scans the appointment database targeting a deeply nested user ID, allowing the admin popup modal to neatly list every appointment queued up beneath an external user.
