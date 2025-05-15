# Chess Game

A real-time multiplayer chess game built with Node.js, Express, Socket.IO, React, and chess.js.

## Features

- Real-time multiplayer gameplay
- Move validation using chess.js
- Support for special moves (castling, en passant, promotion)
- Game over detection (checkmate, stalemate, draw)
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will open automatically in your default browser at `http://localhost:3001`

## How to Play

1. Open the application in your browser
2. Click "Create New Game" to start a new game
3. Share the game ID with a friend (or open the app in another browser)
4. Have the other player click "Join Game" and enter the game ID
5. The game will start automatically when both players have joined
6. Players take turns making moves

## Project Structure

```
chess/
├── backend/              # Backend server code
│   ├── node_modules/     # Backend dependencies
│   ├── server.js         # Main server file
│   ├── package.json      # Backend dependencies and scripts
│   └── README.md         # Backend documentation
├── frontend/             # Frontend React application
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── components/   # React components
│   │   ├── App.js        # Main React component
│   │   └── index.js      # Entry point
│   └── package.json      # Frontend dependencies and scripts
└── README.md             # Project documentation
```

## Technologies Used

- **Backend**:
  - Node.js
  - Express
  - Socket.IO
  - chess.js

- **Frontend**:
  - React
  - React Chessboard
  - Chakra UI
  - Socket.IO Client

## License

This project is open source and available under the [MIT License](LICENSE).
