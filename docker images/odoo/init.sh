cd /home/setup/odoo/odoo14/

DIR="/home/setup/odoo/odoo14/"

# check if this is an empty folder or not
if [ "$(ls -A $DIR)" ]; then
    echo "code folder is NOT empty, odoo is already here, listen on ports 8070, 8072, 5432"
    su postgres service postgresql start 
else
    echo "code folder empty, cloning repositories from github"

    ## this credential needs to be updated time to time, you can generate your own token as soon you get access to the github repo
    git config --global url."https://api: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@github.com/".insteadOf "https://github.com/"
    git config --global url."https://ssh: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@github.com/".insteadOf "ssh://git@github.com/"
    git config --global url."https://git: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@github.com/".insteadOf "git@github.com:"
    git clone --branch 14.0 --depth 1 https://github.com/akurey/AK-Odoo.git 

    cp /home/setup/install_odoo.sh /home/setup/odoo/odoo14/AK-Odoo/Utilities/
    RUN chmod +x AK-Odoo/Utilities/install_odoo.sh

    ./AK-Odoo/Utilities/install_odoo.sh

    cd /home/setup/odoo/odoo14/
    cp -R AK-Odoo/Utilities/vscode odoo/.vscode .
    cp AK-Odoo/Utilities/odoo14.code-workspace .

    mv /var/lib/postgresql/14/main /home/setup/pg_data
    chown -R postgres /home/setup/pg_data
    chmod 700 /home/setup/pg_data
    ln -s /home/setup/pg_data/main /var/lib/postgresql/14/main
    su postgres service postgresql start 
    su postgres -c '/usr/lib/postgresql/14/bin/createuser -s -i -d -r -l -w odoo'
    su postgres -c '/usr/lib/postgresql/14/bin/psql -f /home/setup/psql.sql'
fi

cd /home/setup/odoo/odoo14/odoo
python3.8 odoo-bin -c ../AK-Odoo/Utilities/odoo.conf
