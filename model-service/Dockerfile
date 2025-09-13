# ---------- Builder Stage ----------
FROM python:3.12-slim AS builder

WORKDIR /app

# Install system dependencies required for building wheels
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into a temp directory
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt


# ---------- Runtime Stage ----------
FROM python:3.12-slim

WORKDIR /app

# Copy only installed packages from builder stage
COPY --from=builder /root/.local /root/.local

# Ensure installed packages are in PATH
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY . .

# Run FastAPI with uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
