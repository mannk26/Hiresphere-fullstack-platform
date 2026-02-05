# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies to optimize caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source
COPY src ./src

# Copy frontend build output to Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

# Build the JAR
RUN mvn clean package -DskipTests

# Stage 3: Run
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
