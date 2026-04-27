import express from 'express';
import { Order } from '../models/orderModel.js';
import { Customer } from '../models/customerModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// Place a new order + auto-add customer + reduce stock + sync to admin orders
router.post('/', async (req, res) => {
  try {
    const { customer_id, customer_name, customer_email, items, notes, phone, address } = req.body;

    if (!customer_id || !items || items.length === 0)
      return res.status(400).send({ message: 'customer_id and items are required' });

    const processedItems = items.map(item => ({
      product_name: item.product_name,
      quantity:     Number(item.quantity),
      unit_price:   Number(item.unit_price),
      subtotal:     Number(item.quantity) * Number(item.unit_price),
    }));

    const total_amount = processedItems.reduce((sum, i) => sum + i.subtotal, 0);

    // 1 — Create order in customer_orders collection
    const order = await Order.create({
      customer_id,
      customer_name,
      customer_email,
      items: processedItems,
      total_amount,
      notes: notes || '',
    });

    // 2 — Auto-add/update customer in shared customers collection
    try {
      const existingCustomer = await Customer.findOne({ email: customer_email });
      if (!existingCustomer) {
        await Customer.create({
          name:    customer_name,
          contact: phone || '',
          phone:   phone || '',
          email:   customer_email,
          address: address || '',
          notes:   'Auto-added from customer portal',
        });
      }
    } catch (err) {
      console.log('Customer sync note:', err.message);
    }

    // 3 — Reduce stock for each ordered product
    try {
      const db = mongoose.connection.db;
      for (const item of processedItems) {
        // Find product by name (case-insensitive)
        const stock = await db.collection('stocks').findOne({
          product: { $regex: new RegExp(`^${item.product_name}$`, 'i') }
        });
        if (stock) {
          const newQty = Math.max(0, stock.stockQuantity - item.quantity);
          await db.collection('stocks').updateOne(
            { _id: stock._id },
            { $set: { stockQuantity: newQty, updatedAt: new Date() } }
          );
        }
      }
    } catch (stockErr) {
      console.log('Stock reduction note:', stockErr.message);
    }

    // 4 — Sync order to admin orders collection
    try {
      const db = mongoose.connection.db;
      await db.collection('orders').insertOne({
        customer_id:   customer_id,
        customer_name: customer_name,
        status:        'Pending',
        total_amount:  total_amount,
        notes:         notes || '',
        source:        'customer_portal',
        createdAt:     new Date(),
        updatedAt:     new Date(),
      });

      // Also sync items to orderitems collection
      for (const item of processedItems) {
        await db.collection('orderitems').insertOne({
          order_id:     order._id.toString(),
          product_id:   '',
          product_name: item.product_name,
          quantity:     item.quantity,
          unit_price:   item.unit_price,
          createdAt:    new Date(),
          updatedAt:    new Date(),
        });
      }
    } catch (syncErr) {
      console.log('Admin sync note:', syncErr.message);
    }

    return res.status(201).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get orders for a specific customer
router.get('/my/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.params.customerId }).sort({ createdAt: -1 });
    return res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get one order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;