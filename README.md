# Todo App

A full-stack todo application built with React, Vite, and Node.js.

This project provides a minimal setup to get React working in Vite with Hot Module Replacement (HMR) and ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) — uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) — uses [SWC](https://swc.rs/) for Fast Refresh

---

## 🔧 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

---

## 🚀 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Ahaan99/todoapp
cd todoapp

# 2. Set up environment variables (required for backend/frontend)
# Create a `.env` file in the backend/ and/or frontend/todoapp/ directory
# Example for backend/.env
echo "PORT=5000\nMONGO_URI=your_mongodb_connection_string" > backend/.env

# Example for frontend/todoapp/.env
echo "VITE_API_BASE_URL=http://localhost:5000/api" > frontend/todoapp/.env

# 3. Install frontend dependencies
cd frontend/todoapp
npm install

# 4. Start the frontend development server
npm run dev

✅ Features
Create, read, update, and delete todos

Mark todos as complete or incomplete

Clean, intuitive UI

Mobile and desktop responsive

📁 Project Structure
bash
Copy
Edit
todoapp/
├── frontend/
│   └── todoapp/      # React + Vite frontend
├── backend/          # Node.js backend (if applicable)
└── .env              # Environment variables (ignored in Git)
