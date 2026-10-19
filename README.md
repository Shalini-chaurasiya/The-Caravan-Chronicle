# 🏛️ Caravan Chronicle — Municipal Grievance Management System

A full-stack **Municipal Grievance Management System** that allows citizens to submit and track complaints while providing administrators with a centralized dashboard to manage complaints, staff, departments, and grievance-related activities.

The project is designed to make municipal complaint management more organized, transparent, and efficient.

---

## 📌 Features

### 👤 Citizen Portal

- Citizen registration and login
- Secure authentication
- Submit municipal complaints
- Select complaint type and department
- Track complaint status
- View complaint history
- Manage citizen profile
- Contact/support functionality

### 🛡️ Admin Dashboard

- Secure admin login
- Dashboard overview
- View all citizen complaints
- View detailed complaint information
- Manage staff members
- Manage departments
- SLA & escalation management
- Reports & analytics
- Activity log
- Public portal management
- Admin profile management
- Admin logout

### 👨‍💼 Staff Management

Administrators can manage municipal staff through the Staff Management module.

- Add new staff members
- Upload staff profile photos
- View staff members stored in MongoDB
- Search staff
- Filter by department
- Filter by active/inactive status
- View staff details
- Edit staff information
- Activate/deactivate staff accounts
- Delete staff members
- Assign staff to relevant municipal departments
- Track assigned complaints

### 📋 Complaint Management

- Centralized complaint management
- Complaint categorization
- Department-based complaint handling
- Staff assignment
- Complaint status tracking
- Complaint details
- Complaint history
- Status workflow such as:
  - Pending
  - In Progress
  - Resolved
  - Rejected

### 🔐 Authentication & Authorization

- Citizen authentication
- Admin authentication
- Protected admin routes
- JWT-based authentication
- Password hashing using bcrypt
- Protected API endpoints
- Admin-only staff management operations

### 📷 Staff Photo Upload

Staff profile photos can be uploaded through the backend.

Supported formats:

- JPG / JPEG
- PNG
- WebP

Maximum file size:

```text
2 MB
```

Uploaded images are served through the backend `/uploads` endpoint.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Tailwind CSS
- JavaScript
- Fetch API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt / bcryptjs
- Multer
- CORS
- dotenv

### Database

- MongoDB
- MongoDB Atlas

---

## 📂 Project Structure

```text
The-Caravan-Chronicle/
│
├── backened/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── profileController.js
│   │   ├── staffController.js
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── ...
│   │
│   ├── models/
│   │   ├── Staff.js
│   │   ├── Complaint.js
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── staffRoutes.js
│   │   └── ...
│   │
│   ├── uploads/
│   │   └── staff/
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── vite-project/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   ├── AllComplaints.jsx
│   │   │   │   ├── ComplaintDetails.jsx
│   │   │   │   ├── StaffManagement.jsx
│   │   │   │   ├── StaffTable.jsx
│   │   │   │   ├── AddStaffModal.jsx
│   │   │   │   ├── Departments.jsx
│   │   │   │   ├── SLASettings.jsx
│   │   │   │   ├── ReportsAnalytics.jsx
│   │   │   │   ├── PublicPortal.jsx
│   │   │   │   ├── ActivityLog.jsx
│   │   │   │   └── Profile.jsx
│   │   │   │
│   │   │   └── ...
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Shalini-chaurasiya/The-Caravan-Chronicle.git
```

```bash
cd The-Caravan-Chronicle
```

---

## ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd backened
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backened` folder.

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any other environment variables required by your existing backend configuration.

Start the backend:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:3000
```

---

## 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd vite-project
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

The admin frontend may also use:

```text
http://localhost:5174
```

---

## 🔗 Backend API Routes

### Authentication

```text
/api/auth
```

### Contact

```text
/api/contact
```

### Dashboard

```text
/api/dashboard
```

### Complaints

```text
/api/complaints
```

### Profile

```text
/api/profile
```

### Admin

```text
/api/admin
```

### Staff

```text
/api/staff
```

---

## 👨‍💼 Staff API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/staff` | Get all staff |
| `GET` | `/api/staff/:id` | Get staff details |
| `POST` | `/api/staff` | Add staff |
| `PUT` | `/api/staff/:id` | Edit staff |
| `PATCH` | `/api/staff/:id/status` | Activate/deactivate staff |
| `DELETE` | `/api/staff/:id` | Delete staff |

Staff management routes are protected using admin authentication.

---

## 📷 Uploading Staff Photos

Staff photos are uploaded using `multipart/form-data`.

The photo field is:

```text
photo
```

Allowed formats:

```text
JPG
PNG
WebP
```

Maximum size:

```text
2 MB
```

Photos are stored inside:

```text
backened/uploads/staff/
```

and served through:

```text
http://localhost:3000/uploads/
```

---

## 🔐 Environment Variables

Do not commit your `.env` file to GitHub.

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Add `.env` to `.gitignore`:

```text
.env
node_modules/
uploads/
```

---

## 🔄 Application Flow

```text
                    ┌──────────────────┐
                    │     Citizen      │
                    └────────┬─────────┘
                             │
                             ▼
                    Submit Complaint
                             │
                             ▼
                    ┌──────────────────┐
                    │     Backend      │
                    │  Node + Express  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     MongoDB      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Admin Dashboard │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
          Complaints       Staff        Departments
              │              │
              └──────────────┼──────────────┘
                             ▼
                    Complaint Assignment
                             │
                             ▼
                       Status Update
                             │
                             ▼
                       Resolution
```

---

## 🧩 Main Admin Modules

```text
Admin Dashboard
│
├── Dashboard
├── All Complaints
│   └── Complaint Details
├── Staff Management
│   ├── Add Staff
│   ├── View Staff
│   ├── Edit Staff
│   ├── Activate / Deactivate
│   └── Delete Staff
├── Departments
├── SLA & Escalation
├── Reports & Analytics
├── Public Portal
├── Activity Log
└── Profile
```

---

## 🔒 Security

The project implements several security practices:

- JWT-based authentication
- Password hashing using bcrypt
- Protected admin APIs
- CORS configuration
- Environment variables for sensitive configuration
- Input validation
- File-type validation for uploaded images
- File-size restrictions
- Passwords are never returned in staff API responses

---

## 🧪 Development

Run the frontend and backend in separate terminals.

### Terminal 1 — Backend

```bash
cd backened
npm run dev
```

### Terminal 2 — Frontend

```bash
cd vite-project
npm run dev
```

---

## 📈 Future Improvements

Possible future enhancements include:

- Real-time complaint notifications
- Email/SMS notifications
- Advanced reports and charts
- Automatic SLA escalation
- Staff workload management
- Role-based permissions
- Complaint priority management
- AI-powered complaint categorization
- AI chatbot for citizen assistance
- Complaint analytics
- Cloud-based image storage
- Production deployment

---

## 👩‍💻 Author

**Shalini Chaurasiya** |
**Vaishnavi Gupta** |
**Astha Singh** |
**Usha Kumari** 

B.Tech — Electronics & Communication Engineering  
MNNIT Allahabad / Prayagraj

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.
