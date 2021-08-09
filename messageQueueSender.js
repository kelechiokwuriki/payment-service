const { messageQueue } = require('./config/config.js');

var amqp = require('amqplib/callback_api');

exports.sendMessage = (message) => {
    amqp.connect(messageQueue.url, (firstError, connection) => {
        if (firstError) throw firstError;
    
        connection.createChannel((secondError, channel) => {
            if (secondError) throw secondError;
    
            channel.assertQueue(messageQueue.queue, {
                durable: false
            });

            channel.sendToQueue(messageQueue.queue, Buffer.from(message));
            console.log(`published----------------${message} ----------------`);
        });

        setTimeout(() => {
            connection.close();
        }, 500);
    })
}
