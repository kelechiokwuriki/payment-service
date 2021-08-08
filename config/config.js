module.exports = {
    paymentService: {
        url: 'http://localhost:5000'
    },
    messageQueue: {
        queue: 'transaction_created',
        url: 'amqp://localhost'
    }
}