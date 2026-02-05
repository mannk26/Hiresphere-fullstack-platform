# 🌐 Hiresphere — Modern Full-Stack Job Portal

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Hiresphere is an industry-grade, full-stack recruitment platform designed to bridge the gap between top talent and leading recruiters. Built with a focus on real-time communication, secure data handling, and a seamless user experience.

---

## ✨ Key Features

### 👤 User Roles & Auth
- **Multi-Role Authentication**: Secure JWT-based login and registration for both **Candidates** and **Recruiters**.
- **Enhanced Security**: Stateless session management with Spring Security and custom JWT filters.
- **Audit Logging**: Automatic tracking of entity creation and modification timestamps.

### 💼 Job & Application Management
- **Advanced Search**: Filter jobs by title, location, category, and salary using dynamic JPA Specifications.
- **Application Lifecycle**: Track applications through various stages (Applied, Interviewing, Offered, etc.) with a full status history.
- **Resume Handling**: Secure file upload system for candidate resumes.

### 💬 Real-Time Collaboration
- **Instant Messaging**: Real-time chat system between recruiters and candidates powered by **WebSockets (STOMP/SockJS)**.
- **Live Notifications**: Instant in-app alerts for application updates and new messages.

### 🎨 Modern UI/UX
- **Responsive Design**: Fully responsive interface built with Tailwind CSS 4.
- **Smooth Animations**: Interactive elements enhanced by Framer Motion.
- **Type Safety**: End-to-end type safety with TypeScript and Zod-like validation patterns.

---

## 🛠️ Tech Stack

### Backend (Java Ecosystem)
- **Framework**: Spring Boot 3.4.1
- **Security**: Spring Security 6 (JWT)
- **Data**: Spring Data JPA, Hibernate, PostgreSQL/MySQL
- **Real-time**: Spring WebSocket, STOMP
- **Documentation**: SpringDoc OpenAPI (Swagger UI)
- **Utility**: Lombok, Apache Commons Lang3

### Frontend (Modern Web)
- **Library**: React 19 (Vite)
- **Styling**: Tailwind CSS 4, Lucide Icons
- **Animation**: Framer Motion
- **Networking**: Axios, SockJS, StompJS
- **Routing**: React Router 7

---

## 🚀 Getting Started

### Prerequisites
- **JDK 17+**
- **Node.js 18+**
- **PostgreSQL** (or MySQL)
- **Maven 3.x**

### Backend Setup
1. Clone the repository and navigate to the backend folder.
2. Configure your environment in `src/main/resources/application.properties` or create a `.env` file:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/hiresphere
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   app.jwt.secret=your_64_character_ultra_secure_secret_key
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Access API Docs: `http://localhost:8080/swagger-ui.html`

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
Hiresphere/
├── backend/
│   ├── src/main/java/com/jobportal/backend/
│   │   ├── config/         # Security, Web, WebSocket configs
│   │   ├── controller/     # REST Endpoints
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── model/          # JPA Entities
│   │   ├── repository/     # Data Access Layer
│   │   └── service/        # Business Logic
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # View components
│   │   ├── hooks/          # Custom React hooks
│   │   └── services/       # API integration layer
│   └── package.json
└── docker-compose.yml
```

---

## 🔒 Security Implementation
- **Password Hashing**: BCrypt encryption for user credentials.
- **CORS Configuration**: Restricted origins for cross-site requests.
- **File Validation**: Strict MIME-type checking for resume uploads.
- **Role-Based Access Control (RBAC)**: Fine-grained endpoint protection.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed with ❤️ as an industry-grade portfolio project.*
