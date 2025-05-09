# Full Stack Blog Application

A full-stack blog platform built with React, Node.js, and MongoDB, featuring user authentication, email verification, and dynamic content management.

## Project Images

### Home Page

![Home Page](./project-images/blog-image1.png)

### User Dashboard

![User Dashboard](./project-images/blog-image2.png)

### Admin Dashboard

![Admin Dashboard](./project-images/blog-image3.png)

## Features

### User Management

-   User registration with email verification
-   Secure login system
-   User dashboard for managing posts
-   Admin dashboard for content moderation

### Blog Functionality

-   Create, read, update, and delete blog posts
-   Rich text editing for post content
-   Image upload support for post covers
-   Comment system on blog posts
-   Like/unlike posts
-   Search functionality
-   Responsive design for all devices

### Security

-   JWT-based authentication
-   Password hashing
-   Protected routes
-   Email verification system

## Tech Stack

### Frontend

-   React with TypeScript
-   React Router for navigation
-   Tailwind CSS for styling
-   Shadcn UI components
-   Tanstack Query for data fetching
-   Date-fns for date formatting
-   Sonner for toast notifications

### Backend

-   Node.js with Express
-   MongoDB with Mongoose
-   JWT for authentication
-   Nodemailer for email services
-   Multer for file uploads
-   CORS support

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB installed locally or MongoDB Atlas account
-   Gmail account for email services

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

5. Start the backend server:

```bash
cd backend
npm run dev
```

6. Start the frontend development server:

```bash
cd ..
npm run dev
```

The application will be available at `http://localhost:5173`

## Features Overview

### Home Page

-   Featured post section
-   Latest posts grid
-   Responsive navigation

### Authentication

-   User registration with email verification
-   Login with email and password
-   Protected routes for authenticated users

### Post Management

-   Create new posts with title, content, and cover image
-   Edit existing posts
-   Delete posts
-   Like/unlike functionality
-   Comment system

### User Dashboard

-   View all user posts
-   Post statistics (views, likes)
-   Quick actions (edit, delete)

### Admin Dashboard

-   Manage all posts
-   User management
-   Content moderation
