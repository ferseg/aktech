FROM ubuntu

RUN mkdir /home/setup
WORKDIR /home/setup

RUN 
RUN apt update -y && \
    apt-get update -y && \
    apt install software-properties-common -y && \
    add-apt-repository ppa:deadsnakes/ppa -y && \
    apt-get update && DEBIAN_FRONTEND="noninteractive" TZ="America/Managua" apt-get install -y tzdata && \
    apt install python3.8 -y && \
    apt install git -y

RUN apt install nodejs -y

RUN apt-get install postgresql postgresql-contrib -y 

#RUN apt install build-essential libssl-dev libffi-dev libgmp3-dev virtualenv python-pip libpq-dev python-dev -y
RUN apt install build-essential libssl-dev libffi-dev libgmp3-dev virtualenv python3-pip libpq-dev python-dev-is-python3 -y


RUN apt-get install gdebi -y && \
    apt-get install wget  && \
    wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.jammy_amd64.deb  && \
    gdebi wkhtmltox_0.12.6.1-2.jammy_amd64.deb


RUN curl -fsSL https://www.pgadmin.org/static/packages_pgadmin_org.pub | gpg --dearmor -o /etc/apt/trusted.gpg.d/pgadmin.gpg && \
    sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list'  && \
    apt update  && \
    apt install pgadmin4 -y  && \
    apt install ufw -y && \
    ufw allow http && \
    ufw allow https

RUN mkdir /home/setup/odoo
WORKDIR /home/setup/odoo

RUN git config --global url."https://api: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@github.com/".insteadOf "https://github.com/"
RUN git config --global url."https://ssh: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@github.com/".insteadOf "ssh://git@github.com/"
RUN git config --global url."https://git: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@github.com/".insteadOf "git@github.com:"
RUN git clone --branch 14.0 --depth 1 https://github.com/akurey/AK-Odoo.git 
RUN chmod +x AK-Odoo/Utilities/install_odoo.sh


#RUN ./AK-Odoo/Utilities/install_odoo.sh



#RUN systemctl status apache2
#/usr/pgadmin4/bin/setup-web.sh


# nano lib/python2.7/site-packages/pgadmin4/config_local.py
# import os
#DATA_DIR = os.path.realpath(os.path.expanduser(u'~/.pgadmin/'))
#LOG_FILE = os.path.join(DATA_DIR, 'pgadmin4.log')
#SQLITE_PATH = os.path.join(DATA_DIR, 'pgadmin4.db')
#SESSION_DB_PATH = os.path.join(DATA_DIR, 'sessions')
#STORAGE_DIR = os.path.join(DATA_DIR, 'storage')
#SERVER_MODE = False

# systemctl start postgresql.service

#python lib/python2.7/site-packages/pgadmin4/pgAdmin4.py

#si da errores de flask
#pip install flask-htmlmin
#python lib/python2.7/site-packages/pgadmin4/pgAdmin4.py