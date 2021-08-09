# payment-service
Handles billing for the e-commerce micro-service. Publishes transaction to RabbitMQ 

# Docker
This application is containerized using Docker.
Ensure you have docker desktop installed and running.

# NOTE
Ensure the port number in "server.js" is unused.


Navigate to the project directory on your terminal. Run the following commands.

1. docker network create e-commerce-app 
2. docker run -it --network=e-commerce-app --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq
3. docker-compose build && docker-compose up -d
