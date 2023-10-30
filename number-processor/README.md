# number-processor

NodeJS Application that listen to a queue in the message bus, when it receives a message it validates if is a correct phone number and process it to later send it to another queue to be stored.

# Dependencies

## RabbitMQ
This application requires a rabbitmq instance to be running and configure in the same docker network "ninja_shared"

## Docker Network
In case the network does not exist, it is needed for the containers to be able to communicate between each other when they are not control by the same docker-compose.yaml

```bash
docker network create ninja_shared
```

# Run Application

First we need to build the container
```bash
docker-compose build
```

Then we can run the container (detached)
```bash
docker-compose up -d
```

This application is actively listening to q queue, so it is always running. To check the application logs

```bash
docker-compose logs --follow app
```

# To run test
```bash
docker-compose exec app npm test
```
