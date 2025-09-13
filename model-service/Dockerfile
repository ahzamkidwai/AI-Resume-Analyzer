# ---------- Runtime Stage ----------
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages from builder stage
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Hugging Face provides $PORT automatically
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
