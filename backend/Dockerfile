# TODO: 补充Dockerfile
FROM python:3.8

ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code

# RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  wkhtmltopdf -y
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 -y
RUN apt-get install -y poppler-utils

RUN wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz && \
    tar vxf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz && \
    cp wkhtmltox/bin/wk* /usr/bin/

RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pip -U
ADD requirements.txt /code/
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt


# RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 -y


# RUN apt-get update && \
#     apt-get install -y xz-utils libxext6 fontconfig libxrender1 && \
#     curl "https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz" > wkhtmltox.tar.xz && \
#     tar --directory=/usr/local --strip 1 -xJf wkhtmltox.tar.xz && \
#     apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/debconf/*-old wkhtmltox.tar.xz


# RUN apt-get install --no-install-recommends -y \
#  apt-utils ghostscript fontforge cabextract \
#  wget

# RUN apt-get update \
#     && apt-get install -y \
#         curl \
#         libxrender1 \
#         libjpeg62-turbo \
#         fontconfig \
#         libxtst6 \
#         xfonts-75dpi \
#         xfonts-base \
#         xz-utils
# RUN curl "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb" -L -o "wkhtmltopdf.deb"

# RUN dpkg -i wkhtmltopdf.deb

# # set work directory
# WORKDIR /usr/src/app

# # set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1



# RUN apt-get update && apt-get install xfonts-75dpi && \ 
#     wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.jammy_amd64.deb && \
#     dpkg -i wkhtmltox_0.12.6.1-2.jammy_amd64.deb && \
#     apt --fix-broken install && \
#     rm wkhtmltox_0.12.6.1-2.jammy_amd64.deb 
COPY Fonts /usr/share/fonts/
ADD . /code/
