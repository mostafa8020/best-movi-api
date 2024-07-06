# Best Movie Api

## Description

Best Movie Api is the server-side of the Best Movie Api application, developed using the NestJS framework. It focuses on providing robust and efficient server-side logic, data management, and API services, ensuring a seamless integration with the frontend part of the application.

## Getting Started

### Prerequisites

- Node.js (Version 18.0 or higher)
- npm or yarn
- Docker 

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mostafa8020/best-movi-api.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd best-movie-api
   ```
3. **Copy the Environment Variables File**:
   ```bash
   cp .env.example .env
   ```
4. **Start Application**:
   ```bash
   docker compose up 
   ```
5. **Verify Application Status**:
   ```bash
   curl --location 'http://localhost:3000/healthz'
   ```


## Standards for Git Commit Messages

- **Format**: `type(scope): subject`
- **Type**: Indicate the change type: `feat` (new feature), `fix` (bug fix), `docs`, `style`, `refactor`, `test`, `chore`.
- **Scope**: Reference the area affected (e.g., `user-auth`, `database`, `API`).
- **Subject**: Briefly describe the change in imperative, present tense.

Example:

```
feat(user-auth): add OAuth2 login support
```

## Documentation

- **API Documentation**: Check Postman Workspace (https://www.postman.com/bold-shadow-975679/workspace/best-movie-api/collection/25932814-491fca16-afd8-4aae-a70d-c824c28b5eb7?action=share&creator=25932814)
- **Code Documentation**: Inline comments and doc strings where necessary.
- **Swagger Documentation** : Check Api Docs at 'http://localhost:3000/api-docs'

### Project Structure

The project is structured into several modules, each responsible for a specific part of the application.

#### Entities

##### Movies
- **File**: `src/movies/entities/movie.entity.ts`
- **Description**: Defines the schema for the Movie entity.

##### Users
- **File**: `src/users/entities/user.entity.ts`
- **Description**: Defines the schema for the User entity.

#### Services

##### Movies Service
- **File**: `src/movies/movies.service.ts`
- **Description**: Contains the business logic for managing movies.

##### Users Service
- **File**: `src/users/users.service.ts`
- **Description**: Contains the business logic for managing users.

#### Controllers

##### Movies Controller
- **File**: `src/movies/movies.controller.ts`
- **Description**: Handles HTTP requests related to movies.

##### Users Controller
- **File**: `src/users/users.controller.ts`
- **Description**: Handles HTTP requests related to users.

#### Authentication

##### Auth Module
- **File**: `src/auth/auth.module.ts`
- **Description**: Manages authentication logic.

#### Global Module

##### App Module
- **File**: `src/app.module.ts`
- **Description**: Applies global interceptors, filters, and guards. Implements rate limiting for API endpoints.

### Caching

#### Redis Module

- **Description**: Utilizes Redis container for caching data to improve application performance.

### Endpoints

#### Auth Controller

- **POST /auth/signup**
  - **Description**: Create a new user
  - **Request Body**: `CreateUserDto`
  - **Response**: `{ user: User, accessToken: string }`
  - **Status Codes**: 
    - 201: User successfully created.
    - 400: Bad request.

- **POST /auth/login**
  - **Description**: User login
  - **Request Body**: `LoginDto`
  - **Response**: `{ user: User, accessToken: string, refreshToken: string }`
  - **Status Codes**: 
    - 201: User logged in successfully.
    - 401: Unauthorized.

- **POST /auth/refresh**
  - **Description**: Refresh access token
  - **Request Body**: `refreshToken: string`
  - **Response**: `string`
  - **Status Codes**: 
    - 200: Access token refreshed successfully.
    - 401: Unauthorized.

#### Healthz Controller

- **GET /healthz**
  - **Description**: Check database health status
  - **Response**: `{ status: 'ok' }` or `{ status: 'error', message: 'error message' }`
  - **Status Codes**: 
    - 200: Database connection is healthy.
    - 500: Database connection error.

#### Movies Controller

- **GET /movies**
  - **Description**: Get all movies
  - **Query Parameters**: 
    - `page`: number (optional)
    - `limit`: number (optional)
  - **Response**: `{ data: Movie[], page?: number, limit?: number, total: number }`
  - **Status Codes**: 
    - 200: List of movies retrieved successfully.

- **POST /movies**
  - **Description**: Create a new movie
  - **Request Body**: `Movie`
  - **Response**: `Movie`
  - **Status Codes**: 
    - 201: The movie has been successfully created.
    - 400: Bad request.

- **DELETE /movies/:id**
  - **Description**: Delete a movie by ID
  - **Path Parameters**: 
    - `id`: number
  - **Status Codes**: 
    - 200: Movie deleted successfully.
    - 404: Movie not found.

- **GET /movies/search**
  - **Description**: Search movies by term
  - **Query Parameters**: 
    - `term`: string
  - **Response**: `{ data: Movie[] }`
  - **Status Codes**: 
    - 200: Movies matching search term.

- **GET /movies/filter**
  - **Description**: Filter movies
  - **Query Parameters**: 
    - `year`: number (optional)
    - `genre`: string (optional)
    - `country`: string (optional)
    - `color`: string (optional)
  - **Response**: `{ movies: Movie[] }`
  - **Status Codes**: 
    - 200: Filtered list of movies.

- **GET /movies/:id**
  - **Description**: Get a movie by ID
  - **Path Parameters**: 
    - `id`: number
  - **Response**: `Movie`
  - **Status Codes**: 
    - 200: Movie retrieved successfully.
    - 404: Movie not found.

- **PUT /movies/:id**
  - **Description**: Update a movie by ID
  - **Path Parameters**: 
    - `id`: number
  - **Request Body**: `Movie`
  - **Response**: `Movie`
  - **Status Codes**: 
    - 200: Movie updated successfully.
    - 404: Movie not found.

#### TypeORM Controller

- **POST /database/seed**
  - **Description**: Seed the database from a CSV file
  - **Status Codes**: 
    - 201: The database has been successfully seeded.
    - 500: Error occurred while seeding the database.

## Running Tests

You can run tests and generate coverage reports using the following commands:

```bash
npm run test
npm run test:watch
npm run test:cov

