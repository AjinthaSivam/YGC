# Base image for backend (Python/Django)
FROM python:latest AS backend

# Backend environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /backend

# Copy backend dependencies and install them
COPY backend/requirements.txt /backend/
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ /backend/

# Base image for frontend
FROM node:alpine AS frontend

WORKDIR /frontend

# Copy frontend dependencies and install them
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

# Copy frontend source code
COPY frontend/ /frontend/

# Build frontend production files
RUN npm run build

# Expose port for frontend
EXPOSE 5173

# Start the frontend server
CMD ["npm", "run", "dev"]

# Final stage (combine both frontend and backend)
FROM python:latest

WORKDIR /app

# Copy the backend files from the backend stage
COPY --from=backend /backend /app/backend

# Create static directory if not exists
RUN mkdir -p /app/backend/static

# Copy the built frontend files to the backend's static directory
COPY --from=frontend /frontend/dist /app/backend/static/

# Install backend dependencies
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Expose ports for Django and react
EXPOSE 8001

# Run migrations, collectstatic for django, and start the django server
CMD bash -c "cd /app/backend && python manage.py collectstatic --noinput && python manage.py migrate && python manage.py runserver 0.0.0.0:8001"


