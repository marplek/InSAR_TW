# Stage 1 - the build process
# Use a Node.js base image
FROM node:21-alpine3.18 as build-deps

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy your project files into the Docker image
COPY . .
RUN npm i && npm run build


# Stage 2 - the production environment
FROM nginx:1.19.0-alpine
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]