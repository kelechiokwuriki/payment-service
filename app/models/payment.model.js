const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({
    customerId: String,
    productId: String,
    orderId: String,
    amount: Number
}, {
    timeStamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);