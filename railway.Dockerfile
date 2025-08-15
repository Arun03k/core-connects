FROM python:3.9-slim

WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copy backend code
COPY backend/ .

EXPOSE 5000

CMD ["python", "app.py"]
