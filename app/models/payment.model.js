const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({
    customerId: String,
    productId: String,
    orderId: String,
    orderStatus: String,
    amount: Number
}, {
    timeStamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);