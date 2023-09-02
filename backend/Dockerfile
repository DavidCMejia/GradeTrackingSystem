FROM python:3.10

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y apturl || true

COPY . /app/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
