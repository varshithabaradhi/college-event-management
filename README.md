# Online College Event Management System 🎓

A complete, modern full-stack web application for colleges and universities to manage, publish, and organize campus events. Students can browse technical symposiums, hackathons, sports meets, and cultural festivals, register with real-time seat tracking, receive digital tickets with verified QR codes, download official participation certificates (PDF), and submit ratings & reviews. Administrators have full event lifecycle controls, student directories, venue management, live QR attendance check-in, and exportable CSV reports.

---

## 🌟 Key Features

### 👨‍💼 1. Admin Module
- **Secure Authentication**: Dedicated admin login with encrypted password storage.
- **Event Lifecycle (CRUD)**: Create, edit, and delete events with date, time, venue, max capacity, registration deadlines, and cover banners.
- **Student Management**: View all registered students, their departmental affiliation, and activity history.
- **Registration Approval Workflow**: Real-time participant status updates (`Approved`, `Pending`, `Attended`, `Rejected`).
- **QR Code Attendance Scanner**: Built-in verification tool supporting webcam QR scanning, USB barcode scanners, and ticket codes (`TKT-XXXX`) to record attendance and prevent duplicate entries.
- **Analytics & Exportable Reports**: Visual stats, category distribution, attendance turnout rates, and 1-click **CSV report exports**.
- **Campus Venues**: Track auditoriums, seminar halls, and seating capacities.

### 👩‍🎓 2. Student Module
- **Account Registration & Login**: Student signup capturing Name, Email, Roll/USN Number, Department, and Contact.
- **Event Catalog**: Browse upcoming, ongoing, and completed campus events with live search, category filtering, and capacity meters.
- **1-Click Event Registration**: Automatic slot check, registration deadline enforcement, and duplicate prevention.
- **Digital Ticket Pass with QR Code**: Generates encrypted, printable dynamic QR codes for venue admission.
- **Automated PDF Certificate Generation**: Instant high-resolution certificate of participation generated via PDFKit with student name, event title, unique certificate ID, and college seals.
- **Ratings & Feedback**: Post-event 5-star rating system and feedback comments.
- **Notifications Hub**: In-app notifications for registration approvals, ticket alerts, and event updates.

---

## 🛠️ Technology Stack

- **Backend**: Node.js & Express.js
- **Database**: SQLite (via `better-sqlite3` - zero-configuration, lightning fast) + MySQL compatible SQL dump included (`database/schema.sql`)
- **Frontend / Templating**: EJS, Bootstrap 5.3, Bootstrap Icons
- **Security & Utilities**: `bcryptjs` (password hashing), `express-session` (session authentication), `qrcode` (ticket QR generation), `pdfkit` (PDF certificate generation)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure **Node.js** (v18 or higher) is installed on your computer.

### 2. Run the Application
Open a terminal inside the project directory (`college`) and execute:

```bash
# Start the web server
npm start
```

Or for automatic reload during development:
```bash
npm run dev
```

### 3. Open in Browser
Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Default Credentials (Ready for Demo)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@college.edu` | `admin123` | Full access to event creation, QR check-in, reports & venues |
| **Student (Demo 1)** | `student@college.edu` | `student123` | Roll No: `22CS101` (CSE) - Has sample tickets & certificates |
| **Student (Demo 2)** | `rahul@college.edu` | `student123` | Roll No: `22EC204` (ECE) |

*You can also register new student accounts directly from the UI via the **Student Register** button.*

---

## 🗄️ Database Structure

The project includes an automatic initialization engine (`database/db.js`) that creates and seeds the database on first run. For MySQL/phpMyAdmin/XAMPP users, a standalone `database/schema.sql` is also provided.

### Tables Overview:
1. `admins` - Administrator accounts and access roles.
2. `students` - Student details (name, email, password, roll_no, department, phone).
3. `venues` - College venues, locations, and seating capacities.
4. `events` - Event titles, descriptions, categories, dates, venues, organizers, deadlines, and capacities.
5. `registrations` - Student event bookings, unique ticket codes (`TKT-...`), approval status, and attendance timestamps.
6. `notifications` - In-app messages and alerts for students.
7. `feedback` - Ratings (1-5 stars) and reviews for events.
8. `certificates` - Generated certificate serial numbers linked to verified attendances.

---

## 📂 Project Directory Structure

```
college/
├── database/
│   ├── db.js             # SQLite initialization, table setup, and auto-seeding
│   └── schema.sql        # MySQL dump file for XAMPP / phpMyAdmin import
├── middleware/
│   └── auth.js           # Student & Admin session authentication middleware
├── routes/
│   ├── auth.js           # Login, registration, and logout handlers
│   ├── events.js         # Public event browsing, filtering, and event detail views
│   ├── student.js        # Dashboard, my-events, QR tickets, PDF certificates, feedback
│   └── admin.js          # Admin dashboard, event CRUD, QR check-in, venues, reports
├── views/
│   ├── partials/         # Reusable header, footer, navbar, alerts, 404
│   ├── index.ejs         # Landing homepage with featured events & campus stats
│   ├── auth/             # Login and Registration templates
│   ├── events/           # Catalog list and Event detail pages
│   ├── student/          # Student dashboard, my-events, QR pass, notifications
│   └── admin/            # Admin control panel, events table, QR scanner, reports
├── public/
│   ├── css/style.css     # Custom modern styling
│   └── js/main.js        # Interactive client scripts
├── server.js             # Express application entrypoint
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

---

## 📱 How to Test QR Attendance Verification
1. Log in as **Student** (`student@college.edu` / `student123`).
2. Go to **My Registrations** and click **Pass** to view your digital ticket and QR code. Note down the ticket code (e.g. `TKT-HS26-90412`).
3. Log out and sign in as **Administrator** (`admin@college.edu` / `admin123`).
4. Navigate to **QR Check-in**.
5. Type or scan the ticket code (or click any of the quick test sample buttons) and click **Verify & Check In**.
6. The system marks the student as **Attended** and triggers an attendance confirmation notification.
7. Switch back to the student portal — the **Download Certificate** button is now active, generating a formatted PDF certificate!

---

## 🔥 Firebase Cloud Deployment

This project is integrated and deployed to Google Firebase:
- **Live Hosting URL**: **[https://event-433eb.web.app](https://event-433eb.web.app)**
- **Firebase Project ID**: `event-433eb`
- **Firebase Web App ID**: `1:65144884283:web:51e7de7c19a6ef1fa3201e`
- **Features on Cloud**:
  - Global CDN delivery via Firebase Hosting
  - Responsive single-page client architecture with Firebase Auth & Firestore sync
  - Dynamic QR ticket generation and QR attendance check-in
  - In-browser Certificate of Participation generation and printing
  - 1-Click redeploy: `npx firebase-tools deploy --only hosting`

