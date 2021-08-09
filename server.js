const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
var amqp = require('amqplib/callback_api');
const { messageQueue } = require('./config/config.js');
const Payment = require('./app/models/payment.model.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

/**
 *  Consume messages from transaction_created queue
 */
amqp.connect(messageQueue.url, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(messageQueue.queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", messageQueue.queue);

        channel.consume(messageQueue.queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());

            const convertMessageFromString = JSON.parse(msg.content.toString());
            /**
             *  HANDLE THIS WITH A SERVICE TO MAKE CODE NEATER *****************
             */
            const newPayment = new Payment(convertMessageFromString);
            newPayment.save().then(result => {
                console.log('payment saved', result);
            }).catch(error => {
                console.log('payment saving error', error);

            });
        }, {
            noAck: true
        });
    });
});

require('./app/routes/payment.routes.js')(app);

app.listen(5000, () => {
    console.log('Payment API running on port 5000');
})

