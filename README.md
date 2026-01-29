# Hiresphere — Full Stack Platform

Hiresphere is a comprehensive job portal platform designed to connect recruiters and candidates seamlessly. The platform features a robust backend powered by Spring Boot and a dynamic frontend built with React and TypeScript.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication for candidates and recruiters.
- **Job Listings**: Comprehensive job search and listing management.
- **Candidate Profiles**: Detailed profile management with resume upload capabilities.
- **Application Tracking**: Real-time status updates and application history.
- **Notifications**: In-app notifications for application milestones.
- **Secure File Storage**: Encrypted/Protected resume uploads.

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3
- **Language**: Java 17
- **Security**: Spring Security, JWT
- **Database**: PostgreSQL (JPA/Hibernate)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **API Client**: Axios

## 📦 Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js (v18+)
- PostgreSQL
- Maven

### Backend Configuration
1. Create a `.env` file in the root directory.
2. Add your database and JWT configurations:
   ```properties
   DB_URL=jdbc:postgresql://localhost:5432/hiresphere
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_key
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Configuration
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security Notes
- The project is configured with a robust `.gitignore` to prevent leakage of sensitive files.
- `application.properties`, `.env`, and `uploads/` are excluded from version control.
- Ensure you never commit your `JWT_SECRET` or database credentials.

## 📄 License
This project is for internal use within the Hiresphere Full Stack Platform.
