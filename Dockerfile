# Use Node.js base image
FROM node:18

WORKDIR /app

# Create a script that logs and fails
RUN echo 'console.log("Starting application..."); \
console.log("Processing step 1..."); \
console.log("Processing step 2..."); \
console.log("Oh no! Something went wrong."); \
process.exit(1);' > index.js

# Run the app
CMD ["node", "index.js"]
