FROM python:3.11-alpine

COPY ./requirements.txt /application/

COPY ./app /application/

WORKDIR /application

RUN pip install --no-cache-dir -r /application/requirements.txt

CMD [ "uvicorn","app.api.main:app","--host","0.0.0.0", "--port", "80"]