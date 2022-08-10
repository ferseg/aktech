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

In the [application.yaml](src/auth/src/main/resources/application.yml) file in the `auth` microservice, you need to set the following environment variables:
```
ACCESS_TOKEN_SECRET: ask the team for the secret
REFRESH_TOKEN_SECRET: ask the team for the secret
DATABASE_USER: mysql
DATABASE_PASSWORD: mysql
```

You can use the following command (on Mac) to add them:
i.e: for the DATABASE_USER would be:
```
export DATABASE_USER=mysql
```
