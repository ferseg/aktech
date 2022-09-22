database-up:
	docker run --name boilerplate-mysql -e MYSQL_ROOT_PASSWORD=root-mysql -e MYSQL_USER=mysql -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=boilerplate -d -p 3306:3306 mysql:8.0

database-down:
	docker stop boilerplate-mysql

database-migrate:
	docker run --rm -v $(CURDIR)/database/flyway_config/localhost:/flyway/conf -v $(CURDIR)/database/src/main/resources/migrations/boilerplate:/flyway/sql flyway/flyway migrate

database-remove:
	docker rm boilerplate-mysql

database-connect:
	docker run -it --rm mysql mysql -hhost.docker.internal -umysql -pmysql
