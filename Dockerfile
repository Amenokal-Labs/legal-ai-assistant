FROM python:3.9.7

WORKDIR /usr/src/application

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

RUN python -m spacy download en_core_web_lg

COPY . .

CMD [ "uvicorn","app.api.main:app","--host","0.0.0.0"]
