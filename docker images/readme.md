# [storybook](https://github.com/akurey/aktech/tree/master/docker%20images/storybook)
Storybook is an open source tool for building UI components and pages in isolation. It streamlines UI development, testing, and documentation. Save use cases as stories in plain JavaScript to revisit during development, testing, and QA.
"Storybook is a powerful frontend workshop environment tool that allows teams to design, build, and organize UI components (and even full screens!) without getting tripped up over business logic and plumbing" -- Brad Frost, author of atomic design

# [odoo](https://github.com/akurey/aktech/tree/master/docker%20images/odoo) 

to build this image in your computer
- install docker desktop
- pull this folder into any folder desire to stored docker images
- run:  
```
docker build . -t odoo
```

to run one odoo server container use the following command. In order to have the source code and the database persistent in your host computer, provide your local folders for code and postgre data directory. 

```
docker run -it --rm --name odooserver -v <your odoo code repository folder>:/home/setup/odoo/odoo14/ -v pg_data:/home/setup/pg_data  -p 8070:8070 -p 8072:8072 -p 5432:5432 odoo 
```

for example
```
docker run -it --rm --name odooserver -v /home/user/dev/odoo:/home/setup/odoo/odoo14/ -v pg_data:/home/setup/pg_data -p 8070:8070 -p 8072:8072 -p 5432:5432 odoo 
```

to perform linux level odoo maintenance run
```
docker run -it --rm --name odooserver -v <your odoo code repository folder>:/home/setup/odoo/odoo14/ -v pg_data:/home/setup/pg_data -p 8070:8070 -p 8072:8072 -p 5432:5432 odoo
```

