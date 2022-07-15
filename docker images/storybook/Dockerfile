# FROM node:16
FROM ubuntu

RUN mkdir /home/baseproject
RUN mkdir /home/project
COPY ./baseproject /home/baseproject
COPY ./start.sh /home
RUN apt-get update && apt upgrade -y
RUN apt-get install nodejs -y
RUN apt-get install npm -y

CMD ./home/start.sh