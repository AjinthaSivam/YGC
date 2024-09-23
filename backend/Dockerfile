# Final stage (combine both frontend and backend)
FROM python:3.12

WORKDIR /app

# Copy the backend files from the backend stage
COPY . /app/backend

# Create static directory if not exists
RUN mkdir -p /app/backend/static

# Install backend dependencies
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Expose ports for Django and react
EXPOSE 8001

# Run migrations, collectstatic for django, and start the django server
CMD bash -c "cd /app/backend && python manage.py collectstatic --noinput && python manage.py migrate && gunicorn --bind 0.0.0.0:8001 backend.wsgi"


