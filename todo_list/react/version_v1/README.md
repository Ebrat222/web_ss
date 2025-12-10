# Todo List App

A full-stack todo list application built with ReactJS, Bootstrap, and MongoDB.

## Features

- Create, Read, Update, and Delete (CRUD) operations
- Search functionality
- Responsive design with Bootstrap
- RESTful API backend with Express.js
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Make sure MongoDB is running on your system

## Running the Application

To start both the frontend and backend servers simultaneously:

```bash
npm run dev
```

This will start:
- Frontend React app on http://localhost:3000
- Backend server on http://localhost:5000

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/todos/search/:query` - Search todos by text

## Project Structure

```
todo-list-app/
├── client/           # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       └── App.js
├── server/           # Express backend
│   └── server.js
├── package.json
└── README.md
```

## Technologies Used

- **Frontend**: ReactJS, Bootstrap, React Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Development Tools**: Concurrently, Nodemon

## License

MIT