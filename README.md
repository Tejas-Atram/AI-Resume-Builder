# AI Resume Builder

A powerful full-stack MERN application that helps users create, manage, and download professional resumes with AI-powered assistance from Google's Gemini. Build impressive resumes quickly with intelligent suggestions for summaries and job descriptions, all within a modern and intuitive interface.

This project is divided into two main parts:

  * `/client`: The frontend, built with React, Vite, and Redux.
  * `/server`: The backend, built with Node.js, Express, and MongoDB.

## 📸 Features

  * **User Authentication:** Secure user registration and login (using JWT and bcrypt).
  * **Full CRUD Functionality:** Create, Read, Update, and Delete multiple resumes.
  * **AI-Powered Suggestions:** Integrates Google's Gemini model to generate professional summaries and compelling descriptions for work experience.
  * **File Uploads:** Users can upload a profile picture for their resume (handled by Multer).
  * **Dynamic Form Editing:** A smooth, multi-step form experience.
  * **State Management:** Centralized state management using Redux Toolkit.
  * **Real-time Feedback:** Modern UI notifications using `react-hot-toast`.
  * **Responsive Design:** Clean and accessible UI built with `lucide-react` for icons.

## 🛠️ Tech Stack

Here's a list of the major technologies used in this project:

| Category | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Redux Toolkit, Axios, `lucide-react`, `react-hot-toast` |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (with Mongoose) |
| **AI** | Google Gemini API |
| **Authentication** | JSON Web Tokens (JWT), bcrypt |
| **File Handling** | Multer |
| **Environment** | `dotenv` |

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need the following installed on your machine:

  * [Node.js (v18 or later)](https://nodejs.org/en)
  * `npm`
  * A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account (for the database)
  * A [Google Gemini API Key](https://ai.google.dev/)

-----

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/DheerajSai6/AI_Resume_Builder_MERN.git
   cd AI_Resume_Builder_MERN
   ```

2. **Backend Setup (Server)**
   ```bash
   cd server
   npm install
   ```
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   ```
   
   Start the server:
   ```bash
   npm start
   ```

3. **Frontend Setup (Client)**
   ```bash
   cd client
   npm install
   ```
   
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   
   Start the development server:
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`


## 🗺️ API Endpoints

A quick overview of the main API routes available:

### User Routes (`/api/users`)

  * `POST /register`: Register a new user.
  * `POST /login`: Log in an existing user.

### Resume Routes (`/api/resumes`)

  * `POST /create`: Create a new resume (requires auth).
  * `GET /get/:id`: Get a specific resume by its ID (requires auth).
  * `DELETE /delete/:id`: Delete a specific resume (requires auth).
  * `PUT /update/:id`: Update an existing resume (requires auth).

### Gemini AI Routes (`/api/gemini`)

  * `POST /generate-summary`: Send a prompt to generate a professional summary.
  * `POST /generate-experience`: Send a prompt to generate bullet points for work experience.

## �‍💻 Author

**Dheeraj Sai**
- GitHub: [@DheerajSai6](https://github.com/DheerajSai6)

## 🙏 Acknowledgements

This project showcases the integration of modern full-stack technologies with AI capabilities:

  * Documentation for [React](https://react.dev/), [Redux Toolkit](https://redux-toolkit.js.org/), and [Express.js](https://expressjs.com/).
  * The teams behind [Vite](https://vitejs.dev/) and [MongoDB](https://www.mongodb.com/).
  * [Lucide](https://lucide.dev/) for the icon set.
  * Google Gemini AI for intelligent content generation.
