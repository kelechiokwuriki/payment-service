const { messageQueue } = require('./config/config.js');

var amqp = require('amqplib/callback_api');

exports.sendMessage = (message) => {


    // var open = require('amqplib').connect('amqp://localhost');

    // // Publisher
    // open.then(function(conn) {
    //   return conn.createChannel();
    // }).then(function(ch) {
    //   return ch.assertQueue(q).then(function(ok) {
    //     return ch.sendToQueue(q, Buffer.from(message));
    //   });
    // }).catch(console.warn);

    amqp.connect(messageQueue.url, (firstError, connection) => {
        if (firstError) throw firstError;
    
        connection.createChannel((secondError, channel) => {
            if (secondError) throw secondError;
    
            channel.assertQueue(messageQueue.queue, {
                durable: false
            });

            channel.sendToQueue(messageQueue.queue, Buffer.from(message));
            console.log(`${message} sent----------------`);
        });

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    })

}

