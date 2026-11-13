# StockPilot — Local Development & Setup Guide

This guide details the exact instructions and Windows CMD commands for bootstrapping StockPilot on a local developer workstation.

---

## 1. Prerequisites Verification

Verify the required developer tooling:

```cmd
:: 1. Verify Java 21 LTS
java -version

:: 2. Verify Apache Maven 3.9+
mvn -v

:: 3. Verify Node.js (v20+ recommended) & npm
node -v
npm -v

:: 4. Verify Docker & Docker Compose
docker --version
docker compose version
```

---

## 2. Infrastructure Startup (PostgreSQL, Redis, Kafka)

StockPilot provides a multi-container Docker Compose configuration:

```cmd
:: From the root directory: F:\Java_projects\STOCKPILOT
:: Copy environment configuration
copy .env.example .env

:: Spin up background infrastructure services (PostgreSQL 16, Redis 7)
docker compose up -d postgres redis
```

> **Note on Port Configuration**:
> To avoid conflicting with any pre-existing local Windows services (such as a native Windows PostgreSQL service running on port 5432 or other Redis instances on 6379), StockPilot defaults to:
> - **PostgreSQL**: Port `5435`
> - **Redis**: Port `6380`
> - **Kafka**: Port `9092`
>
> All ports are fully configurable in `.env`.

To verify running containers:
```cmd
docker ps
```

---

## 3. Backend Service Execution

```cmd
:: Navigate into the backend directory
cd F:\Java_projects\STOCKPILOT\backend

:: Run all backend unit and database integration tests
mvn test

:: Build the executable production JAR
mvn clean package -DskipTests

:: Launch the Spring Boot application
java -jar target\stockpilot-backend-1.0.0-SNAPSHOT.jar
```

Alternatively, launch using the Spring Boot Maven plugin:
```cmd
mvn spring-boot:run
```

Once running:
- **API Health Check**: `http://localhost:8080/api/v1/health`
- **Swagger / OpenAPI Documentation**: `http://localhost:8080/swagger-ui.html`
- **Spring Boot Actuator**: `http://localhost:8080/actuator/health`

---

## 4. Frontend Application Execution

```cmd
:: Navigate into the frontend directory
cd F:\Java_projects\STOCKPILOT\frontend

:: Install dependencies (first time only)
npm install

:: Launch the Vite development server
npm run dev
```

Once running:
- **Web Application**: `http://localhost:5173`
- The application shell includes a live backend vitality telemetry pill in the header, demonstrating immediate end-to-end integration with the Spring Boot `/api/v1/health` endpoint.

To verify TypeScript types and generate a production build:
```cmd
npm run build
```

