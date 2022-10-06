# Base backend code using Java and Micronaut

## Dependencies for local development:

### Make: 
https://formulae.brew.sh/formula/make

```
brew install make
```

### Docker CLI:
https://formulae.brew.sh/formula/docker

```
brew install docker
```

### Setup the environment variables:

You need to set the following environment variables that are used by the different services:
```
ACCESS_TOKEN_SECRET: {you can add whatever token you want for local development}
REFRESH_TOKEN_SECRET: {you can add whatever token you want for local development}
DATABASE_USER: mysql
DATABASE_PASSWORD: mysql
DATABASE_ENDPOINT: localhost
DATABASE_NAME: boilerplate
```

You can use the following command (on Mac) to add them:
i.e: for the DATABASE_USER would be:
```
export DATABASE_USER=mysql
```

### Database initialization

Create the docker container database instance
```
make database-create
```

Then create the schemas, tables, SPs and filling queries
```
make database-migrate
```

Now, you can connect to the database
```
make database-connect
```

If you need to stop the instance
```
make database-stop
```

If you need to start the instance
```
make database-start
```

If for some reason, you need to delete your database instance, run the following
```
make database-stop
make database-remove
```
**Important note:** Take into account that all the data stored will be deleted.

You can find all these definitions in the [Makefile](./Makefile).

### Running the project

To run the project, just go to the folder of the service and run
```
./gradlew clean run
```

If you need to run the project in a specific port (To run multiple services at the same time for example), run
```
MICRONAUT_SERVER_PORT=8081 ./gradlew clean run
```
