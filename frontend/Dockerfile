ARG BUILD_ARG
FROM node:24 AS install
ARG BUILD_ARG
WORKDIR /frontend
COPY package.json package-lock.json .
RUN npm install

FROM node:24 AS build
ARG BUILD_ARG
WORKDIR /frontend
COPY --from=install /frontend /frontend
COPY . .
RUN npm run ${BUILD_ARG}

FROM nginx:alpine
RUN sed -i'' -re "/location \/ \{/a\try_files \$uri \$uri/ /index.html;" /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/dist/ /usr/share/nginx/html