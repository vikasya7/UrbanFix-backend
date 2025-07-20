# UrbanFix Backend

UrbanFix is a smart city civic engagement platform that empowers citizens to report and track local issues like potholes, garbage dumps, and streetlight failures. This repository contains the backend codebase, built using **Node.js**, **Express.js**, and **MongoDB**.

## 🌐 Project Overview

This backend API enables user authentication, issue reporting, image uploads, and issue management functionalities. It provides a RESTful interface consumed by the UrbanFix frontend.

---

## 📁 Folder Structure

urbanfix-backend/
│
├── controllers/ # Request handler logic
├── middleware/ # Auth and error middleware
├── models/ # Mongoose schemas
├── routes/ # API route definitions
├── uploads/ # Uploaded issue images
├── utils/ # Utility functions/helpers
├── .env # Environment variables
├── .gitignore # Git ignore rules
├── app.js # Express app configuration
├── server.js # App entry point
└── package.json # Project metadata and dependencies

yaml
Copy
Edit
## 🚀 Features

- ✅ JWT-based user authentication
- ✅ Issue creation with image upload
- ✅ User-specific issue retrieval
- ✅ Admin support ready (extendable)
- ✅ CORS and security middlewares
- ✅ RESTful API structure

- 📄 .env Example
ini
Copy
Edit
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/urbanfix
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


API Endpoints
Auth
Method	Route	Description
POST	/signup	Register a new user
POST	/login	Login and get token
POST	/logout	Logout user
GET	/me	Get current user


Reports
Method	Route	Description
POST	/create-report	Create a new issue
GET	/all-reports	Get all reports for current user
GET	/single-report/:id	Get details of a specific report

Technologies Used
Node.js

Express.js

MongoDB & Mongoose

Cloudinary (for image upload)

Multer (file upload middleware)

JWT for Auth

CORS & dotenv

Acknowledgements
This project was developed as part of a portfolio showcasing full-stack capabilities for civic-tech solutions.

License
This project is open source under the MIT License.

Author
Vikas Yadav
