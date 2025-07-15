# Use official Node.js base image
FROM node:18

# Install Python 3, pip, and venv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv

# Create app directory
WORKDIR /app

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your project
COPY . .

# Create Python virtual environment and install dependencies
RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install -r octra_pre_client/requirements.txt

# Expose port
EXPOSE 3000

# Start server with correct Python path
ENV PYTHON=/app/venv/bin/python3
ENV CLIPATH=octra_pre_client/cli.py

CMD ["node", "server.js"]
