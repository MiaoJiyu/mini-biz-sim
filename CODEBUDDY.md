# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

## Common Commands

### Frontend Development
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Start dev server (http://localhost:5173)
npm run build                  # Build for production
npm run lint                   # Run ESLint
npm run type-check             # TypeScript type checking
```

### Backend Development
```bash
cd backend
mvn clean install             # Build all modules
mvn spring-boot:run           # Run specific service (from service directory)
mvn clean package -DskipTests # Build JAR files without tests
```

### Database Setup
```bash
# 方式一: 使用统一的初始化脚本 (推荐)
mysql -u root -p < database/init.sql

# 方式二: 按服务分别执行 (如果使用独立数据库)
mysql -u root -p < database/stock-service.sql
mysql -u root -p < database/real-estate-service.sql
mysql -u root -p < database/bank-service.sql
mysql -u root -p < database/mall-service.sql
mysql -u root -p < database/06_events.sql
```

### Testing
```bash
# Backend tests (from specific service directory)
mvn test

# Run single test
mvn test -Dtest=ClassName#methodName

# Frontend tests (not yet configured)
npm test
```

### Docker
```bash
docker-compose up -d          # Start all services
docker-compose logs -f gateway  # View service logs
docker-compose down            # Stop all services
```

## Architecture Overview

This is a microservices-based financial education platform with a React frontend and Spring Boot backend. The system simulates stock trading, real estate investment, banking services, mall consumption, and random events to teach financial literacy.

### Frontend Architecture
The frontend uses React 18 with TypeScript, built with Vite. It follows a component-based architecture with separate service layers for API calls. The UI uses Tailwind CSS and shadcn/ui components. State management is handled through React hooks and local storage. Real-time updates are implemented via WebSocket connections for stock quotes and event notifications.

Key patterns:
- Pages in `frontend/src/pages/` correspond to main application routes
- API services in `frontend/src/services/` encapsulate HTTP calls to backend
- Shared UI components in `frontend/src/components/ui/` are reusable
- Navigation uses React Router with protected route wrappers for authentication

### Backend Architecture
The backend is organized as independent Spring Boot microservices, each with its own database. Services communicate through an API Gateway (port 8080) which handles routing, authentication (JWT), and rate limiting. The common module provides shared utilities including logging, exception handling, and metrics.

**Services & Ports:**
- Gateway (8080): Routes requests, JWT auth validation, CORS, rate limiting
- User Service (8081): User management, authentication, roles, permissions
- Stock Service (8082): Stock data, trading, positions, real-time quotes
- Real Estate Service (8083): Properties, cities, leases, transactions
- Bank Service (8084): Accounts, loans, credit cards, financial products
- Event Service (8085): Event definitions, user events, scheduling, WebSocket
- Mall Service (8086): Products, shopping cart, orders, VIP system

**Key Backend Patterns:**
- Each service follows Entity-Repository-Service-Controller layered architecture
- JPA entities in `entity/` packages map directly to database tables
- Spring Data JPA repositories in `repository/` handle data access
- Business logic in `service/` classes
- REST endpoints in `controller/` expose APIs
- Event scheduling uses Spring's `@Scheduled` annotations
- WebSocket endpoints enable real-time push notifications

**Database Design:**
Each microservice has its own MySQL database:
- `financelab_users`: Users, roles, permissions, classes
- `financelab_stocks`: Stocks, quotes, transactions, positions
- `financelab_realestate`: Cities, properties, user properties, leases
- `financelab_bank`: Accounts, credit cards, loans, financial products
- `financelab_mall`: Products, shopping carts, orders, order items
- `financelab_events`: Event definitions, user events, event choices

Database scripts in `database/` folder should be executed in order (01_users.sql through 06_events.sql).

### Cross-Cutting Concerns
**Authentication**: JWT tokens issued by User Service, validated at Gateway. Token includes user ID and role in claims.

**Exception Handling**: Common module provides `GlobalExceptionHandler` with `@RestControllerAdvice` for unified error responses. Uses custom `BusinessException` and `ResourceNotFoundException`.

**Logging**: `RequestLoggingFilter` in common module logs all HTTP requests. `MetricsAspect` uses AOP to log API response times and detect slow endpoints (>1s warning).

**Rate Limiting**: Gateway's `RateLimitFilter` implements in-memory rate limiting per client/user with configurable windows.

**CORS**: Configured at Gateway level to allow frontend-origin requests across all services.

### Service Startup Order
Services can start independently, but database must be running first. For development, start services in any order - they will become available as they come online. Gateway depends on all other services being reachable.

### Important Configuration Notes
- Database connections configured in each service's `application.yml`
- JWT secret key must be consistent across User Service (generation) and Gateway (validation)
- WebSocket connections for events use `/ws/events` endpoint on Event Service
- Frontend API calls go through Gateway at `http://localhost:8080/api/*`
- In production, change database credentials from default root/password to secure credentials
