# Todo App

A full-stack todo application built with React, Vite, and Node.js.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ahaan99/todoapp
cd todoapp
```

2. Install Frontend Dependencies
```bash
cd frontend/todoapp
npm install
```

3. Start the Frontend Development Server
```bash
npm run dev
```

## Features

- Create, Read, Update, and Delete todos
- Mark todos as complete/incomplete
- Clean and intuitive user interface
- Responsive design for mobile and desktop

## Project Structure

```
todoapp/
├── frontend/
│   └── todoapp/      # React + Vite frontend
└── backend/          # Node.js backend (if applicable)
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
