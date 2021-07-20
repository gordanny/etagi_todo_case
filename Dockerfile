# pull official base image
FROM python:3.9.6-alpine3.14

# set work directory
WORKDIR /usr/src/etagi

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY ./etagi .
COPY ./todo .
COPY ./manage.py .
COPY ./requirements.txt .