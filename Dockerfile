# Use an official base image
FROM alpine:3.18

# Show some logs during build
RUN echo "Starting build process..." && \
    echo "Step 1: Installing dependencies" && \
    sleep 1 && \
    echo "Step 2: Doing some work" && \
    sleep 1 && \
    echo "Step 3: Simulating failure" && \
    exit 1
