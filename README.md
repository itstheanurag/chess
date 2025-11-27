# Chess Game 🎮♟️

A modern, real-time multiplayer chess game built with **Node.js**, **Express**, **Socket.IO**, **React**, and **chess.js**.

![Chess Game](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

---

## ✨ Features

- ♟️ **Real-time multiplayer chess** with Socket.IO
- 🎯 **Complete chess rules** including castling, en passant, and promotion
- 👤 **User authentication** with Better Auth
- 📊 **Leaderboards** and player statistics
- 🧩 **Daily chess puzzles**
- 💬 **Real-time chat** functionality
- 🎨 **Modern UI** with Tailwind CSS v4 and Framer Motion
- 📱 **Responsive design** for all devices

[**View all features →**](./docs/FEATURES.md)

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- Redis
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chess.git
cd chess

# Backend setup
cd backend
pnpm install
cp .env.example .env
# Edit .env with your configuration
pnpm db:push
pnpm dev

# Frontend setup (in a new terminal)
cd frontend
pnpm install
cp .env.example .env
# Edit .env with your configuration
pnpm dev
```

**[📖 Detailed Setup Guide →](./docs/SETUP.md)**

---

## 📚 Documentation

- **[Features](./docs/FEATURES.md)** - Complete list of features
- **[Tech Stack](./docs/TECH_STACK.md)** - Technologies used
- **[Project Structure](./docs/PROJECT_STRUCTURE.md)** - Codebase organization
- **[Setup Guide](./docs/SETUP.md)** - Installation and configuration
- **[API Documentation](./docs/API.md)** - REST and WebSocket API reference
- **[Scripts](./docs/SCRIPTS.md)** - Available npm/pnpm scripts

---

## 🛠️ Tech Stack

### Backend

- Node.js & Express
- Socket.IO for real-time communication
- Drizzle ORM with PostgreSQL
- Redis for caching
- Better Auth for authentication

### Frontend

- React 19 with TypeScript
- Vite for fast development
- Zustand for state management
- Tailwind CSS v4
- Framer Motion for animations

**[View complete tech stack →](./docs/TECH_STACK.md)**

---

## 📁 Project Structure

```
chess/
├── backend/          # Node.js + Express + Socket.IO
├── frontend/         # React + Vite + TypeScript
├── docs/             # Documentation
└── README.md         # This file
```

**[View detailed structure →](./docs/PROJECT_STRUCTURE.md)**

---

## 🎮 Usage

1. **Start the backend server** (runs on `http://localhost:3000`)
2. **Start the frontend** (runs on `http://localhost:5173`)
3. **Create an account** or log in
4. **Create a game** or join an existing one
5. **Play chess** in real-time!

---

## 🧪 Available Scripts

### Backend

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm db:generate  # Generate database migrations
pnpm db:push      # Push schema to database
```

### Frontend

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build
```

**[View all scripts →](./docs/SCRIPTS.md)**

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [chess.js](https://github.com/jhlywa/chess.js) - Chess logic library
- [Socket.IO](https://socket.io/) - Real-time communication
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Better Auth](https://www.better-auth.com/) - Authentication library

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Happy Chess Playing! ♟️**
