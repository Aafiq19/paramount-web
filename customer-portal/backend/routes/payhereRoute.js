import express from 'express';
import { Order } from '../models/orderModel.js';

const router = express.Router();

// PayHere payment notification
// PayHere calls this URL after payment is completed
router.post('/notify', async (req, res) => {
  try {
    const { order_id, status_code, payment_id } = req.body;

    // status_code 2 = success
    if (status_code === '2') {
      await Order.findByIdAndUpdate(order_id, {
        status: 'Approved',
      });
      console.log(`Order ${order_id} payment confirmed: ${payment_id}`);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;