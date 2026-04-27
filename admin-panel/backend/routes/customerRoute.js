import express from 'express';
import { Customer } from '../models/customerModel.js';

const router = express.Router();

// Create a new customer
router.post('/', async (request, response) => {
  try {
    if (!request.body.name || !request.body.contact) {
      return response.status(400).send({
        message: 'Send all required fields: name, contact',
      });
    }

    const newCustomer = {
      name: request.body.name,
      contact: request.body.contact,
      email: request.body.email || '',
      address: request.body.address || '',
      notes: request.body.notes || '',
    };

    const customer = await Customer.create(newCustomer);
    return response.status(201).send(customer);
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get all customers
router.get('/', async (request, response) => {
  try {
    const customers = await Customer.find({});
    return response.status(200).json({
      count: customers.length,
      customers: customers,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get one customer by id
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const customer = await Customer.findById(id);
    return response.status(200).json(customer);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Update a customer
router.put('/:id', async (request, response) => {
  try {
    if (!request.body.name || !request.body.contact) {
      return response.status(400).send({
        message: 'Send all required fields: name, contact',
      });
    }

    const { id } = request.params;
    const result = await Customer.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Customer not found' });
    }

    return response.status(200).send({ message: 'Customer updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete a customer
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Customer.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Customer not found' });
    }

    return response.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;