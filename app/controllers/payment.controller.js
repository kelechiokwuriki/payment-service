const Payment = require('../models/payment.model.js');

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

    // pubish to RabbitMQ

    return res.status(201).send({
        success: true,
        message: 'Payment created successfully',
        data: paymentSaved
    }); 
};

