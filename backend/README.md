# Backend – Women's Safety Smart App

Spring Boot 3.2 REST API with Twilio SMS integration and H2 in-memory database.

## Run

```bash
mvn clean install -DskipTests
mvn spring-boot:run
```

Server starts on **http://localhost:8080**

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/alerts | Create SOS alert |
| GET | /api/alerts | List all alerts (paginated) |
| GET | /api/alerts/recent | Last 10 alerts |
| DELETE | /api/alerts/{id} | Delete alert |
| DELETE | /api/alerts | Clear all |
| GET | /dashboard | Live HTML dashboard |
| GET | /h2-console | H2 database browser |

## Configuration

Edit `src/main/resources/application.properties` to add real Twilio credentials.

## Tech

- Spring Boot 3.2 + embedded Tomcat
- Spring Data JPA + H2 (in-memory)
- Twilio SDK 9.14
- Thymeleaf templates
