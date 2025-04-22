FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create directories for static files if they don't exist
RUN mkdir -p static/images static/css static/js

EXPOSE 80

# Use Flask's development server for development
CMD ["python", "app.py"] 