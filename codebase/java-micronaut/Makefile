database-up:
	docker run --name boilerplate-mysql -e MYSQL_ROOT_PASSWORD=root-mysql -e MYSQL_USER=mysql -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=boilerplate -d -p 3306:3306 --net=local_network mysql:8.0

database-down:
	docker stop boilerplate-mysql

database-migrate:
	docker run --rm -v $(CURDIR)/database/flyway_config/localhost:/flyway/conf -v $(CURDIR)/database/src/main/resources/migrations/boilerplate:/flyway/sql --net=local_network flyway/flyway migrate

database-remove:
	docker rm boilerplate-mysql

database-connect:
	docker run -it --network local_network --rm mysql mysql -hboilerplate-mysql -umysql -pmysql
