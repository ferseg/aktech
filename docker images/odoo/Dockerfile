FROM ubuntu

RUN mkdir /home/setup
WORKDIR /home/setup

RUN apt-get update -y && \
    apt-get install git -y

RUN apt-get install software-properties-common -y
RUN add-apt-repository ppa:deadsnakes/ppa -y

#RUN apt-get install python3.8 
RUN apt-get install nodejs -y

RUN apt-get install wget && \
   wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.bionic_i386.deb 
  #  dpkg -i wkhtmltox_0.12.6-1.bionic_i386.deb

RUN apt-get install postgresql postgresql-contrib -y && \
    apt-get install build-essential libssl-dev libffi-dev libgmp3-dev virtualenv python-pip libpq-dev python-dev -y

#$ mkdir pgAdmin4
#$ cd pgAdmin4
#$ virtualenv pgAdmin4
#$ cd pgAdmin4
#$ source bin/activate

# nano lib/python2.7/site-packages/pgadmin4/config_local.py
# systemctl start postgresql.service