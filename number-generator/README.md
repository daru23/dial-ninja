# number-generator

NodeJS Application that generates a random number and send it to a message bus to be later processed 

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

Now you can call the script to execute the number generator and send the message to the queue
```bash
docker-compose exec app npm start
```

# To run test
```bash
docker-compose exec app npm test
```
