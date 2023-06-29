FROM python:3.10-alpine

WORKDIR /usr/src/application

COPY requirements.txt ./

RUN RUN apk add --no-cache build-base

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . .

CMD [ "uvicorn", "app.api.main:app", "--host", "0.0.0.0", "--port", "8000"]

