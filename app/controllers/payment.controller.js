const Payment = require('../models/payment.model.js');
const messageQueueSender = require('../../messageQueueSender.js');

exports.createPayment = async (req, res) => {

    // validate request
    if (!req.body.customerId || !req.body.orderId || !req.body.amount || !req.body.productId) {
        return res.status(400).send({
            success: false,
            message: 'Bad request. Customer id, order, amount or product id missing.'
        });
    }

    const {customerId, orderId, amount, productId} = req.body;

    // const newPayment = new Payment({customerId, orderId, orderStatus, amount, productId});

    // const paymentSaved = await newPayment.save();

    // if (!paymentSaved) {
    //     // log to kibana
    //     console.error(`An error occured while creating the payment. 
    //     CustomerId: ${customerId}, ProductId: ${productId}, Amount: ${amount}, OrderStatus: ${orderStatus}, OrderId: ${orderId}`);

    //     return res.status(400).send({
    //         success: false,
    //         message: 'An error occured while creating the payment.'
    //     });
    // }

    const dataToSend = JSON.stringify({customerId, orderId, productId, amount});

    // // pubish to RabbitMQ
    messageQueueSender.sendMessage(dataToSend);

    return res.status(201).send({
        success: true,
        message: 'Payment published successfully',
    }); 
};

