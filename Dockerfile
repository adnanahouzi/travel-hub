# Multi-stage build for Travel Hub API
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom files for dependency caching
COPY pom.xml .
COPY connectors/pom.xml connectors/
COPY booking-api/pom.xml booking-api/

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY connectors connectors/
COPY booking-api booking-api/

# Build the application
RUN mvn clean package -DskipTests -pl booking-api -am

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy JAR from build stage
COPY --from=build /app/booking-api/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
