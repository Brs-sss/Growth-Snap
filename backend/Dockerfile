# TODO: 补充Dockerfile
FROM python:3.8

ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pip -U
ADD requirements.txt /code/
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  wkhtmltopdf -y
ADD . /code/
