# Web System Project

This is a full-stack web application managed with Docker Compose.

## Prerequisites

Before running this project, ensure you have the following software installed on your system:

- Docker
- Docker Compose

## How to Run

1. Clone this repository to your local machine:

   ```
   git clone <your-repository-url>
   cd <project-directory>
   ```

2. Make sure you're in the project root directory (the one containing the docker-compose.yml file).

3. Build and start the containers:

   ```
   docker-compose up --build
   ```

   This command will build the necessary Docker images and start all services.

4. Wait for all services to start. You should see output similar to:

   ```
   frontend_1  | Starting the development server...
   backend_1   | Server running on port 5000
   nginx_1     | /docker-entrypoint.sh: Configuration complete; ready for start up
   ```

5. Open a browser and visit http://localhost. You should see the frontend interface of the application.

6. API requests will be automatically routed to the backend service.

## Stopping the Application

To stop the application and remove the containers, press Ctrl+C in the terminal, then run:
