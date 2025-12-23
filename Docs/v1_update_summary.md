# iQueue V1 Update Summary

This document outlines the recent major updates and features implemented in the iQueue application.

## 1. User Interface & Experience (UI/UX)

- **Modern Homepage**: Replaced the placeholder home page with a modern, animated landing page featuring:
  - Floating background shapes with gradients.
  - Shimmering text effects.
  - Glassmorphism UI elements.
- **Layout Improvements**:
  - **Footer Fix**: The footer background is now transparent, allowing the page's main gradient to flow seamlessly to the bottom.
  - **Dashboard Styling**: Both User and Business dashboards now use a glassmorphism card design to match the overall aesthetic.

## 2. Authentication & Navigation

- **Logout Functionality**: Implemented secure server-side logout (clearing HTTP-only cookies) and frontend state cleanup.
- **Navbar Updates**:
  - Displays the user's full name instead of a generic role.
  - Removed debug/testing buttons.
  - Responsive design adjustments.

## 3. User Dashboard (Appointments)

- **Appointment Booking**:
  - Users can now book slots by selecting a Date and Time.
  - _Note: Currently generic (not linked to specific business in UI selection yet)._
- **My Appointments**:
  - Displays a list of the user's upcoming appointments.
  - Styled with individual cards showing status tags (e.g., PENDING, CONFIRMED).

## 4. Business Dashboard

- **Create Business Profile**:
  - First-time business users are prompted to create a profile.
  - Fields: Business Name, Description, Operating Hours.
- **Queue Management**:
  - **Current Queue**: Displays a list of appointments booked for this business.
  - **Status**: Visual indicator that the business is active.

## 5. Backend Architecture

- **New Models**:
  - `Appointment`: Stores date, time, status, user reference, and business reference.
  - `Business`: Stores owner, name, description, and hours.
- **API Routes**:
  - `POST /api/appointments`: Create appointment.
  - `GET /api/appointments/my-appointments`: Fetch user bookings.
  - `POST /api/business`: Create business.
  - `GET /api/business/mybusiness`: Fetch current user's business.
  - `GET /api/business/appointments`: Fetch business queue.
