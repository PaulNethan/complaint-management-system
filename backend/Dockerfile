# 1. Base Image
FROM python:3.12-slim

# 2. Environment Configurations
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Create working directory
WORKDIR /app

# 4. Install system packages for PostgreSQL
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# 5. Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# 6. Copy Django project files
COPY . /app/

# 7. Document the port
EXPOSE 8000

# 8. Start Gunicorn Web Server
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]