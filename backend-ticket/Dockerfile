FROM alpine/java:21-jdk AS build

WORKDIR /backend
COPY . /backend

RUN chmod +x ./gradlew

RUN ./gradlew clean
RUN ./gradlew classes
RUN ./gradlew bootJar

FROM eclipse-temurin:21-jre-alpine AS deploy
ENV SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE}
WORKDIR /app
COPY --from=build /backend/build/libs/smu8ticket-backend.jar /app
CMD ["java", "-jar", "smu8ticket-backend.jar", "--spring.profiles.active=${SPRING_PROFILES_ACTIVE}"]