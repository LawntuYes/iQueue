# Business Dashboard Documentation

This document provides a detailed technical breakdown of the Business Dashboard feature, explaining "every single line of code" and how all components interact with the database.

## 1. Overview

The Business Dashboard (`/dashboard/business`) allows users to:

1.  **Create a Business**: If they don't have one, they fill out a form (Name, Category, Description, Hours).
2.  **View Dashboard**: Once created, they see their business details and a real-time queue of appointments.

## 2. File Architecture

| Layer                  | File Path                                                    | Role                                         |
| :--------------------- | :----------------------------------------------------------- | :------------------------------------------- |
| **Frontend UI**        | `Frontend/src/pages/DashboardBusiness/DashboardBusiness.jsx` | React Component handling the view and state. |
| **Frontend Service**   | `Frontend/src/services/business.js`                          | API wrapper for HTTP requests.               |
| **Backend Routes**     | `Backend/src/routes/business.routes.js`                      | Express router defining API endpoints.       |
| **Backend Controller** | `Backend/src/controllers/business.controller.js`             | Business logic and DB operations.            |
| **Database Model**     | `Backend/src/models/Business.model.js`                       | Mongoose Schema for MongoDB.                 |

---

## 3. Frontend Component (`DashboardBusiness.jsx`)

### Imports

```javascript
import { useState, useEffect } from "react";
// Import service functions to talk to backend
import {
  createBusiness,
  getMyBusiness,
  getBusinessAppointments,
} from "../../services/business";
// Import global styles (e.g. .home-container, .auth-card)
import "../../assets/styles/home.css";
```

### Component State

```javascript
export default function DashboardBusiness() {
  // Stores the fetched business object (null if none exists)
  const [business, setBusiness] = useState(null);
  // Stores the list of appointments for the queue
  const [appointments, setAppointments] = useState([]);
  // UI loading state
  const [loading, setLoading] = useState(true);

  // Form State for "Create Business"
  const [formData, setFormData] = useState({
    name: "",
    category: "Barber Shop", // Default selection
    description: "",
    openTime: "09:00",      // Separate state for time picker
    closeTime: "17:00"      // Separate state for time picker
  });
  const [message, setMessage] = useState("");
```

### Data Fetching (`useEffect`)

```javascript
// Runs once when component loads
useEffect(() => {
  fetchBusinessData();
}, []);

const fetchBusinessData = async () => {
  try {
    // 1. Ask backend: "Do I have a business?"
    const bizData = await getMyBusiness();

    // 2. If yes:
    if (bizData.success && bizData.business) {
      setBusiness(bizData.business); // Save business to state (switches view to Dashboard)

      // 3. fetch appointments for this business
      const apptData = await getBusinessAppointments();
      if (apptData.success) {
        setAppointments(apptData.appointments); // Save queue to state
      }
    }
  } catch (error) {
    console.error("Error fetching business data", error);
  } finally {
    setLoading(false); // Stop loading spinner
  }
};
```

### Creating a Business (`handleCreateBusiness`)

```javascript
const handleCreateBusiness = async (e) => {
  e.preventDefault(); // Stop page reload
  setLoading(true);
  try {
    // 1. Combine openTime and closeTime into one string for DB
    const payload = {
      name: formData.name,
      category: formData.category, // e.g. "Barber Shop"
      description: formData.description,
      operatingHours: `${formData.openTime} - ${formData.closeTime}`,
    };

    // 2. Send POST request to backend
    const data = await createBusiness(payload);

    // 3. If successful, update state (which hides form and shows dashboard)
    if (data.success) {
      setBusiness(data.business);
      setMessage("");
    } else {
      setMessage(data.message || "Failed to create business");
    }
  } catch {
    setMessage("Error creating business");
  } finally {
    setLoading(false);
  }
};
```

---

## 4. Frontend Service (`business.js`)

This file wraps `fetch` calls.

```javascript
import request from "./api"; // Helper that handles base URL (http://localhost:3000/api)

// Sends POST to /api/business
export const createBusiness = async (data) => {
  return request("/business", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Sends GET to /api/business/mybusiness
export const getMyBusiness = async () => {
  return request("/business/mybusiness");
};

// Sends GET to /api/business/appointments
export const getBusinessAppointments = async () => {
  return request("/business/appointments");
};
```

---

## 5. Backend Routes (`business.routes.js`)

Connects URLs to Controller functions.

```javascript
import express from "express";
import {
  createBusiness,
  getMyBusiness,
  getBusinessAppointments,
} from "../controllers/business.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Middleware: Decodes JWT cookie to get 'req.userId'
router.use(verifyToken);

// Map URL paths to functions
router.post("/", createBusiness);
router.get("/mybusiness", getMyBusiness);
router.get("/appointments", getBusinessAppointments);

export default router;
```

---

## 6. Backend Logic (`business.controller.js`)

### `createBusiness`

```javascript
export const createBusiness = async (req, res) => {
  try {
    // 1. Destructure data from React payload
    const { name, description, operatingHours, category } = req.body;
    const userId = req.userId; // From Auth Middleware

    // 2. Database Check: Does this user already have a business?
    const existingBusiness = await Business.findOne({ owner: userId });
    if (existingBusiness) {
      return res.status(400).json({ success: false, message: "User already owns a business" });
    }

    // 3. Create new Mongoose Document
    const newBusiness = new Business({
      owner: userId,
      name,
      description,
      operatingHours,
      category: category || "Other", // Default if missing
    });

    // 4. Save to MongoDB
    await newBusiness.save();

    // 5. Respond to frontend
    res.status(201).json({ success: true, business: newBusiness });
  } catch (error) { ... }
};
```

### `getBusinessAppointments`

```javascript
export const getBusinessAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    // 1. Find the business owned by this user
    const business = await Business.findOne({ owner: userId });

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    // 2. Find ALL appointments where 'business' field matches this business ID
    const appointments = await Appointment.find({ business: business._id })
      .populate("user", "name email") // Join with User table to get name
      .sort({ date: 1, time: 1 });    // Sort by date/time

    res.status(200).json({ success: true, appointments });
  } catch (error) { ... }
};
```

---

## 7. Database Model (`Business.model.js`)

Defines the structure of the `businesses` collection in MongoDB.

```javascript
import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the 'users' collection
      required: true,
      unique: true, // Enforces 1 business per user
    },
    name: {
      type: String,
      required: true,
      trim: true, // Removes whitespace
    },
    description: {
      type: String,
      trim: true,
    },
    operatingHours: {
      type: String, // Stored as "09:00 - 17:00"
      default: "9:00 AM - 5:00 PM",
    },
    category: {
      type: String,
      // Restricts values to this list (Matches valid Frontend options)
      enum: ["Barber Shop", "Restaurant", "Shows", "Other"],
      default: "Other",
    },
  },
  { timestamps: true } // Adds createdAt, updatedAt
);

export const Business = mongoose.model("Business", businessSchema);
```

## 8. Database Connection Summary

1.  **React State** (`formData`) holds the user input.
2.  **Service** (`fetch`) sends JSON to Express API.
3.  **Controller** uses `Business` model.
4.  **Mongoose** translates this to a MongoDB Insert/Find command.
5.  **MongoDB Atlas** stores the document.
6.  **Data** flows back as JSON to React, which updates state (`setBusiness`) and re-renders the UI to show the dashboard.
