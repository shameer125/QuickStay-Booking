# QuickStay - Hotel Booking Platform

A professional MERN stack hotel booking application based on high-fidelity designs.

## Features

- **User & Admin Authentication**: Secure login and registration with JWT.
- **Premium UI/UX**: Clean, responsive design with modern animations and typography.
- **Room Management**: Admins can Add, Edit, and Delete rooms.
- **Booking System**: Users can search for rooms and book their stays.
- **Image Storage**: Cloudinary integration for smooth image uploads.
- **Admin Dashboard**: Real-time stats and management tools.

## Tech Stack

- **Frontend**: React, Vite, Axios, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, Mongoose (MongoDB), JWT.
- **Cloud**: MongoDB Atlas, Cloudinary.

## Getting Started

### 1. Prerequisites
- Node.js installed.
- MongoDB Atlas account.
- Cloudinary account.

### 2. Environment Variables
Create a `.env` file in the `server` directory based on the `.env.example` file provided:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Installation
**Server:**
```bash
cd server
npm install
npm start
```

**Client:**
```bash
cd client
npm install
npm run dev
```

## Folder Structure
- `/client`: React application.
- `/server`: Express API.
