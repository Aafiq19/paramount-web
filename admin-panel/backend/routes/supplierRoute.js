import express from 'express';
import { Supplier } from '../models/supplierModel.js';

const router = express.Router();

// Create a new supplier
router.post('/', async (request, response) => {
  try {
    if (!request.body.supplierName || !request.body.contact) {
      return response.status(400).send({
        message: 'Send all required fields: supplierName, contact',
      });
    }

    const newSupplier = {
      supplierName: request.body.supplierName,
      contact: request.body.contact,
      email: request.body.email || '',
      address: request.body.address || '',
      productsSupplied: request.body.productsSupplied || '',
    };

    const supplier = await Supplier.create(newSupplier);
    return response.status(201).send(supplier);
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get all suppliers
router.get('/', async (request, response) => {
  try {
    const suppliers = await Supplier.find({});
    return response.status(200).json({
      count: suppliers.length,
      suppliers: suppliers,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get one supplier by id
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const supplier = await Supplier.findById(id);
    return response.status(200).json(supplier);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Update a supplier
router.put('/:id', async (request, response) => {
  try {
    if (!request.body.supplierName || !request.body.contact) {
      return response.status(400).send({
        message: 'Send all required fields: supplierName, contact',
      });
    }

    const { id } = request.params;
    const result = await Supplier.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Supplier not found' });
    }

    return response.status(200).send({ message: 'Supplier updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete a supplier
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Supplier.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Supplier not found' });
    }

    return response.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;