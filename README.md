# Healthcare Appointment & Prescription Management Platform

A full-stack healthcare platform built using React, NestJS, PostgreSQL, and TypeORM.

## Features

### Patient

* Register & Login
* Search Doctors
* Book Appointments
* Online Payments (Razorpay)
* View Appointments
* View Prescriptions
* Download Prescription PDF

### Hospital

* Manage Doctors
* Manage Availability
* Manage Appointments
* Complete Appointments
* Generate Prescriptions

### System Features

* JWT Authentication
* Email Notifications
* Reviews & Ratings
* PDF Prescription Generation
* PostgreSQL Database
* REST APIs

## Tech Stack

### Frontend

* React
* React Router
* Axios
* Tailwind CSS

### Backend

* NestJS
* TypeORM
* PostgreSQL
* JWT Authentication
* Nodemailer
* Razorpay
* PDFKit

## Installation

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Backend:

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

JWT_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

Frontend:

```env
VITE_API_URL=http://localhost:3000
```

## Author

Harshavardhan Kasturi
