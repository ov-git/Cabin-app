# Build stage
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /build

COPY "pom.xml" .

# Download dependencies (cached unless pom changes)
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

#  Runtime stage
FROM eclipse-temurin:25-jdk-jammy

WORKDIR /app

# Create non-root user
RUN useradd -m appuser

COPY --from=build /build/target/*.jar app.jar

RUN chown appuser:appuser app.jar
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]