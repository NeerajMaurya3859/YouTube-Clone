# YouTube Clone

A full-stack video-sharing platform inspired by YouTube, built using the MERN stack. Users can upload and watch videos, create channels, interact with content, manage their uploads, and organize videos into playlists.
The project also includes a separate Python-based AI service that implements semantic video search using Sentence Transformers and MongoDB Atlas Vector Search. It allows users to find relevant videos based on the meaning of their search queries rather than relying only on exact keyword matching.
The project focuses on implementing real-world full-stack functionality, including authentication, media management, REST APIs, database relationships, video processing, AI integration, and responsive user interfaces.

## Table of Contents

- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Configure the Backend](#configure-the-backend)
  - [Run the Backend](#run-the-backend)
  - [Run the Frontend](#run-the-frontend)
  - [Configure the Python AI Service](#configure-the-python-ai-service)
  - [Run the Python AI Service](#run-the-python-ai-service)
- [How to Use](#how-to-use)
- [Environment Variables](#environment-variables)
- [Notes and Limitations](#notes-and-limitations)
- [Future Scope](#future-scope)
- [Author](#author)

## Problem Statement

Video-sharing platforms have become an important part of digital communication and entertainment. However, developing such platforms requires integrating multiple technologies, including frontend development, backend services, authentication systems, databases, and media storage.
Traditional video search systems primarily depend on keyword matching, which may not always retrieve relevant content when users search using different words with similar meanings.
This project aims to develop a YouTube-inspired video-sharing application that allows users to upload, watch, manage, and interact with video content through a user-friendly interface.
It also introduces AI-powered semantic search to improve video discovery by understanding the meaning of search queries and matching them with relevant video content.

## Objectives

1. Develop a full-stack video-sharing platform using the MERN stack.
2. Implement secure user authentication and authorization.
3. Enable users to create and manage personal channels.
4. Implement video uploading, storage, playback, and deletion.
5. Generate video thumbnails automatically using FFmpeg.
6. Provide video interaction features such as likes, dislikes, and comments.
7. Allow users to create and manage playlists.
8. Implement REST APIs for frontend-backend communication.
9. Manage application-wide state using Redux Toolkit.
10. Build a responsive and user-friendly interface.
11. Develop a separate Python-based AI service using FastAPI.
12. Generate semantic embeddings from video titles, descriptions, and tags using Sentence Transformers.
13. Implement semantic video search using MongoDB Atlas Vector Search.
14. Retrieve relevant videos based on the semantic similarity between user queries and video content.

## Features

### 1. User Authentication

- User registration and login.
- Google authentication using Firebase.
- JWT-based authentication.
- Secure HTTP-only cookie-based session management.
- Password hashing using bcrypt.
- Forgot password functionality using email OTP verification.
- Protected routes for authenticated users.

### 2. Video Management

- Upload videos directly from the frontend.
- Store video files using Cloudinary.
- Automatically generate video thumbnails using FFmpeg.
- Upload generated thumbnails to Cloudinary.
- Display uploaded videos with their thumbnails.
- Watch videos using a custom video player.
- Delete uploaded videos.
- Remove deleted video references from associated channels.
- Update Redux state after successful deletion.

### 3. Channel Management

- Create personal channels.
- Customize channel information.
- Update channel name and description.
- Upload channel avatars and banners.
- Display channel information.
- View channel-specific uploaded videos.
- Manage uploaded videos through a dedicated management page.

### 4. Video Interaction

- Like and dislike videos.
- Comment on videos.
- View video comments.
- Track video views.
- Save videos for later.
- Access liked and saved videos.

### 5. Playlists

- Create playlists.
- Add videos to playlists.
- Organize videos into collections.
- Manage video collections.

### 6. YouTube Shorts

- Dedicated Shorts section.
- Create and upload short-form videos.
- Display Shorts separately from regular videos.

### 7. AI-Powered Semantic Video Search

- Generate vector embeddings from video titles, descriptions, and tags.
- Use the pretrained `all-MiniLM-L6-v2` Sentence Transformer model.
- Generate embeddings for user search queries.
- Store video embeddings in MongoDB.
- Perform vector similarity search using MongoDB Atlas Vector Search.
- Retrieve semantically relevant videos instead of depending only on exact keyword matching.
- Return matching video details along with similarity scores.
- Configurable search result limit.

### 8. User Interface

- Responsive user interface.
- Video browsing and playback.
- Search functionality.
- Channel navigation.
- Dedicated pages for liked videos, saved videos, watch history, and subscriptions.
- Redux Toolkit for global state management.

## Architecture

```text
USER
  |
  v
React Frontend (Vite)
  |
  v
Axios Requests
  |
  v
Express.js Server
  |
  |------ Routes
  |
  |------ Authentication Middleware
  |
  |------ Controllers
  |
  v
Mongoose Models
  |
  v
MongoDB


External Media Services
  |
  v
Cloudinary
  |
  |------ Video Storage
  |
  |------ Image Storage


Video Processing
  |
  v
FFmpeg
  |
  v
Automatic Thumbnail Generation


AI Semantic Search
  |
  v
Python FastAPI Service
  |
  v
Sentence Transformer Model
  |
  v
Text Embedding Generation
  |
  v
MongoDB Atlas Vector Search
  |
  v
Semantically Relevant Videos
```

The main application backend is developed using Node.js and Express.js, while the AI functionality is implemented separately using Python and FastAPI.

## Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios

**Backend**
- Node.js
- Express.js
- REST APIs
- JSON Web Token (JWT)
- bcrypt.js
- Multer
- Cookie Parser

**Database**
- MongoDB
- Mongoose
- MongoDB Atlas Vector Search

**AI Service**
- Python
- FastAPI
- Sentence Transformers
- `all-MiniLM-L6-v2`
- PyMongo
- Pydantic
- NumPy (used internally by the embedding model)

**Media Management**
- Cloudinary – Video and image storage.
- FFmpeg – Automatic video thumbnail generation.

**Authentication**
- Firebase Authentication – Google authentication.
- JWT – User authentication and authorization.
- HTTP-only Cookies – Secure token storage.

## Requirements

- Node.js
- npm
- Python 3.10 or later.
- MongoDB Atlas account or local MongoDB installation.
- MongoDB Atlas Vector Search support.
- Cloudinary account.
- Firebase project with Google authentication enabled.
- FFmpeg installed and configured in the system PATH.
- Python virtual environment for the AI service.

## Getting Started

### Configure the Backend

Open a terminal in the `backend/` directory:

**Windows PowerShell**

```powershell
cd backend
npm install
```

Create a `.env` file in the backend root directory and configure the following environment variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

Make sure your MongoDB database, Cloudinary account, and Firebase project are properly configured.

### Run the Backend

From the `backend/` directory, start the development server:

```bash
npm run dev
```

The backend will generally run at:

`http://localhost:8000`

### Run the Frontend

Open another terminal in the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).
Make sure the frontend API configuration points to the running backend server.

### Configure the Python AI Service

Open another terminal in the Python AI service directory.
Create and activate a virtual environment:

**Windows PowerShell**

```powershell
python -m venv .venv
.venv\Scripts\activate
```

Install the required Python dependencies:

```bash
pip install fastapi uvicorn sentence-transformers pymongo python-dotenv
```

Create a `.env` file in the AI service directory:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DATABASE=youtube
MONGODB_COLLECTION=videos
AI_MODEL=sentence-transformers/all-MiniLM-L6-v2
VECTOR_INDEX_NAME=video_embedding_index
BACKEND_API_URL=http://localhost:8000
```

The `AI_MODEL` variable specifies the pretrained Sentence Transformer model used for generating embeddings.
The `VECTOR_INDEX_NAME` variable specifies the MongoDB Atlas Vector Search index.

**MongoDB Vector Search Index Configuration**

Create a Vector Search index in MongoDB Atlas with the following configuration:
Index name:
```text
video_embedding_index
```
Index definition:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    }
  ]
}
```
The index must use the same name configured in the Python AI service.

### Run the Python AI Service

Start the FastAPI application from the AI service directory:

```bash
uvicorn app.main:app --reload --port 5001
```
The AI service will run at:
`http://localhost:5001`

FastAPI interactive API documentation:

`http://localhost:5001/docs`

Health check endpoint:

`http://localhost:5001/health`

**Generate Video Embeddings**

Before performing semantic search, existing videos need to have embeddings stored in MongoDB.
Run the embedding-generation script:

```bash
python generate_embeddings.py
```
The script:
1. Connects to MongoDB.
2. Finds videos that do not have an `embedding` field.
3. Combines their titles, descriptions, and tags into searchable text.
4. Generates embeddings using the Sentence Transformer model.
5. Stores the generated embeddings in the corresponding video documents.
The script skips videos that do not contain searchable text and avoids regenerating embeddings for videos that already have them.

## How to Use

1. Start the backend and frontend servers.
2. Start the Python AI service.
3. Open the application in your browser.
4. Register a new account or sign in using Google authentication.
5. Create your personal channel.
6. Upload a video from your device.
7. The backend processes the uploaded video and generates a thumbnail using FFmpeg.
8. Watch uploaded videos through the video player.
9. Like, dislike, comment on, and save videos.
10. Create playlists to organize your favorite videos.
11. Explore channels, Shorts, subscriptions, and other available sections.
12. Manage your uploaded videos through the channel management section.
13. Use the semantic search API to search for videos based on the meaning of a query.

**Example Semantic Search Request**

```http
POST http://localhost:5001/ai/search
Content-Type: application/json
```
Request body:
```json
{
  "query": "Learn Python programming from beginner level",
  "limit": 10
}
```
The AI service converts the search query into an embedding and uses MongoDB Atlas Vector Search to retrieve semantically similar videos.

## Environment Variables

Configure the required environment variables in `backend/.env`:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```
Configure the Python AI service environment variables in its `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DATABASE=youtube
MONGODB_COLLECTION=videos
AI_MODEL=sentence-transformers/all-MiniLM-L6-v2
VECTOR_INDEX_NAME=video_embedding_index
BACKEND_API_URL=http://localhost:8000
```

Firebase configuration should be provided using the environment variable names expected by the frontend Firebase configuration.
Do not commit `.env` files or expose database credentials, JWT secrets, Cloudinary API secrets, or private credentials on GitHub.

## Notes and Limitations

- This project is a YouTube-inspired application developed for learning and demonstrating full-stack development.
- Video and image storage depends on Cloudinary configuration and account limits.
- Video uploads depend on file size, network speed, and Cloudinary upload limits.
- FFmpeg must be installed and accessible through the system PATH for automatic thumbnail generation.
- Google authentication requires valid Firebase configuration.
- JWT authentication depends on the backend secret and cookie configuration.
- Video playback and upload performance depend on media size and network conditions.
- The application requires a running MongoDB database and backend server.
- The AI service requires a running Python environment and a valid MongoDB connection.
- MongoDB Atlas Vector Search must be configured before semantic search can work.
- Existing videos need embeddings before they can be retrieved through vector search.
- The current embedding-generation script processes videos that do not already contain embeddings.
- The Sentence Transformer model generates embeddings locally through the Python service.
- The semantic search implementation uses vector similarity; it does not use a generative LLM to generate search answers.
- The project is not an official YouTube application.

## Future Scope

- Edit uploaded video details.
- Improve video recommendation functionality.
- Connect semantic search directly with the frontend search interface.
- Automatically generate embeddings when new videos are uploaded.
- Add background processing for embedding generation.
- Improve semantic search ranking and relevance.
- Add advanced video search and filtering.
- Improve video streaming and playback performance.
- Implement more robust error handling.
- Improve mobile responsiveness.
- Add additional AI-powered features.
- Deploy the complete application for public access.

## Author

**Neeraj Maurya**

Email: nmmaurya2255@gmail.com