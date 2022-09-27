cd /usr/lib/postgresql/14/bin

# create the odoo superuser
su postgres
service postgresql start 
./createuser -s -i -d -r -l -w odoo 
./psql -c "ALTER ROLE odoo WITH PASSWORD 'odoopwd';" 
exit

cd /home

bash
