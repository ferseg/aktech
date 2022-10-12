database-create:
	docker run --name boilerplate-mysql -e MYSQL_ROOT_PASSWORD=root-mysql -e MYSQL_USER=mysql -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=boilerplate -d -p 3306:3306 mysql:8.0

database-start:
	docker start boilerplate-mysql

database-stop:
	docker stop boilerplate-mysql

database-remove:
	docker rm boilerplate-mysql

database-migrate:
	docker run --rm -v $(CURDIR)/database/flyway_config/localhost:/flyway/conf -v $(CURDIR)/database/src/main/resources/migrations/boilerplate:/flyway/sql flyway/flyway migrate

database-repair:
	docker run --rm -v $(CURDIR)/database/flyway_config/localhost:/flyway/conf -v $(CURDIR)/database/src/main/resources/migrations/boilerplate:/flyway/sql flyway/flyway repair

database-clean:
	docker run --rm -v $(CURDIR)/database/flyway_config/localhost:/flyway/conf -v $(CURDIR)/database/src/main/resources/migrations/boilerplate:/flyway/sql flyway/flyway clean

database-connect:
	docker run -it --rm mysql mysql -hhost.docker.internal -umysql -pmysql
