import express from 'express';
import { Order } from '../models/orderModel.js';
import { OrderItem } from '../models/orderItemModel.js';

const router = express.Router();

// Create a new order + its items
router.post('/', async (request, response) => {
  try {
    if (!request.body.customer_name || !request.body.items || request.body.items.length === 0) {
      return response.status(400).send({
        message: 'Send all required fields: customer_name, items',
      });
    }

    // Calculate total
    const items = request.body.items;
    const total_amount = items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0
    );

    // Create order first
    const newOrder = await Order.create({
      customer_name: request.body.customer_name,
      customer_id:   request.body.customer_id || '',
      status:        request.body.status || 'Pending',
      total_amount,
      notes:         request.body.notes || '',
    });

    // Create each order item linked to the order
    const orderItems = items.map((item) => ({
      order_id:     newOrder._id.toString(),
      product_id:   item.product_id || '',
      product_name: item.product_name,
      quantity:     Number(item.quantity),
      unit_price:   Number(item.unit_price),
    }));

    await OrderItem.insertMany(orderItems);

    return response.status(201).send({ order: newOrder, items: orderItems });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get all orders with their items
router.get('/', async (request, response) => {
  try {
    const orders = await Order.find({});

    // Attach items to each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order_id: order._id.toString() });
        return { ...order.toObject(), items };
      })
    );

    return response.status(200).json({ count: orders.length, orders: ordersWithItems });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get one order with its items
router.get('/:id', async (request, response) => {
  try {
    const order = await Order.findById(request.params.id);
    if (!order) return response.status(404).json({ message: 'Order not found' });

    const items = await OrderItem.find({ order_id: order._id.toString() });
    return response.status(200).json({ ...order.toObject(), items });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Update an order and its items
router.put('/:id', async (request, response) => {
  try {
    if (!request.body.customer_name) {
      return response.status(400).send({ message: 'customer_name is required' });
    }

    const items = request.body.items || [];
    const total_amount = items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0
    );

    const result = await Order.findByIdAndUpdate(request.params.id, {
      customer_name: request.body.customer_name,
      status:        request.body.status,
      total_amount,
      notes:         request.body.notes || '',
    });

    if (!result) return response.status(404).json({ message: 'Order not found' });

    // Replace old items with new ones
    await OrderItem.deleteMany({ order_id: request.params.id });
    if (items.length > 0) {
      const orderItems = items.map((item) => ({
        order_id:     request.params.id,
        product_id:   item.product_id || '',
        product_name: item.product_name,
        quantity:     Number(item.quantity),
        unit_price:   Number(item.unit_price),
      }));
      await OrderItem.insertMany(orderItems);
    }

    return response.status(200).send({ message: 'Order updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete an order and its items
router.delete('/:id', async (request, response) => {
  try {
    const result = await Order.findByIdAndDelete(request.params.id);
    if (!result) return response.status(404).json({ message: 'Order not found' });

    // Also delete related items
    await OrderItem.deleteMany({ order_id: request.params.id });

    return response.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;