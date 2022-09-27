FROM ubuntu

RUN mkdir /home/setup
WORKDIR /home/setup

RUN apt update -y && \
    apt-get update -y && \
    apt install software-properties-common -y && \
    add-apt-repository ppa:deadsnakes/ppa -y && \
    apt install git -y

RUN apt install nodejs -y

RUN apt-get install gdebi -y && \
    apt-get install wget  && \
    wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.jammy_amd64.deb  && \
    gdebi wkhtmltox_0.12.6.1-2.jammy_amd64.deb

#install pgadmin, this IDE utility might help while providing maintenance to the odoo database
RUN curl -fsSL https://www.pgadmin.org/static/packages_pgadmin_org.pub | gpg --dearmor -o /etc/apt/trusted.gpg.d/pgadmin.gpg && \
    sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list'  && \
    apt update  && \
    apt install pgadmin4 -y  && \
    apt install ufw -y && \
    ufw allow http && \
    ufw allow https

RUN apt autoremove python3 -y && \
    apt remove python3-pip -y && \
    apt-get update && DEBIAN_FRONTEND="noninteractive" TZ="America/Managua" apt-get install -y tzdata && \
    apt install python3.8 python3.8-dev python3.8-distutils -y

RUN apt install curl -y && \
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python3.8 get-pip.py && \
    python3.8 -m pip install --upgrade pip && \
    apt install build-essential -y && \
    apt install -y python2-dev libldap2-dev libsasl2-dev libssl-dev && \
    pip uninstall setuptools -y && \
    pip install "setuptools<58.0.0" 

# data_dir is the folder where all odoo versions will store settings and share files
# have a folder for each version of odoo in the system is recommended for compatibility, versions and migrations
RUN mkdir /home/setup/odoo && \
    mkdir /home/setup/odoo/odoo14 && \
    mkdir /home/setup/odoo/data_dir 

WORKDIR /home/setup/odoo/odoo14

## this credential needs to be updated time to time, you can generate your own token as soon you get access to the github repo
RUN git config --global url."https://api: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@github.com/".insteadOf "https://github.com/"
RUN git config --global url."https://ssh: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@github.com/".insteadOf "ssh://git@github.com/"
RUN git config --global url."https://git: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@github.com/".insteadOf "git@github.com:"
RUN git clone --branch 14.0 --depth 1 https://github.com/akurey/AK-Odoo.git 
RUN chmod +x AK-Odoo/Utilities/install_odoo.sh

COPY requirements.txt /home/setup
COPY install_odoo.sh odooserver:/home/setup/odoo/odoo14/AK-Odoo/Utilities/

#RUN ./AK-Odoo/Utilities/install_odoo.sh
#RUN apt-get install postgresql postgresql-contrib -y 

COPY init.sh /home/setup

WORKDIR /home/setup

#CMD ./init.sh


# ver en el lunch.json lo que se hace para levnatar el ambiente
# en el conf file esta el puerto

#python3.8 odoo-bin -c ../AK-Odoo/Utilities/odoo.conf
#8070
#8072
#5432 

#docker run -it --rm --name odooserver -p 8070:8070 -p 8072:8072 -p 5432:5432 odoo 

#-v vol_cfgplaya:/data/configdb 
  