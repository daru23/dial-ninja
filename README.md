# dial-ninja
Microservices system in charge of generate, process and store phone numbers.

# Run project

```bash
docker-compose up -d
```

To generate a random number and see the messages flowing

```bash
docker-compose exec number_generator npm start
```

To log a service, replace {service_name} with the app you want to log e.g. `db_client`

```bash
docker-compose logs --follow {service_name}
```

# To run tests

Example:
```bash
docker-compose exec number-processor npm run test
```

# Extra
Additionally every application can be run independently, they have their own `docker-compose.yaml` files but they depend of the msg-bus app to be running to be able to connect to the same message bus to pass messages along each other.

# TODO

- Fix unit tests of db-client (currently broken)
- Add more and useful tests to the applications
- ~~Add support for more country codes (currently only NL is being found)~~
- Fix number-generator script to have a graceful exit. At the moment it keeps hanging.
- Improve error handler in the application. Currently, if rabbitmq is not up and running the application crash.
- Create separate files for types.
