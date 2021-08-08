const Payment = require('../models/payment.model.js');
const messageQueueSender = require('../../messageQueueSender.js');

exports.createPayment = async (req, res) => {
    // validate request
    if (!req.body.customerId || !req.body.order || !req.body.amount || !req.body.productId) {
        return res.status(400).send({
            success: false,
            message: 'Bad request. Customer id, order, amount or product id missing.'
        });
    }
    const {customerId, order, amount, productId} = req.body;
    const {status: orderStatus, _id: orderId} = order;

    const newPayment = new Payment({customerId, orderId, orderStatus, amount, productId});

    const paymentSaved = await newPayment.save();

    if (!paymentSaved) {
        // log to kibana
        console.error(`An error occured while creating the payment. 
        CustomerId: ${customerId}, ProductId: ${productId}, Amount: ${amount}, OrderStatus: ${orderStatus}, OrderId: ${orderId}`);

        return res.status(400).send({
            success: false,
            message: 'An error occured while creating the payment.'
        });
    }

    /**
     * This is needed else err
     * TypeError [ERR_INVALID_ARG_TYPE]: The first argument must be of type string or an instance of Buffer,
     *  ArrayBuffer, or Array or an Array-like Object. Received an instance of Object
     */
    const dataToSend = {customerId, orderId, productId, amount};
    const covnertedToArrayLikeObject = JSON.stringify(dataToSend);

    // pubish to RabbitMQ
    messageQueueSender.sendMessage(covnertedToArrayLikeObject);

    return res.status(201).send({
        success: true,
        message: 'Payment created successfully',
        data: paymentSaved
    }); 
};

