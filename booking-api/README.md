# Travel Hub Booking API

## OpenAPI/Swagger Documentation

After starting the application, you can access the interactive API documentation at:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## Running the Application

To start the booking API:

```bash
cd booking-api
mvn spring-boot:run
```

Or from the project root:

```bash
mvn spring-boot:run -pl booking-api
```

## Available Endpoints

### Search Hotel Rates
- **POST** `/api/v1/search/rates`
- Search for available hotel rates based on location, dates, and guest requirements

## Configuration

Update the `application.yaml` file with your LiteAPI credentials:

```yaml
travelhub:
  connectors:
    nuitee:
      base-url: https://api.liteapi.travel/v3.0
      api-key: your-api-key
      booking-base-url: https://book.liteapi.travel/v3.0
```

