module.exports = (app) => {
    const paymentController = require('../controllers/payment.controller.js');
    
    // place an order
    app.post('/payment', paymentController.createPayment);
}