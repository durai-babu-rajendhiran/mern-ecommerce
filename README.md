
## Project Overview

This project includes two main components:
- **Frontend**: A React application that serves as the user interface.
- **Backend**: A Node.js application that handles API requests and communicates with the MongoDB database.

## Installation

To get started, you'll need to set up both the frontend and backend components of the application.

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or yarn
- MongoDB (local installation or a cloud-based service like MongoDB Atlas)

### Backend Setup

1. Navigate to the `server` directory:
    ```bash
    cd server
    ```

2. Install backend dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables. Create a `.env` file in the `server` directory and add your configuration variables (e.g., MongoDB connection string).

4. Start the backend server:
    ```bash
    npm start
    ```

### Frontend Setup

1. Navigate to the `client` directory:
    ```bash
    cd client
    ```

2. Install frontend dependencies:
    ```bash
    npm install
    ```

3. Start the frontend development server:
    ```bash
    npm start
    ```

The frontend application will be available at `http://localhost:3000` by default, and the backend will be available at `http://localhost:5000` (or another port specified in your `.env` file).

## Usage

- **Frontend**: The React application provides the user interface for browsing products, managing the shopping cart, and completing purchases.
- **Backend**: The Node.js server handles API requests related to products, user authentication, and order management.

Make sure both the frontend and backend servers are running simultaneously to fully interact with the application.

## Directory Structure

Here is an overview of the project directory structure:

- `/client`: React frontend application
  - `/src`: Source files for the frontend application
    - `firebase.js`: Firebase service configuration for the frontend

- `/server`: Node.js backend application
  - `/src`: Source files for the backend application
    - `/v1`: API version 1
      - `/config`: Configuration files
        - `fbServiceAccountKey.json`: Firebase service setup for the backend

## Firebase Setup

Both the frontend and backend use Firebase for authentication and other services. Make sure you have configured Firebase correctly:

1. **Backend**: 
   - Place the Firebase service account key in `server/src/v1/config/fbServiceAccountKey.json`.
   - Ensure your Firebase credentials are correctly configured in your backend environment.

2. **Frontend**:
   - Update `client/src/firebase.js` with your Firebase project configuration details.

If you have any questions or run into issues, feel free to open an issue in the repository or reach out to the maintainers.

Happy coding! 🚀
