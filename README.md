
Built by https://www.blackbox.ai

---

# User Workspace

## Project Overview

User Workspace is a professional web application that integrates various functionalities including the Gemini API, a web crawler, and a chatbot. This project is designed to serve a range of users needing advanced features for web data interaction and automated communication.

## Installation

To set up the User Workspace project locally, follow these steps:

1. **Clone this repository:**
   ```bash
   git clone https://github.com/your-username/user-workspace.git
   cd user-workspace
   ```

2. **Install the dependencies:**
   Ensure you have [Node.js](https://nodejs.org/) installed. Then run:
   ```bash
   npm install
   ```

3. **Create a `.env` file:**
   Copy the `.env.example` and set up your environment variables.

4. **Initialize storage:**
   Run the following command to create necessary directories and files:
   ```bash
   node initStorage.js
   ```

5. **Start the server:**
   You can start the server in development mode with:
   ```bash
   npm run dev
   ```
   or in production mode with:
   ```bash
   npm start
   ```

## Usage

Access the application via your browser at `http://localhost:8000`. The main features include:

- **Crawling Pages:** Use the `/api/crawl` endpoint to trigger the web crawling functionality.
- **Chat Interface:** Utilize the `/api/chat` for communicating with the chatbot.

## Features

- Web crawling functionality with customizable configuration options.
- Chatbot integration using the Gemini API for interactive communication.
- Error handling and logging using Morgan.
- Static file serving for front-end components.

## Dependencies

The project relies on several key dependencies for its functionality:

- [Express](https://expressjs.com/): Web framework for Node.js.
- [Axios](https://axios-http.com/): Promise-based HTTP client for the browser and Node.js.
- [Cheerio](https://cheerio.js.org/): Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
- [Cors](https://www.npmjs.com/package/cors): Package for enabling Cross-Origin Resource Sharing.
- [Dotenv](https://www.npmjs.com/package/dotenv): Module to load environment variables from a `.env` file.
- [Morgan](https://github.com/expressjs/morgan): HTTP request logger middleware for Node.js.

You can find the complete list of dependencies in the `package.json` file.

## Project Structure

The project is structured as follows:

```
user-workspace/
├── data/                  # Directory for storing crawled data
│   └── crawled-data.json  # Initial data file for crawled results
├── routes/                # Directory for route definitions
│   ├── chatRoutes.js      # Routes related to the chat functionality
│   └── crawlRoutes.js     # Routes for web crawling functionality
├── views/                 # Directory for HTML view templates
│   ├── index.html         # Main index view 
│   ├── crawl.html         # View for the crawling interface 
│   └── chat.html          # View for chat interface
├── .env                   # Environment configuration (not committed to Git)
├── config.js              # Configuration settings for the application
├── initStorage.js         # Script to initialize storage directory and files
├── package.json           # NPM package descriptor file
├── package-lock.json      # NPM package lock file to ensure consistent installs
└── server.js              # Main application entry point
```

## License

This project is licensed under the [ISC License](LICENSE).